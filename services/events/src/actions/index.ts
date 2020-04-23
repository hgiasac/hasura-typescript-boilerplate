import { IActionHandlerMap } from "./types";
import userActions from "./user";

export default {
  ...userActions
} as IActionHandlerMap;
