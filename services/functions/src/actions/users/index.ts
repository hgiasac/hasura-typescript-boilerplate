import { changeUserPassword, createUserHandler, helloHandler } from "./handler";
import { ActionHandlerMap, withActions } from "../../shared/hasura/action-wrapper";
import { CHANGE_USER_PASSWORD_ACTION, CREATE_USER_ACTION, HELLO_ACTION } from "./types";

const actions = {
  [HELLO_ACTION]: helloHandler,
  [CREATE_USER_ACTION]: createUserHandler,
  [CHANGE_USER_PASSWORD_ACTION]: changeUserPassword
} as ActionHandlerMap;

export const actionUsers = withActions(actions);
