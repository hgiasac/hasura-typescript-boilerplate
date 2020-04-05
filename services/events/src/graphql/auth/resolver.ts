import { AuthenticationError } from "apollo-server-core";
import { IGraphQLContext, XHasuraUserID } from "../../shared/types";

export const gqlQueryResolver = {
  hello: (_, __, ctx: IGraphQLContext): string => {
    if (ctx.request.get(XHasuraUserID) !== "1") {
      throw new AuthenticationError("Unauthorized");
    }

    return "world";
  },
};

export const gqlMutationResolver = {
  login: (_, { input }) => {
    console.log(input);

    return {
      id: "1",
      email: input.email,
      fullName: "test user",
      role: "admin",
      token: "hasura"
    };
  }
};