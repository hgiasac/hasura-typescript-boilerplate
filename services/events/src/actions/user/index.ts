import { JwtAuth } from "../../shared/auth/jwt";
import { VALIDATION_ERROR } from "../../shared/error";
import { HasuraActionError } from "../../shared/types";
import { getActionUserID } from "../utils";
import { CreateUserAction, LoginAction } from "./types";
import { CreateUserValidator, LoginValidator } from "./validation";

// login action
export const loginHandler: LoginAction = async (_, payload) => {
  const { input } = payload;

  const validatedResult = LoginValidator.validate(input.data);

  if (validatedResult.error) {
    throw new HasuraActionError({
      code: VALIDATION_ERROR,
      message: validatedResult.error.message,
      details: validatedResult.error.details,
    });
  }

  try {

    const user = await JwtAuth.login(validatedResult.value);
    const token = await JwtAuth.encodeToken(user);

    return {
      token,
      ...user,
      password: undefined,
    };
  } catch (err) {

    throw new HasuraActionError({
      code: err.code || err.name,
      message: err.message || "Invalid email or password",
      details: err,
    });
  }
}

// create user action
export const createUserHandler: CreateUserAction = async (_, payload) => {
  const { input } = payload;
  const userID = getActionUserID(payload);

  const validatedResult = CreateUserValidator.validate(input.data);

  if (validatedResult.error) {
    throw new HasuraActionError({
      code: VALIDATION_ERROR,
      message: validatedResult.error.message,
      details: validatedResult.error.details,
    });
  }

  const user = await JwtAuth.createUser({
    ...validatedResult.value,
    created_by: userID,
    updated_by: userID,
  });

  return {
    ...user,
    password: undefined,
  };
}
