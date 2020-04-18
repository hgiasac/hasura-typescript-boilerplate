import { auth } from "firebase-admin";
import { getFirebaseApp } from "../components/firebase";
import { requestGQL } from "../http-client";
import { HasuraRole } from "../types";

export interface IBaseUserInput {
  email: string;
  email_verified: boolean;
  first_name: string;
  last_name: string;
}

export interface ICreateFirebaseUserInput extends IBaseUserInput {
  password: string;
}

export interface ICreateUserInput extends IBaseUserInput {
  role: HasuraRole;
  firebase_id: string;
  created_by: string;
  updated_by: string;
  deleted: boolean;
}

export interface IAuthUser extends ICreateUserInput {
  id: string;
  created_at: string;
  updated_at: string;
}

type CreateUserFunc = (input: ICreateUserInput & { password: string }) =>
  Promise<IAuthUser>;

export interface IFirebaseAuth {
  createUser: CreateUserFunc;
}

export function createFirebaseUser(input: ICreateFirebaseUserInput): Promise<auth.UserRecord> {
  return getFirebaseApp()
    .auth().createUser({
      email: input.email,
      emailVerified: input.email_verified,
      displayName: `${input.first_name} ${input.last_name}`,
      password: input.password,
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
          email_verified
          first_name
          last_name
          firebase_id
          role
          created_at
          updated_at
          created_by
          updated_by
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
      email_verified: input.email_verified,
      first_name: input.first_name,
      last_name: input.last_name,
      firebase_id: fbUser.uid,
      role: input.role,
      created_by: input.created_by,
      updated_by: input.updated_by,
      deleted: input.deleted || false,
    }))
    .then(createUser);

export const FirebaseAuth: IFirebaseAuth = {
  createUser: createUserWithFirebase,
};
