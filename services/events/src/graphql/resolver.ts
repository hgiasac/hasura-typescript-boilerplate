import { gqlCustomScalars } from "../shared/graphql/types";
import * as auth from "./auth";

export function getRootResolver(): any {
  const gqlResolvers = {};
  const gqlQueryResolvers = {
    ...auth.gqlQueryResolver
  };
  const gqlMutationResolvers = {
    ...auth.gqlMutationResolver
  };

  return {
    ...gqlResolvers,
    ...gqlCustomScalars.resolver,
    Query: gqlQueryResolvers,
    Mutation: gqlMutationResolvers
  };
}
