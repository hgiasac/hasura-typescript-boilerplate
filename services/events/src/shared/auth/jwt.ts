import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { PASSWORD_SALT, SESSION_EXPIRY, SESSION_KEY } from "../env";
import { requestGQL } from "../http-client";
import { Role, Status } from "../types";
import { UnauthorizedError } from "./types";

export interface ICreateUserInput {
  email: string;
  fullName: string;
  password: string;
  role: Role;
  createdBy: string;
  updatedBy: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IAuthUser extends ICreateUserInput {
  id: string;
  status: string;
}

type CreateUserFunc = (input: ICreateUserInput) => Promise<IAuthUser>;
type EncodeTokenFunc = (user: IAuthUser) => Promise<string>;
type VerifyTokenFunc = (token: string) => Promise<IAuthUser>;
type LoginFunc = (user: ILoginInput) => Promise<IAuthUser>;

export interface IJwtAuth {
  createUser: CreateUserFunc;
  encodeToken: EncodeTokenFunc;
  verifyToken: VerifyTokenFunc;
  login: LoginFunc;
}

const hashPassword = (pw: string) => bcrypt.hash(pw, PASSWORD_SALT);
const comparePassword = bcrypt.compare;

const createUser: CreateUserFunc = async (input) => {
  const hashedPassword = await hashPassword(input.password);

  const query = `
    mutation insertUser($object: users_insert_input!) {
      insert_users(objects: [$object]) {
        affected_rows
        returning {
          id
          fullName
          email
          role
          createdAt
          createdBy
          status
        }
      }
    }
  `;

  return requestGQL({
    query,
    variables: {
      object: {
        ...input,
        email: input.email.trim().toLowerCase(),
        password: hashedPassword,
      }
    },
    isAdmin: true
  }).then((resp) => resp.insert_users.returning[0]);
};

const encodeToken: EncodeTokenFunc = (user) =>
  Promise.resolve(jwt.sign(user, SESSION_KEY, {
    expiresIn: SESSION_EXPIRY,
  }));

const verifyToken: VerifyTokenFunc = async (token) => {
  const result = jwt.verify(token, SESSION_KEY);

  if (typeof result !== "object" || Array.isArray(result) || !(<any> result).id) {
    throw new Error("invalid token");
  }

  return <any> result;
};

const login: LoginFunc = async (input) => {

  const query = `
    query findUserByEmail($email: String!) {
      users(where: {
        email: { _eq: $email }
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

  const resp = await requestGQL<{ users: IAuthUser[] }>({
    query,
    variables: { email: input.email.trim().toLowerCase() },
    isAdmin: true
  }).then((rs) => rs.users);

  if (!resp.length) {
    throw new UnauthorizedError("User not found");
  }

  const user = resp[0];
  const isMatched = await comparePassword(input.password, user.password);
  if (!isMatched) {
    throw new UnauthorizedError("Wrong password");
  }

  if (user.status !== Status.Active) {
    throw new UnauthorizedError("User is " + user.status);
  }

  return user;
};

export const JwtAuth: IJwtAuth = {
  createUser,
  encodeToken,
  verifyToken,
  login
};
