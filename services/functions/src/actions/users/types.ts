/* eslint-disable @typescript-eslint/indent */

import { CreateUserInput, AuthUser, UserID } from "../../shared/auth/firebase";
import { HasuraActionExpressHandler, HasuraActionPayload } from "hasura-node-types";

export const CREATE_USER_ACTION = "createUser";
export const CHANGE_USER_PASSWORD_ACTION = "changeUserPassword";
export const HELLO_ACTION = "hello";

export type CreateUserAction = HasuraActionExpressHandler<
  HasuraActionPayload<
    { readonly data: CreateUserInput },
    typeof CREATE_USER_ACTION
  >,
  AuthUser>;

export type ChangeUserPasswordInput = {
  readonly userId: UserID
  readonly password: string
};

export type ChangeUserPasswordOutput = {
  readonly userId: UserID
};

export type ChangeUserPasswordAction = HasuraActionExpressHandler<
  HasuraActionPayload<{
    readonly data: ChangeUserPasswordInput
  }, typeof CHANGE_USER_PASSWORD_ACTION>,
  ChangeUserPasswordOutput
>;

export type HelloAction = HasuraActionExpressHandler<
  HasuraActionPayload<Record<string, any>, typeof HELLO_ACTION>,
  { readonly hello: string }
>;
