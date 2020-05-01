import { Response, Router } from "express";
import { authenticationHandler } from "./auth";

const healthHandler = (_, res: Response): Response<any> =>
  res.status(200).send("OK");

export function newRouter(): Router {
  const router = Router();

  router.get("/health", healthHandler);
  router.get("/verify", authenticationHandler);

  return router;
}
