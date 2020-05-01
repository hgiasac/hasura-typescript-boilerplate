import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { PASSWORD_SALT, SESSION_EXPIRY, SESSION_KEY } from "../env";
import { requestGQL } from "../http-client";
import { HasuraRole, IRequestHeaders, XHasuraRole, XHasuraUserID } from "../types";
import { UnauthorizedError } from "./types";

export type UserID = string;

export type CreateUserInput = {
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly password: string
  readonly role: HasuraRole
  readonly createdBy: string
  readonly updatedBy: string
};

export type LoginInput = {
  readonly email: string
  readonly password: string
};

export type IAuthUser = CreateUserInput & {
  readonly id: string
  readonly createdAt: string
  readonly updatedAt: string
  readonly deleted: boolean
};

export type IChangeUserPasswordInput = {
  readonly userId: string
  readonly password: string
};

export type IChangeProfilePasswordInput = {
  readonly userId: string
  readonly oldPassword: string
  readonly newPassword: string
};

type CreateUserFunc = (input: CreateUserInput) => Promise<IAuthUser>;
type EncodeTokenFunc = (user: IAuthUser) => Promise<string>;
type VerifyTokenFunc = (token: string) => Promise<IAuthUser>;
type LoginFunc = (user: LoginInput) => Promise<IAuthUser>;
type ChangeProfilePasswordFunc = (input: IChangeProfilePasswordInput) => Promise<UserID>;
type ChangeUserPasswordFunc = (input: IChangeUserPasswordInput, headers?: IRequestHeaders) => Promise<UserID>;

export type IJwtAuth = {
  readonly createUser: CreateUserFunc
  readonly encodeToken: EncodeTokenFunc
  readonly verifyToken: VerifyTokenFunc
  readonly login: LoginFunc
  readonly changeUserPassword: ChangeUserPasswordFunc
  readonly changeProfilePassword: ChangeProfilePasswordFunc
};

const hashPassword = (pw: string): Promise<string> => bcrypt.hash(pw, PASSWORD_SALT);
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
        password: hashedPassword
      }
    },
    isAdmin: true
  }).then((resp) => resp.insert_users.returning[0]);
};

const encodeToken: EncodeTokenFunc = (user) =>
  Promise.resolve(jwt.sign(user, SESSION_KEY, {
    expiresIn: SESSION_EXPIRY
  }));

const verifyToken: VerifyTokenFunc = (token): Promise<any> => {
  const result = jwt.verify(token, SESSION_KEY);

  if (typeof result !== "object" || Array.isArray(result) || !(result as any).id) {
    throw new Error("invalid token");
  }

  return Promise.resolve(result as any);
};

const login: LoginFunc = async (input) => {

  const query = `
    query findUserByEmail($email: String!) {
      users(where: {
        email: { _eq: $email }
      }) {
        id
        email
        firstName
        lastName
        password
        role
        deleted
        updatedAt
        createdAt
      }
    }
  `;

  const resp = await requestGQL<{ readonly users: readonly IAuthUser[] }>({
    query,
    variables: { email: input.email.trim().toLowerCase() },
    isAdmin: true
  }).then((rs) => rs.users);

  if (!resp.length || resp[0].deleted) {
    throw new UnauthorizedError("User not found");
  }

  const user = resp[0];

  const isMatched = await comparePassword(input.password, user.password);
  if (!isMatched) {
    throw new UnauthorizedError("Wrong password");
  }

  return user;
};

// change user password, used by manager/admin
export const changeUserPassword: ChangeUserPasswordFunc = async (input, headers = {}) => {

  const hashedPassword = await hashPassword(input.password);

  const query = `
      mutation changeUserPassword($userId: uuid!, $password: String!) {
        update_users(where: {
          id: { _eq: $userId }
        }, _set: {password: $password}) {
          affected_rows
        }
      }
  `;

  const affectedRows = await requestGQL({
    headers,
    query,
    variables: {
      userId: input.userId,
      password: hashedPassword
    },
    isAdmin: true
  }).then((data) => data.update_users.affected_rows);

  if (!affectedRows) {
    throw new Error("user not found!");
  }

  return input.userId;
};

// change current user password; require compare old password
export const changeProfilePassword: ChangeProfilePasswordFunc = async (input) => {
  // compare password
  const query = `
    query findUserPasswordById($id: uuid!) {
      users(where: {
        id: { _eq: $id }
      }) {
        id
        role
        password
        deleted
      }
    }
  `;

  const resp = await requestGQL<{ readonly users: readonly IAuthUser[] }>({
    query,
    variables: { id: input.userId },
    isAdmin: true
  }).then((rs) => rs.users);

  if (!resp.length || resp[0].deleted) {
    throw new Error("User not found");
  }

  const user = resp[0];
  const isMatched = await comparePassword(input.oldPassword, user.password);
  if (!isMatched) {
    throw new Error("Wrong password");
  }

  return changeUserPassword({
    userId: input.userId,
    password: input.newPassword
  }, {
    [XHasuraUserID]: user.id,
    [XHasuraRole]: user.role
  });
};

export const JwtAuth: IJwtAuth = {
  createUser,
  encodeToken,
  verifyToken,
  login,
  changeProfilePassword,
  changeUserPassword
};
