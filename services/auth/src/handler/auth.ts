import { Request, Response } from "express";
import { JwtAuth } from "../shared/auth/jwt";
import { logger } from "../shared/logger";
import * as env from "../shared/env";
import { AuthorizationHeader, AuthBearer, HASURA_ROLE_ANONYMOUS, XHasuraRole, XHasuraUserID } from "../shared/types";

export async function authenticationHandler(req: Request, res: Response): Promise<Response> {

  const start = new Date();
  const token = req.get(AuthorizationHeader);
  const anonymous = {
    [XHasuraRole]: HASURA_ROLE_ANONYMOUS
  };

  const childLogger = logger.child({
    type: "auth"
  });

  // TODO: verify token
  if (!token) {

    childLogger.info("authorization header is empty", {
      request_headers: env.DEBUG ? req.headers : {},
      session_variables: anonymous,
      http_code: 200,
      latency: new Date().getTime() - start.getTime()
    });

    return res.json(anonymous);
  }

  const parts = token.split(" ");

  try {

    if (parts.length < 2 || parts[0] !== AuthBearer) {
      childLogger.warn("invalid authorization token", {
        request_headers: req.headers,
        session_variables: anonymous,
        http_code: 200,
        latency: new Date().getTime() - start.getTime()
      });

      return res.json(anonymous);
    }

    const decodedToken = await JwtAuth.verifyToken(parts[1]);
    const user = await JwtAuth.findUserByID(decodedToken.id);

    if (!user || user.deleted) {
      childLogger.warn("user is not found or deleted", {
        request_headers: req.headers,
        session_variables: anonymous,
        http_code: 200,
        latency: new Date().getTime() - start.getTime()
      });

      return res.json(anonymous);
    }

    const jsonData = {
      [XHasuraUserID]: user.id,
      [XHasuraRole]: user.role
    };

    childLogger.info("finish authentication", {
      request_headers: env.DEBUG ? req.headers : {},
      session_variables: jsonData,
      http_code: 200,
      latency: new Date().getTime() - start.getTime()
    });

    return res.json(jsonData);
  } catch (err) {

    childLogger.error("authenticated failure", {
      request_headers: req.headers,
      session_variables: anonymous,
      http_code: 200,
      latency: new Date().getTime() - start.getTime(),
      error: {
        message: err.message,
        ...err
      }
    });

    return res.json(anonymous);
  }
}
