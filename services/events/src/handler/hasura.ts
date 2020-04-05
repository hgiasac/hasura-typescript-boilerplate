import { Handler } from "express";
import actions from "../actions";
import { ActionPayload } from "../actions/types";
import events from "../events";
import { EventTriggerPayload } from "../events/types";
import * as env from "../shared/env";
import { logger } from "../shared/logger";

export const eventHandler: Handler = (req, res) => {
  const body = <EventTriggerPayload> req.body;

  if (!body || !body.trigger || !body.trigger.name) {
    return res.status(400)
      .json({ message: "Empty trigger name" });
  }

  const ev = events[body.trigger.name];

  if (!ev) {
    return res.status(400)
      .json({
        message: `trigger name ${body.trigger.name} doesn't exist`
      });

  }

  return ev(req, body)
    .then((result) => res.status(200).json(result))
    .catch((err) => {

      logger.error("executed trigger failed: ", err);
      logger.debug("Payload", body)

      return res.status(400)
        .json({
          code: err.code,
          message: err.message
        });
    });
};

export const actionHandler: Handler = (req, res) => {
  const body = <ActionPayload> req.body;

  if (env.DEBUG) {
    console.log("Execute action. Payload", body);
  }

  if (!body || !body.action || !body.action.name) {
    return res.status(400)
      .json({ message: "Empty action name" });
  }

  const ev = actions[body.action.name];

  if (!ev) {
    return res.status(400)
      .json({
        message: `Action ${body.action} doesn't exist`
      });

  }

  return ev(req, body)
    .then((result) => res.status(200).json(result))
    .catch((err) => {

      logger.error("Executed action failed: ", err);
      logger.debug("Payload", body)

      return res.status(400)
        .json({
          code: err.code,
          message: err.message
        });
    });
};
