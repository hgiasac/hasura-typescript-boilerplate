import { auth } from "firebase-admin";
import { getFirebaseApp } from "../components/firebase";
import { requestGQL } from "../http-client";
import { HasuraRole } from "../types";

export interface IAuthUser {
  id: string;
  email: string;
  role: HasuraRole;
  deleted: boolean;
}

export interface IChangePasswordInput {
  firebaseId: string;
  password: string;
}

type VerifyTokenFunc = (token: string) => Promise<auth.DecodedIdToken>;
type FindUserByFirebaseIDFunc = (id: string) => Promise<IAuthUser>;
type ChangePasswordFunc = (input: IChangePasswordInput) => Promise<auth.UserRecord>;

export interface IFirebaseAuth {
  verifyToken: VerifyTokenFunc;
  findUserByFirebaseID: FindUserByFirebaseIDFunc;
  changePassword: ChangePasswordFunc;
}

const verifyToken: VerifyTokenFunc = (token) => getFirebaseApp().auth().verifyIdToken(token);

const findUserByFirebaseID: FindUserByFirebaseIDFunc = async (id) => {

  const query = `
    query findUserByFirebaseID($firebaseID: String!) {
      users(where: {
        firebase_id: { _eq: $firebaseID }
      }) {
        id
        email
        role
        deleted
      }
    }
  `;

  return requestGQL<{ users: IAuthUser[] }>({
    query,
    variables: { id },
    isAdmin: true
  }).then((rs) => rs.users[0]);
};

const changePassword: ChangePasswordFunc = async (input) => {
  return getFirebaseApp().auth()
    .updateUser(input.firebaseId, {
      password: input.password
    });
}

export const FirebaseAuth: IFirebaseAuth = {
  verifyToken,
  findUserByFirebaseID,
  changePassword,
};
