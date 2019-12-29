import * as jwt from "jsonwebtoken";
import { SESSION_KEY } from "../env";
import { requestGQL } from "../http-client";
import { Role } from "../types";

export interface IAuthUser {
  id: string;
  status: string;
  email: string;
  fullName: string;
  password: string;
  role: Role;
  createdBy: string;
  updatedBy: string;
}
type VerifyTokenFunc = (token: string) => Promise<IAuthUser>;
type FindUserByIDFunc = (id: string) => Promise<IAuthUser>;

export interface IJwtAuth {
  verifyToken: VerifyTokenFunc;
  findUserByID: FindUserByIDFunc;
}

const verifyToken: VerifyTokenFunc = async (token) => {
  const result = jwt.verify(token, SESSION_KEY);

  if (typeof result !== "object" || Array.isArray(result) || !(<any> result).id) {
    throw new Error("invalid token");
  }

  return <any> result;
};

const findUserByID: FindUserByIDFunc = async (id) => {

  const query = `
    query findUserByID($id: uuid!) {
      users(where: {
        id: { _eq: $id }
      }) {
        id
        fullName
        email
        password
        role
        createdAt
        createdBy
        updatedAt
        updatedBy
        status
      }
    }
  `;

  return requestGQL<{ users: IAuthUser[] }>({
    query,
    variables: { id },
    isAdmin: true
  }).then((rs) => rs.users[0]);
};

export const JwtAuth: IJwtAuth = {
  verifyToken,
  findUserByID,
};
