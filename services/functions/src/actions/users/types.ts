/* eslint-disable @typescript-eslint/indent */

import { ActionHandler } from "../../shared/hasura/action-wrapper";
import { HasuraActionPayload } from "../../shared/hasura/types";
import { CreateUserInput, AuthUser, UserID } from "../../shared/auth/firebase";

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
