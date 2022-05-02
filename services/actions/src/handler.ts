import actions from "./actions";
import { withExpress } from "hasura-node-types";
import { DEBUG } from "./shared/env";
import { logger } from "./shared/logger";
import { Response, Router } from "express";

const healthHandler = (_, res: Response): Response =>
  res.status(200).send("OK");

export function newRouter(): Router {
  const router = Router();

  router.post("/actions", withExpress({
    debug: DEBUG,
    logger
  }).useActions(actions));

  router.get("/health", healthHandler);

  return router;
}
