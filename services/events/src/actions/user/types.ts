
import { IAuthUser, ICreateUserInput } from "../../shared/auth/jwt";
import { HasuraRole, IHasuraActionPayload } from "../../shared/types";
import { ActionHandler } from "../types";

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ITokenResponse {
  id: string;
  email: string;
  fullName: string;
  role: HasuraRole;
  token: string;
}

export const LOGIN_ACTION = "login";
export const CREATE_USER_ACTION = "createUser";

export type LoginAction = ActionHandler<
  IHasuraActionPayload<typeof LOGIN_ACTION, ILoginInput>,
  ITokenResponse
>;

export type CreateUserAction = ActionHandler<
  IHasuraActionPayload<typeof CREATE_USER_ACTION, ICreateUserInput>,
  IAuthUser
>;
