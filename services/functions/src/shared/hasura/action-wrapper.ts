/* eslint-disable id-blacklist */
import { Handler, Request } from "express";
import * as env from "../env";
import { logger } from "../logger";
import {
  HASURA_ACTION_ERROR_STATUS,
  HASURA_ACTION_SUCCESS_STATUS,
  AnyObject,
  HasuraActionPayload
} from "./types";

import { Logger } from "winston";

export type ActionPayload = HasuraActionPayload;

export type ActionContext = {
  readonly request: Request
  readonly logger: Logger
};

export type ActionHandler<P extends HasuraActionPayload, R = AnyObject> =
  (ctx: ActionContext, payload: P) => Promise<R>;

export type ActionHandlerMap = {
  readonly [key: string]: ActionHandler<ActionPayload>
};

type ExtraLoggingInfo = {
  readonly startTime: Date
};

export function withActions(actions: ActionHandlerMap): Handler {

  return (req, res) => {
    const extraLoggingInfo = {
      startTime: new Date()
    };

    const body = <ActionPayload>req.body;

    const childLogger = logger.child({
      type: "action"
    });

    if (!body || !body.action || !body.action.name) {

      const error = { message: "Empty action name" };
      childLogger.warn(error.message, {
        error,
        payload: req.body,
        request_headers: req.headers,
        http_code: HASURA_ACTION_ERROR_STATUS
      });

      return res.status(HASURA_ACTION_ERROR_STATUS)
        .json(error);
    }

    const ev = actions[body.action.name];

    if (!ev) {

      const error = {
        message: `Action ${body.action} doesn't exist`
      };

      childLogger.warn(error.message, {
        ...serializeActionRequest(req, extraLoggingInfo),
        error,
        http_code: HASURA_ACTION_ERROR_STATUS
      });

      return res.status(HASURA_ACTION_ERROR_STATUS)
        .json(error);

    }

    return ev({ request: req, logger: childLogger }, body)
      .then((result) => {

        childLogger.info(`executed ${body.action.name} successfully`, {
          ...serializeActionRequest(req, extraLoggingInfo),
          response: env.DEBUG ? result : undefined,
          http_code: HASURA_ACTION_SUCCESS_STATUS
        });

        return res.status(HASURA_ACTION_SUCCESS_STATUS).json(result);
      })
      .catch((err) => {
        logger.error(err.message, {
          ...serializeActionRequest(req, extraLoggingInfo),
          error: err,
          http_code: HASURA_ACTION_ERROR_STATUS
        });

        return res.status(HASURA_ACTION_ERROR_STATUS)
          .json({
            code: err.code,
            message: err.message
          });
      });
  };
}

function serializeActionRequest(req: Request, info: ExtraLoggingInfo): any {
  const payload = req.body as ActionPayload;

  return {
    action_name: payload.action.name,
    session_variables: payload.session_variables,
    request_headers: req.headers,
    request_body: payload.input,
    latency: new Date().getTime() - info.startTime.getTime()
  };
}
