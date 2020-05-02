import * as jwt from "jsonwebtoken";
import { SESSION_KEY } from "../env";
import { requestGQL } from "../http-client";
import { HasuraRole } from "../types";

export type AuthUser = {
  readonly id: string
  readonly status: string
  readonly email: string
  readonly password: string
  readonly role: HasuraRole
  readonly deleted: boolean
};
type VerifyTokenFunc = (token: string) => Promise<AuthUser>;
type FindUserByIDFunc = (id: string) => Promise<AuthUser>;

export type IJwtAuth = {
  readonly verifyToken: VerifyTokenFunc
  readonly findUserByID: FindUserByIDFunc
};

const verifyToken: VerifyTokenFunc = (token): Promise<AuthUser> => {
  const result = jwt.verify(token, SESSION_KEY);

  if (typeof result !== "object" || Array.isArray(result) || !(result as any).id) {
    throw new Error("invalid token");
  }

  return Promise.resolve(result as any);
};

const findUserByID: FindUserByIDFunc = async (id) => {

  const query = `
    query findUserByID($id: uuid!) {
      users(where: {
        id: { _eq: $id }
      }) {
        id
        email
        password
        role
        deleted
      }
    }
  `;

  return requestGQL<{ readonly users: readonly AuthUser[] }>({
    query,
    variables: { id },
    isAdmin: true
  }).then((rs) => rs.users[0]);
};

export const JwtAuth: IJwtAuth = {
  verifyToken,
  findUserByID
};
