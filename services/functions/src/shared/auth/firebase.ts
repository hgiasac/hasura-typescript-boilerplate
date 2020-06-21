/* eslint-disable @typescript-eslint/no-unsafe-return */
import { auth } from "firebase-admin";
import { getFirebaseApp } from "../components/firebase";
import { requestGQL } from "../http-client";
import { HasuraRole } from "../types";

export type UserID = string;

export type BaseUserInput = {
  readonly email: string
  readonly emailVerified: boolean
  readonly firstName: string
  readonly lastName: string
};

export type ChangePasswordInput = {
  readonly firebaseId: string
  readonly password: string
};

export type CreateFirebaseUserInput = BaseUserInput & {
  readonly password: string
};

export type CreateUserInput = BaseUserInput & {
  readonly role: HasuraRole
  readonly firebaseId: string
  readonly createdBy: string
  readonly updatedBy: string
  readonly deleted: boolean
};

export type AuthUser = CreateUserInput & {
  readonly id: UserID
  readonly createdAt: string
  readonly updatedAt: string
};

type CreateUserFunc =
  (input: CreateUserInput & { readonly password: string }) => Promise<AuthUser>;
type FindUserByFirebaseIdFunc = (id: string) => Promise<AuthUser>;
type ChangePasswordFunc = (input: ChangePasswordInput) => Promise<auth.UserRecord>;

export type IFirebaseAuth = {
  readonly createUser: CreateUserFunc
  readonly findUserByFirebaseId: FindUserByFirebaseIdFunc
  readonly changePassword: ChangePasswordFunc
};

export function createFirebaseUser(input: CreateFirebaseUserInput): Promise<auth.UserRecord> {
  return getFirebaseApp()
    .auth().createUser({
      email: input.email,
      emailVerified: input.emailVerified,
      displayName: `${input.firstName} ${input.lastName}`,
      password: input.password,
      // workaround: onCreate event won't create user customClaims when disabled
      disabled: true
    });
}

const createUser: CreateUserFunc = async (input) => {

  const query = `
    mutation insertUser($object: users_insert_input!) {
      insert_users(objects: [$object]) {
        affected_rows
        returning {
          id
          email
          emailVerified
          firstName
          lastName
          firebaseId
          role
          createdAt
          updatedAt
          createdBy
          updatedBy
          deleted
        }
      }
    }
  `;

  return requestGQL({
    query,
    variables: {
      object: input
    },
    isAdmin: true
  }).then((resp) => resp.insert_users.returning[0]);
};

const createUserWithFirebase: CreateUserFunc = async (input) =>
  createFirebaseUser(input)
    .then((fbUser) => ({
      email: input.email,
      emailVerified: input.emailVerified,
      firstName: input.firstName,
      lastName: input.lastName,
      firebaseId: fbUser.uid,
      role: input.role,
      createdBy: input.createdBy,
      updatedBy: input.updatedBy,
      deleted: input.deleted || false
    }))
    .then(createUser);

const findUserByFirebaseId: FindUserByFirebaseIdFunc = async (id) => {

  const query = `
    query findUserByFirebaseId($firebaseId: String!) {
      users(where: {
        firebaseId: { _eq: $firebaseId }
      }) {
        id
        email
        role
        deleted
      }
    }
  `;

  return requestGQL<{ readonly users: readonly AuthUser[] }>({
    query,
    variables: { id },
    isAdmin: true
  }).then((rs) => rs.users[0]);
};

const changePassword: ChangePasswordFunc = (input) => getFirebaseApp().auth()
  .updateUser(input.firebaseId, {
    password: input.password
  });

export const FirebaseAuth: IFirebaseAuth = {
  findUserByFirebaseId,
  changePassword,
  createUser: createUserWithFirebase
};
