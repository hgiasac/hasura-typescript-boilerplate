
import { IAuthUser, IChangeProfilePasswordInput, IChangeUserPasswordInput, ICreateUserInput, UserID } from "../../shared/auth/jwt";
import { HasuraRole, IHasuraActionPayload } from "../../shared/types";
import { ActionHandler } from "../types";

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ITokenResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: HasuraRole;
  updatedAt: string;
  createdAt: string;
  token: string;
}

export interface IUserIDResponse {
  userId: UserID;
}

export const LOGIN_ACTION = "login";
export const CREATE_USER_ACTION = "createUser";
export const CHANGE_USER_PASSWORD_ACTION = "changeUserPassword";
export const CHANGE_PROFILE_PASSWORD_ACTION = "changeProfilePassword";

export type LoginAction = ActionHandler<
  IHasuraActionPayload<typeof LOGIN_ACTION, { data: ILoginInput }>,
  ITokenResponse
>;

export type CreateUserAction = ActionHandler<
  IHasuraActionPayload<typeof CREATE_USER_ACTION, { data: ICreateUserInput }>,
  IAuthUser
>;

export type ChangeUserPassword = ActionHandler<
  IHasuraActionPayload<typeof CHANGE_USER_PASSWORD_ACTION, { data: IChangeUserPasswordInput }>,
  IUserIDResponse
>;

export type ChangeProfilePassword = ActionHandler<
  IHasuraActionPayload<typeof CHANGE_PROFILE_PASSWORD_ACTION, { data: IChangeProfilePasswordInput }>,
  IUserIDResponse
>;
