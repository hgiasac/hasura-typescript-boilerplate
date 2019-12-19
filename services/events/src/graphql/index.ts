import { ApolloError, ApolloServer } from "apollo-server-express";
import { AuthDirective, DefaultAuthValidator } from "../shared/graphql/directives";
import { validatorDirectiveResolver } from "../shared/graphql/directives/ValidatiorDirective";
import { getRootResolver } from "./resolver";
import { getRootSchema } from "./schema";

export function newApolloServer(): ApolloServer {
  return new ApolloServer({
    typeDefs: getRootSchema(),
    resolvers: getRootResolver(),
    schemaDirectives: {
      auth: AuthDirective({
        validate: DefaultAuthValidator
      }),
      ...validatorDirectiveResolver,
    },
    context: async ({ req }) => {
      try {
        const request = req;

        return { request };
      } catch (error) {
        throw new ApolloError(error);
      }
    }
  });
}
