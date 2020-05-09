/* eslint-disable @typescript-eslint/indent */
import {
  IAuthUser,
  IChangeProfilePasswordInput,
  IChangeUserPasswordInput,
  CreateUserInput,
  UserID
} from "../../shared/auth/jwt";
import { HasuraActionPayload } from "hasura-node-types";
import { HasuraRole } from "../../shared/types";
import { ActionHandler } from "../types";

export type LoginInput = {
  readonly email: string
  readonly password: string
};

export type TokenResponse = {
  readonly id: string
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly role: HasuraRole
  readonly updatedAt: string
  readonly createdAt: string
  readonly token: string
};

export type IUserIDResponse = {
  readonly userId: UserID
};

export const LOGIN_ACTION = "login";
export const CREATE_USER_ACTION = "createUser";
export const CHANGE_USER_PASSWORD_ACTION = "changeUserPassword";
export const CHANGE_PROFILE_PASSWORD_ACTION = "changeProfilePassword";

export type LoginAction = ActionHandler<
  HasuraActionPayload<{ readonly data: LoginInput }, typeof LOGIN_ACTION>,
  TokenResponse
>;

export type CreateUserAction = ActionHandler<
  HasuraActionPayload<{ readonly data: CreateUserInput }, typeof CREATE_USER_ACTION>,
  IAuthUser
>;

export type ChangeUserPassword = ActionHandler<
  HasuraActionPayload<{ readonly data: IChangeUserPasswordInput }, typeof CHANGE_USER_PASSWORD_ACTION>,
  IUserIDResponse
>;

export type ChangeProfilePassword = ActionHandler<
  HasuraActionPayload<{ readonly data: IChangeProfilePasswordInput }, typeof CHANGE_PROFILE_PASSWORD_ACTION>,
  IUserIDResponse
>;
