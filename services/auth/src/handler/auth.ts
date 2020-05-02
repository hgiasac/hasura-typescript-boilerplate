import { Request, Response } from "express";
import { logger } from "../shared/logger";
import * as env from "../shared/env";
import {
  AuthorizationHeader,
  XHasuraRole,
  HASURA_ROLE_ANONYMOUS,
  XHasuraUserID,
  HASURA_ROLE_ADMIN
} from "../shared/types";

export function authenticationHandler(req: Request, res: Response): Response<any> {

  const start = new Date();

  const token = req.get(AuthorizationHeader);
  const anonymous = {
    [XHasuraRole]: HASURA_ROLE_ANONYMOUS
  };

  const childLogger = logger.child({
    type: "auth"
  });

  // TODO: verify token
  if (!token || token !== "hasura") {
    childLogger.info("finish authentication", {
      request_headers: env.DEBUG ? req.headers : {},
      session_variables: anonymous,
      http_code: 200,
      latency: new Date().getTime() - start.getTime()
    });

    return res.json(anonymous);
  }

  const jsonData = {
    [XHasuraUserID]: "1",
    [XHasuraRole]: HASURA_ROLE_ADMIN
  };

  childLogger.info("finish authentication", {
    request_headers: env.DEBUG ? req.headers : {},
    session_variables: jsonData,
    http_code: 200,
    latency: new Date().getTime() - start.getTime()
  });

  return res.json(jsonData);
}
