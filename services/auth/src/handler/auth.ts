import { Request, Response } from "express";

const AuthenticationHeader = "authorization";
const AnonymousRole = "anonymous";
const AdminRole = "admin";
const XHasuraRole = "X-Hasura-Role";
const XHasuraUserID = "X-Hasura-User-Id";

export async function authenticationHandler(req: Request, res: Response) {

  const token = req.get(AuthenticationHeader);
  const anonymous = {
    [XHasuraRole]: AnonymousRole,
  };

  // TODO: verify token
  if (!token || token !== "hasura") {
    return res.json(anonymous);
  }

  return res.json({
    [XHasuraUserID]: "1",
    [XHasuraRole]: AdminRole
  });
}
