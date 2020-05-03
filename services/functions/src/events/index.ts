import { Router } from "express";
import helloHandler from "./hello";

export default function (router: Router): Router {
  router.post("/action-hello", helloHandler);

  return router;
}
