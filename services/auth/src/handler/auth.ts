import { Request, Response } from "express";
import { JwtAuth } from "../shared/auth/jwt";
import { AuthorizationHeader, AuthBearer, HASURA_ROLE_ANONYMOUS, XHasuraRole, XHasuraUserID } from "../shared/types";

export async function authenticationHandler(req: Request, res: Response) {
  const token = req.get(AuthorizationHeader);
  const anonymous = {
    [XHasuraRole]: HASURA_ROLE_ANONYMOUS,
  };

  // TODO: verify token
  if (!token) {
    return res.json(anonymous);
  }

  const parts = token.split(" ");

  try {

    if (parts.length < 2 || parts[0] !== AuthBearer) {
      return res.json(anonymous);
    }

    const decodedToken = await JwtAuth.verifyToken(parts[1]);
    const user = await JwtAuth.findUserByID(decodedToken.id);

    if (!user || user.deleted) {
      return res.json(anonymous);
    }

    return res.json({
      [XHasuraUserID]: user.id,
      [XHasuraRole]: user.role,
    });
  } catch (err) {
    console.error("authenticated failure: ", err);

    return res.json(anonymous);
  }

}
