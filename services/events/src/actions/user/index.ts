import { JwtAuth } from "../../shared/auth/jwt";
import { HasuraActionError } from "../../shared/types";
import { getActionUserID } from "../utils";
import { CreateUserAction, LoginAction } from "./types";

// login action
export const loginHandler: LoginAction = async (_, payload) => {
  const { input } = payload;

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

    throw new HasuraActionError({
      code: err.code || err.name,
      message: "Invalid email or password"
    });
  }
}

// create user action
export const createUserHandler: CreateUserAction = async (_, payload) => {
  const { input } = payload;
  const userID = getActionUserID(payload);
  const user = await JwtAuth.createUser({
    ...input,
    createdBy: userID,
    updatedBy: userID,
  });

  return {
    ...user,
    password: undefined,
  };
}
