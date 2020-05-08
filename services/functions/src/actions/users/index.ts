import { changeUserPassword, createUserHandler, helloHandler } from "./handler";
import { CHANGE_USER_PASSWORD_ACTION, CREATE_USER_ACTION, HELLO_ACTION } from "./types";
import { withExpress } from "hasura-node-types";
import { logger } from "../../shared/logger";
import { DEBUG } from "../../shared/env";

const actions = {
  [HELLO_ACTION]: helloHandler,
  [CREATE_USER_ACTION]: createUserHandler,
  [CHANGE_USER_PASSWORD_ACTION]: changeUserPassword
};

export const actionUsers = withExpress({
  debug: DEBUG,
  logger
}).useActions(actions);
