import { Response, Router } from "express";
import useActions from "../actions";
import useEvents from "../events";

const healthHandler = (_, res: Response): Response =>
  res.status(200).send("OK");

export function newRouter(): Router {
  const router = Router();

  useActions(router);
  useEvents(router);
  router.get("/health", healthHandler);

  return router;
}
