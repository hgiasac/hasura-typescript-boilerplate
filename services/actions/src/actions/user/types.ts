/* eslint-disable @typescript-eslint/indent */

import { AuthUser, CreateUserInput, UserID } from "../../shared/auth/firebase";
import { HasuraActionPayload } from "../../shared/types";
import { ActionHandler } from "../types";

export const CREATE_USER_ACTION = "createUser";
export const CHANGE_USER_PASSWORD_ACTION = "changeUserPassword";
export const HELLO_ACTION = "hello";

export type CreateUserAction = ActionHandler<
  HasuraActionPayload<
    typeof CREATE_USER_ACTION,
    { readonly data: CreateUserInput }
  >,
  AuthUser>;

export type ChangeUserPasswordInput = {
  readonly userId: UserID
  readonly password: string
};

export type ChangeUserPasswordOutput = {
  readonly userId: UserID
};

export type ChangeUserPasswordAction = ActionHandler<
  HasuraActionPayload<typeof CHANGE_USER_PASSWORD_ACTION, { readonly data: ChangeUserPasswordInput }>,
  ChangeUserPasswordOutput
>;

export type HelloAction = ActionHandler<
  HasuraActionPayload<typeof HELLO_ACTION, {}>,
  { readonly hello: string }
>;
