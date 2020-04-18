
import { IAuthUser, ICreateUserInput } from "../../shared/auth/firebase";
import { IHasuraActionPayload } from "../../shared/types";
import { ActionHandler } from "../types";

export const CREATE_USER_ACTION = "createUser";

export type CreateUserAction = ActionHandler<
  IHasuraActionPayload<typeof CREATE_USER_ACTION, { data: ICreateUserInput }>,
  IAuthUser
>;
