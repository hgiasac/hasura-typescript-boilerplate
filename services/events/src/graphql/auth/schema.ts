import { GQL_ROLE_ADMIN, GQL_ROLE_ANONYMOUS } from "../../shared/types";

export const gqlSchema = `

input LoginInput {
  email: Email!
  password: String! @minLength(value: 6)
}

type TokenResponse {
  id: ID!
  email: String!
  fullName: String
  role: String!
  token: String!
}
`;

export const gqlQuerySchema = `
  hello: String! @auth(requires: [${GQL_ROLE_ADMIN}, ${GQL_ROLE_ANONYMOUS}])
`;

export const gqlMutationSchema = `
  login(input: LoginInput!): TokenResponse! @auth(requires: ${GQL_ROLE_ANONYMOUS})
`;
