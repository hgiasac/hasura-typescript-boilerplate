
import { IAuthUser, ICreateUserInput } from "../../shared/auth/jwt";
import { HasuraRole, IHasuraActionPayload, Status } from "../../shared/types";
import { ActionHandler } from "../types";

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ITokenResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: HasuraRole;
  status: Status;
  updated_at: string;
  created_at: string;
  token: string;
}

export const LOGIN_ACTION = "login";
export const CREATE_USER_ACTION = "createUser";

export type LoginAction = ActionHandler<
  IHasuraActionPayload<typeof LOGIN_ACTION, { data: ILoginInput }>,
  ITokenResponse
>;

export type CreateUserAction = ActionHandler<
  IHasuraActionPayload<typeof CREATE_USER_ACTION, { data: ICreateUserInput }>,
  IAuthUser
>;
