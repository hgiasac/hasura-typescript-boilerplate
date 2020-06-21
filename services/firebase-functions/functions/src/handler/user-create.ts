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

    // eslint-disable-next-line functional/no-let
    let customClaims: Record<string, Record<string, any>> = {
      [types.HasuraClaims]: {
        [types.XHasuraDefaultRole]: types.HASURA_ROLE_ANONYMOUS,
        [types.XHasuraAllowedRoles]: [types.HASURA_ROLE_ANONYMOUS],
      }
    };
    // onCreate event doesn't provide explicit way to detect users that created from adnmin
    // the workaround is marking disabled when create user
    // onCreate event will skip user creation
    if (user.disabled) {
      console.log("this user is created from admin");
      await admin.auth().updateUser(user.uid, {
        disabled: false
      });

      return;
    } else {
      console.log("this is registered user");
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
        },
        isAdmin: true
      }).then((result) => result.insert_users.returning[0].id)
        .catch((err) => {
          console.error("created user failed:", JSON.stringify(err));

          return null;
        });

      // set custom claims with role user
      if (!userId) {
        return null;
      }

      customClaims = {
        [types.HasuraClaims]: {
          [types.XHasuraDefaultRole]: defaultRole,
          [types.XHasuraAllowedRoles]: [defaultRole],
          [types.XHasuraUserID]: userId
        }
      };
    }

    return admin.auth().setCustomUserClaims(user.uid, customClaims)
      .catch((error) => console.error(JSON.stringify(error)));
  });
