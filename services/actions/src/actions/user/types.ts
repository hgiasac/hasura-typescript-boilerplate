/* eslint-disable @typescript-eslint/indent */
import { AuthUser, CreateUserInput, UserID } from "../../shared/auth/firebase";
import { HasuraActionPayload } from "hasura-node-types";
import { ActionHandler } from "../types";

export const CREATE_USER_ACTION = "createUser";
export const CHANGE_USER_PASSWORD_ACTION = "changeUserPassword";
export const HELLO_ACTION = "hello";

export type CreateUserAction = ActionHandler<
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

export type ChangeUserPasswordAction = ActionHandler<
  HasuraActionPayload<{ readonly data: ChangeUserPasswordInput }, typeof CHANGE_USER_PASSWORD_ACTION>,
  ChangeUserPasswordOutput
>;

export type HelloAction = ActionHandler<
  HasuraActionPayload<{}, typeof HELLO_ACTION>,
  { readonly hello: string }
>;
