import { IHasuraActionPayload } from "../shared/types";
import { ActionHandler, IActionHandlerMap } from "./types";

// example action
const helloHandler: ActionHandler<IHasuraActionPayload<"hello", { hello: string }>> =
  (_, { input }) =>
    Promise.resolve({ hello: "Hello " + input.hello });

export default {
  hello: helloHandler
} as IActionHandlerMap;
