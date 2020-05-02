import { Request, Response } from "express";
import { FirebaseAuth } from "../shared/auth/firebase";
import {
  AuthorizationHeader,
  AuthBearer,
  HASURA_ROLE_ANONYMOUS,
  XHasuraRole,
  XHasuraUserID,
  XHasuraFirebaseID
} from "../shared/types";
import { logger } from "../shared/logger";
import * as env from "../shared/env";

export async function authenticationHandler(req: Request, res: Response): Promise<Response<any>> {

  const start = new Date();

  const token = req.get(AuthorizationHeader);
  const anonymous = {
    [XHasuraRole]: HASURA_ROLE_ANONYMOUS
  };

  const childLogger = logger.child({
    type: "auth"
  });

  try {
    const parts = token.split(" ");

    if (!token || parts.length < 2 || parts[0] !== AuthBearer) {

      childLogger.warn("invalid authorization token", {
        request_headers: req.headers,
        session_variables: anonymous,
        http_code: 200,
        latency: new Date().getTime() - start.getTime()
      });

      return res.json(anonymous);
    }

    const decodedToken = await FirebaseAuth.verifyToken(parts[1]);
    const user = await FirebaseAuth.findUserByFirebaseId(decodedToken.uid);

    if (!user) {

      const noUserData = {
        [XHasuraRole]: HASURA_ROLE_ANONYMOUS,
        [XHasuraFirebaseID]: decodedToken.uid
      };

      childLogger.error("user not found, but firebase user exists", {
        request_headers: req.headers,
        session_variables: noUserData,
        http_code: 200,
        latency: new Date().getTime() - start.getTime()
      });

      // the user is registered on firebase, we can let client side create user by firebase id
      return res.json(noUserData);
    }

    const jsonData = {
      [XHasuraUserID]: user.id,
      [XHasuraRole]: user.role
    };

    if (user.deleted) {
      childLogger.warn("User is deleted.", {
        request_headers: env.DEBUG ? req.headers : {},
        session_variables: jsonData,
        http_code: 200,
        latency: new Date().getTime() - start.getTime()
      });

      return res.json(anonymous);

    }

    childLogger.info("finish authentication", {
      request_headers: env.DEBUG ? req.headers : {},
      session_variables: jsonData,
      http_code: 200,
      latency: new Date().getTime() - start.getTime()
    });

    return res.json(jsonData);
  } catch (err) {
    console.error("authentication failure", err);

    childLogger.error("authentication failure", {
      request_headers: env.DEBUG ? req.headers : {},
      session_variables: anonymous,
      http_code: 200,
      latency: new Date().getTime() - start.getTime(),
      error: {
        message: err.message,
        ...err
      }
    });

    return res.status(200).json(anonymous);
  }

}
