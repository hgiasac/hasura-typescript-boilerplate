import { Response, Router } from "express";
import eventHandler from "./events";
import { withExpress } from "hasura-node-types";
import { DEBUG } from "./shared/env";
import { logger } from "./shared/logger";

const healthHandler = (_, res: Response): Response =>
  res.status(200).send("OK");

export function newRouter(): Router {
  const router = Router();

  router.post("/events", withExpress({
    debug: DEBUG,
    logger
  }).useEvents(eventHandler));
  router.get("/health", healthHandler);

  return router;
}
