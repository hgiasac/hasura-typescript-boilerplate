import { Response, Router } from "express";
import { actionHandler } from "./hasura";

const healthHandler = (_, res: Response): Response =>
  res.status(200).send("OK");

export function newRouter(): Router {
  const router = Router();

  router.post("/actions", actionHandler);
  router.get("/health", healthHandler);

  return router;
}
