import { Request, Response } from "express";
import { logger } from "../shared/logger";
import * as env from "../shared/env";
const AuthenticationHeader = "authorization";
const AnonymousRole = "anonymous";
const AdminRole = "admin";
const XHasuraRole = "X-Hasura-Role";
const XHasuraUserID = "X-Hasura-User-Id";

export function authenticationHandler(req: Request, res: Response): Response<any> {

  const start = new Date();

  const token = req.get(AuthenticationHeader);
  const anonymous = {
    [XHasuraRole]: AnonymousRole
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
    [XHasuraRole]: AdminRole
  };

  childLogger.info("finish authentication", {
    request_headers: env.DEBUG ? req.headers : {},
    session_variables: jsonData,
    http_code: 200,
    latency: new Date().getTime() - start.getTime()
  });

  return res.json(jsonData);
}
