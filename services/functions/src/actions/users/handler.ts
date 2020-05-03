/* eslint-disable id-blacklist */
import { FirebaseAuth } from "../../shared/auth/firebase";
import { VALIDATION_ERROR } from "../../shared/error";
import { ChangeUserPasswordAction, CreateUserAction, HelloAction } from "./types";
import { ChangeUserPasswordValidator, CreateUserValidator } from "./validation";
import { getActionUserID } from "../../shared/hasura/utils";
import { HasuraActionError } from "../../shared/hasura/types";
import { requestGQL } from "../../shared/hasura/http-client";

// create user action
export const createUserHandler: CreateUserAction = async (_, payload) => {
  const { input } = payload;
  const userID = getActionUserID(payload);

  const validatedResult = CreateUserValidator.validate(input.data);

  if (validatedResult.error) {
    throw new HasuraActionError({
      code: VALIDATION_ERROR,
      message: validatedResult.error.message,
      details: validatedResult.error.details
    });
  }

  // check if user exists
  const query = `
    query existUserEmail($email: String!) {
      users_aggregate(limit: 1, where: {email: {_eq: $email}}) {
        aggregate {
          count
        }
      }
    }
  `;

  const isExisted = await requestGQL({
    query,
    variables: { email: input.data.email },
    isAdmin: true
  }).then((rs) => rs.users_aggregate.aggregate.count > 0);

  if (isExisted) {
    const message = `Email is existed: ${input.data.email}`;

    throw new HasuraActionError({
      message,
      code: VALIDATION_ERROR,
      details: message
    });
  }

  const user = await FirebaseAuth.createUser({
    ...validatedResult.value,
    createdBy: userID,
    updatedBy: userID
  });

  return {
    ...user,
    password: undefined
  };
};

// change user password
export const changeUserPassword: ChangeUserPasswordAction = async (_, payload) => {
  const { input } = payload;

  const validatedResult = ChangeUserPasswordValidator.validate(input.data);

  if (validatedResult.error) {
    throw new HasuraActionError({
      code: VALIDATION_ERROR,
      message: validatedResult.error.message,
      details: validatedResult.error.details
    });
  }

  const value = validatedResult.value;

  // find user by primary key
  const query = `
    query findUserFirebaseIdById($id: uuid!) {
      users(where: { id: { _eq: $id }}, limit: 1) {
        firebaseId
      }
    }
  `;

  const response = await requestGQL<{ readonly users: readonly { readonly firebaseId: string }[] }>({
    query,
    variables: { id: value.userId }
  });

  if (!response.users.length) {
    throw new HasuraActionError({
      code: VALIDATION_ERROR,
      message: "User not found",
      details: `User not found: ${value.userId}`
    });
  }

  const firebaseId = response.users[0].firebaseId;

  await FirebaseAuth.changePassword({
    firebaseId,
    password: value.password
  });

  return {
    userId: value.userId
  };
};

// mock mutation, workaround issue in react admin provider
// https://stackoverflow.com/questions/60088596/cannot-read-property-name-of-null-react-admin
export const helloHandler: HelloAction = () => Promise.resolve({
  hello: "Hello world!"
});
