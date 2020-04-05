import { GQL_ROLE_ADMIN, GQL_ROLE_ANONYMOUS, GQL_ROLE_USER } from "../../shared/types";

export const gqlSchema = `

input LoginInput {
  email: Email!
  password: String! @minLength(value: 6)
}

input CreateUserInput {
  email: Email!
  password: String! @minLength(value: 6)
  fullName: String!
  role: String!
}

type TokenResponse {
  id: ID!
  email: String!
  fullName: String
  role: String!
  token: String!
}

type User {
  id: ID!
  email: String!
  fullName: String
  role: String!
}
`;

export const gqlQuerySchema = `
  hello: String! @auth(requires: [${GQL_ROLE_ADMIN}, ${GQL_ROLE_ANONYMOUS}])
`;

export const gqlMutationSchema = `
  login(input: LoginInput!): TokenResponse! @auth(requires: ${GQL_ROLE_ANONYMOUS})
  createUser(input: CreateUserInput): User! @auth(requires: [${GQL_ROLE_ADMIN}, ${GQL_ROLE_USER}])
`;

export interface ITokenResponse {
  id: string;
  email: string;
  fullName: string;
  role: string;
  token: string;
}
