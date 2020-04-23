
import { IAuthUser, ICreateUserInput, UserID } from "../../shared/auth/firebase";
import { IHasuraActionPayload } from "../../shared/types";
import { ActionHandler } from "../types";

export const CREATE_USER_ACTION = "createUser";
export const CHANGE_USER_PASSWORD_ACTION = "changeUserPassword";
export const HELLO_ACTION = "hello";

export type CreateUserAction = ActionHandler<
  IHasuraActionPayload<typeof CREATE_USER_ACTION, { data: ICreateUserInput }>,
  IAuthUser
>;

export interface IChangeUserPasswordInput {
  userId: UserID;
  password: string;
}

export interface IChangeUserPasswordOutput {
  userId: UserID;
}

export type ChangeUserPasswordAction = ActionHandler<
  IHasuraActionPayload<typeof CHANGE_USER_PASSWORD_ACTION, { data: IChangeUserPasswordInput }>,
  IChangeUserPasswordOutput
>;

export type HelloAction = ActionHandler<
  IHasuraActionPayload<typeof HELLO_ACTION, {}>,
  { hello: string }
>;
