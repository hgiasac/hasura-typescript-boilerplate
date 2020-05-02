import { auth } from "firebase-admin";
import { getFirebaseApp } from "../components/firebase";
import { requestGQL } from "../http-client";
import { HasuraRole } from "../types";

export type AuthUser = {
  readonly id: string
  readonly email: string
  readonly role: HasuraRole
  readonly deleted: boolean
};

type VerifyTokenFunc = (token: string) => Promise<auth.DecodedIdToken>;
type FindUserByFirebaseIdFunc = (id: string) => Promise<AuthUser>;

export type IFirebaseAuth = {
  readonly verifyToken: VerifyTokenFunc
  readonly findUserByFirebaseId: FindUserByFirebaseIdFunc
};

const verifyToken: VerifyTokenFunc = (token) =>
  getFirebaseApp().auth().verifyIdToken(token);

const findUserByFirebaseId: FindUserByFirebaseIdFunc = async (firebaseId) => {

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
    variables: { firebaseId },
    isAdmin: true
  }).then((rs) => rs.users[0]);
};

export const FirebaseAuth: IFirebaseAuth = {
  verifyToken,
  findUserByFirebaseId
};
