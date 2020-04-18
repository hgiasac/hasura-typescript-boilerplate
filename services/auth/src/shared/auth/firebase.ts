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

type VerifyTokenFunc = (token: string) => Promise<auth.DecodedIdToken>;
type FindUserByFirebaseIdFunc = (id: string) => Promise<IAuthUser>;

export interface IFirebaseAuth {
  verifyToken: VerifyTokenFunc;
  findUserByFirebaseId: FindUserByFirebaseIdFunc;
}

const verifyToken: VerifyTokenFunc = (token) =>
  getFirebaseApp().auth().verifyIdToken(token);

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

  return requestGQL<{ users: IAuthUser[] }>({
    query,
    variables: { id },
    isAdmin: true
  }).then((rs) => rs.users[0]);
};

export const FirebaseAuth: IFirebaseAuth = {
  verifyToken,
  findUserByFirebaseId,
};
