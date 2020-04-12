import { GQL_ROLE_ADMIN, GQL_ROLE_ANONYMOUS } from "../../shared/types";

export const gqlQuerySchema = `
  hello: String! @auth(requires: [${GQL_ROLE_ADMIN}, ${GQL_ROLE_ANONYMOUS}])
`;

export const gqlMutationSchema = `
`;
