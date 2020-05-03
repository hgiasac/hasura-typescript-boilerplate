import * as functions from "firebase-functions";
import { requestGQL } from "../shared/http-client";
import * as admin from "firebase-admin";
import * as types from "../shared/types";
import { getRegions } from "../shared/config";

const query = `
  mutation createProfile($objects: [users_insert_input!]!) {
    insert_users(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export const onUserCreated = functions
  .region(...getRegions())
  .auth.user().onCreate(async (user, ctx) => {

    const defaultRole = types.HASURA_ROLE_USER;

    // we only run trigger for registered user
    if (!ctx.authType || ctx.authType !== "USER") {
      return;
    }

    // create profile to backend server
    const userId = await requestGQL({
      query,
      variables: {
        objects: {
          email: user.email,
          emailVerified: user.emailVerified,
          firebaseId: user.uid,
          firstName: user.displayName,
          role: defaultRole
        }
      }
    }).then((result) => result.insert_users.returning[0].id)
      .catch((err) => {
        console.error("created user failed:", err);

        return null;
      });

    // set custom claims with role user
    if (!userId) {
      return null;
    }

    const customClaims = {
      [types.HasuraClaims]: {
        [types.XHasuraDefaultRole]: defaultRole,
        [types.XHasuraAllowedRoles]: [defaultRole],
        [types.XHasuraUserID]: userId
      }
    };

    return admin.auth().setCustomUserClaims(user.uid, customClaims)
      .catch((error) => console.log(error));
  });
