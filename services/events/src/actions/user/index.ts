import { JwtAuth } from "../../shared/auth/jwt";
import { HasuraActionError } from "../../shared/types";
import { getActionUserID } from "../utils";
import { CreateUserAction, LoginAction } from "./types";

// login action
export const loginHandler: LoginAction = async (_, payload) => {
  const { input } = payload;

  try {

    const user = await JwtAuth.login(input.data);
    const token = await JwtAuth.encodeToken(user);

    return {
      token,
      ...user,
      password: undefined,
    };
  } catch (err) {

    throw new HasuraActionError({
      code: err.code || err.name,
      message: err.message || "Invalid email or password"
    });
  }
}

// create user action
export const createUserHandler: CreateUserAction = async (_, payload) => {
  const { input } = payload;
  const userID = getActionUserID(payload);
  const user = await JwtAuth.createUser({
    ...input.data,
    created_by: userID,
    updated_by: userID,
  });

  return {
    ...user,
    password: undefined,
  };
}
