import { AuthenticationError, UserInputError } from "apollo-server-core";
import { IAuthUser, ICreateUserInput, ILoginInput, JwtAuth } from "../../shared/auth/jwt";
import { UnauthorizedError } from "../../shared/auth/types";
import { getCtxUserID } from "../../shared/graphql/util";
import { IGraphQLContext, XHasuraUserID } from "../../shared/types";
import { ITokenResponse } from "./schema";

const login = async (_, { input }: { input: ILoginInput }): Promise<ITokenResponse> => {
  try {
    const user = await JwtAuth.login(input);
    const token = await JwtAuth.encodeToken(user);

    return {
      token,
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  } catch (err) {
    switch (err.name) {
    case UnauthorizedError.name:
      throw new AuthenticationError("Invalid email or password");
    default:
      throw new UserInputError(err.message);
    }
  }
};

const createUser = async (_, { input }: { input: ICreateUserInput }, ctx: IGraphQLContext): Promise<IAuthUser> => {
  const userID = getCtxUserID(ctx.request);
  const user = await JwtAuth.createUser({
    ...input,
    createdBy: userID,
    updatedBy: userID,
  });

  return {
    ...user,
    password: undefined,
  };
};

export const gqlQueryResolver = {
  hello: (_, __, ctx: IGraphQLContext): string => {
    if (ctx.request.get(XHasuraUserID) !== "1") {
      throw new AuthenticationError("Unauthorized");
    }

    return "world";
  },
};

export const gqlMutationResolver = {
  login,
  createUser,
};
