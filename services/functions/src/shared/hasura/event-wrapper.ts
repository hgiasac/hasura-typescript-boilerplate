/* eslint-disable id-blacklist */
import * as env from "../env";
import { Logger } from "winston";
import { logger, LOG_LEVEL_WARN } from "../logger";
import { Handler, Request } from "express";
import {
  HASURA_EVENT_TRIGGER_ERROR_STATUS,
  HASURA_EVENT_TRIGGER_SUCCESS_STATUS,
  HasuraEventTriggerEvent,
  HasuraEventTriggerManual,
  AnyObject,
  HasuraEventTriggerPayload
} from "./types";

export type EventContext = {
  readonly request: Request
  readonly logger: Logger
};

type ExtraLoggingInfo = {
  readonly startTime: Date
};

export type EventTriggerPayload =
  HasuraEventTriggerPayload<HasuraEventTriggerManual>;

export type EventTriggerHandler<P extends HasuraEventTriggerEvent, R = AnyObject> =
  (ctx: EventContext, payload: HasuraEventTriggerPayload<P>) => Promise<R>;

export type EventTriggerHandlerMap = {
  readonly [key: string]: EventTriggerHandler<HasuraEventTriggerEvent>
};

export function withEventTrigger(events: EventTriggerHandlerMap): Handler {
  return (req, res) => {
    const extraLoggingInfo = {
      startTime: new Date()
    };

    const body = req.body as EventTriggerPayload;

    const childLogger = logger.child({
      type: "trigger"
    });

    if (!body || !body.trigger || !body.trigger.name) {
      const error = { message: "Empty trigger name" };

      childLogger.log({
        error,
        level: LOG_LEVEL_WARN,
        ...serializeTriggerRequest(req, extraLoggingInfo),
        message: error.message,
        http_code: HASURA_EVENT_TRIGGER_SUCCESS_STATUS
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
        ...serializeTriggerRequest(req, extraLoggingInfo),
        http_code: HASURA_EVENT_TRIGGER_ERROR_STATUS
      });

      return res.status(HASURA_EVENT_TRIGGER_ERROR_STATUS)
        .json(error);

    }

    return ev({ request: req, logger: childLogger }, body)
      .then((result) => {

        childLogger.info(`executed trigger ${body.trigger.name} successfully`, {
          ...serializeTriggerRequest(req, extraLoggingInfo),
          response: env.DEBUG ? result : undefined,
          http_code: HASURA_EVENT_TRIGGER_SUCCESS_STATUS
        });

        return res.status(HASURA_EVENT_TRIGGER_SUCCESS_STATUS)
          .json(result);
      })
      .catch((err) => {

        logger.error(err.message, {
          ...serializeTriggerRequest(req, extraLoggingInfo),
          error: err,
          http_code: HASURA_EVENT_TRIGGER_ERROR_STATUS
        });

        return res.status(HASURA_EVENT_TRIGGER_ERROR_STATUS)
          .json({
            code: err.code,
            message: err.message
          });
      });
  };
}

function serializeTriggerRequest(req: Request, info: ExtraLoggingInfo): any {
  const body = req.body as EventTriggerPayload;

  return {
    request_body: req.body,
    request_header: req.headers,
    trigger_name: body.trigger.name,
    latency: new Date().getTime() - info.startTime.getTime()
  };
}
