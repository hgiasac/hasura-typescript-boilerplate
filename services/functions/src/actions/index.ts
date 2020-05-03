import { actionUsers } from "./users";
import { Router } from "express";

export default function (router: Router): Router {
  router.post("/action-users", actionUsers);

  return router;
}
