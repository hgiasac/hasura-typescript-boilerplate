import { HasuraActionPayload, HasuraActionExpressHandler } from "hasura-node-types";

// example action
const helloHandler: HasuraActionExpressHandler<HasuraActionPayload<{ readonly hello: string }, "hello">> =
  (_, { input }) =>
    Promise.resolve({ hello: `Hello ${input.hello}` });

export default {
  hello: helloHandler
};
