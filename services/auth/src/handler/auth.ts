import { Request, Response } from "express";
import { JwtAuth } from "../shared/auth/jwt";
import { AuthorizationHeader, Role, Status, XHasuraRole, XHasuraUserID } from "../shared/types";

export async function authenticationHandler(req: Request, res: Response) {

  const token = req.get(AuthorizationHeader);
  const anonymous = {
    [XHasuraRole]: Role.Anonymous.toLowerCase(),
  };

  // TODO: verify token
  if (!token) {
    return res.json(anonymous);
  }

  try {
    const decodedToken = await JwtAuth.verifyToken(token);
    const user = await JwtAuth.findUserByID(decodedToken.id);

    if (!user) {
      throw new Error("user not found");
    }

    if (user.status !== Status.Active) {
      throw new Error("user is " + user.status);
    }

    return res.json({
      [XHasuraUserID]: user.id,
      [XHasuraRole]: user.role,
    });
  } catch (err) {
    return res.status(401).json({
      message: err.message,
    });
  }

}
