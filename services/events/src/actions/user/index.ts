import { FirebaseAuth } from "../../shared/auth/firebase";
import { VALIDATION_ERROR } from "../../shared/error";
import { HasuraActionError } from "../../shared/types";
import { getActionUserID } from "../utils";
import { CreateUserAction } from "./types";
import { CreateUserValidator } from "./validation";

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

  const user = await FirebaseAuth.createUser({
    ...validatedResult.value,
    created_by: userID,
    updated_by: userID,
  });

  return {
    ...user,
    password: undefined,
  };
}
