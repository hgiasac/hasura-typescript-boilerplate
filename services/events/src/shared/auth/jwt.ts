import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { PASSWORD_SALT, SESSION_EXPIRY, SESSION_KEY } from "../env";
import { requestGQL } from "../http-client";
import { HasuraRole, Status, STATUS_ACTIVE } from "../types";
import { UnauthorizedError } from "./types";

export interface ICreateUserInput {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: HasuraRole;
  created_by: string;
  updated_by: string;
  status: Status;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IAuthUser extends ICreateUserInput {
  id: string;
  created_at: string;
  updated_at: string;
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

  if (typeof result !== "object" || Array.isArray(result) || !(result as any).id) {
    throw new Error("invalid token");
  }

  return result as any;
};

const login: LoginFunc = async (input) => {

  const query = `
    query findUserByEmail($email: String!) {
      users(where: {
        email: { _eq: $email }
      }) {
        id
        email
        first_name
        last_name
        password
        role
        status
        updated_at
        created_at
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

  if (user.status !== STATUS_ACTIVE) {
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
