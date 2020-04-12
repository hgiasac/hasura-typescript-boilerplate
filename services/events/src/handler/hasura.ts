import { Handler, Request } from "express";
import actions from "../actions";
import { ActionPayload } from "../actions/types";
import events from "../events";
import { EventTriggerPayload } from "../events/types";
import * as env from "../shared/env";
import { logger, LOG_LEVEL_WARN } from "../shared/logger";

export const eventHandler: Handler = (req, res) => {
  const body = req.body as EventTriggerPayload;

  const childLogger = logger.child({
    type: "trigger",
  });

  if (!body || !body.trigger || !body.trigger.name) {
    const error = { message: "Empty trigger name" };

    childLogger.log({
      error,
      level: LOG_LEVEL_WARN,
      ...serializeTriggerRequest(req),
      message: error.message,
      http_code: 400,
    });

    return res.status(400)
      .json(error);
  }

  const ev = events[body.trigger.name];

  if (!ev) {
    const error = {
      message: `trigger name ${body.trigger.name} doesn't exist`
    };

    childLogger.log({
      error,
      message: error.message,
      level: LOG_LEVEL_WARN,
      ...serializeTriggerRequest(req),
      http_code: 400,
    });

    return res.status(400)
      .json(error);

  }

  return ev(req, body)
    .then((result) => {

      childLogger.info(`executed trigger ${body.trigger.name} successfully`, {
        ...serializeTriggerRequest(req),
        response: env.DEBUG ? result : undefined,
        http_code: 200,
      });

      return res.status(200).json(result);
    })
    .catch((err) => {

      logger.error(err.message, {
        ...serializeTriggerRequest(req),
        error: err,
        http_code: 400,
      });

      return res.status(400)
        .json({
          code: err.code,
          message: err.message
        });
    });
};

export const actionHandler: Handler = (req, res) => {
  const body = req.body as ActionPayload;

  const childLogger = logger.child({
    type: "action"
  });

  if (!body || !body.action || !body.action.name) {

    const error = { message: "Empty action name" };
    childLogger.warn(error.message, {
      error,
      payload: req.body,
      request_headers: req.headers,
      http_code: 400,
    });

    return res.status(400)
      .json(error);
  }

  const ev = actions[body.action.name];

  if (!ev) {

    const error = {
      message: `Action ${body.action} doesn't exist`
    };

    childLogger.warn(error.message, {
      ...serializeActionRequest(req),
      error,
      http_code: 400,
    });

    return res.status(400)
      .json(error);

  }

  return ev({ request: req, logger: childLogger }, body)
    .then((result) => {

      childLogger.info(`executed ${body.action.name} successfully`, {
        ...serializeActionRequest(req),
        response: env.DEBUG ? result : undefined,
        http_code: 200,
      });

      return res.status(200).json(result);
    })
    .catch((err) => {
      logger.error(err.message, {
        ...serializeActionRequest(req),
        error: err,
        http_code: 400,
      });

      return res.status(400)
        .json({
          code: err.code,
          message: err.message
        });
    });
};

function serializeActionRequest(req: Request) {
  const payload = req.body as ActionPayload;

  return {
    action_name: payload.action.name,
    session_variables: payload.session_variables,
    request_headers: req.headers,
    request_body: payload.input,
  };
}

function serializeTriggerRequest(req: Request) {
  const body = req.body as EventTriggerPayload;

  return {
    request_body: req.body,
    request_header: req.headers,
    trigger_name: body.trigger.name,
  }
}
