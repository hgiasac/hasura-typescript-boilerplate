import { Request, Response } from "express";
import { FirebaseAuth } from "../shared/auth/firebase";
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

  try {
    const parts = token.split(" ");

    if (parts.length < 2 || parts[0] !== AuthBearer) {
      throw new Error("Invalid authorized token");
    }

    const decodedToken = await FirebaseAuth.verifyToken(parts[1]);
    const user = await FirebaseAuth.findUserByFirebaseId(decodedToken.uid);

    if (!user) {
      throw new Error("user not found");
    }

    if (user.deleted) {
      throw new Error("User is deleted. Please contact administator");
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
