import { Role } from "../../shared/types";

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
  hello: String! @auth(requires: [${Role.Admin}, ${Role.Anonymous}])
`;

export const gqlMutationSchema = `
  login(input: LoginInput!): TokenResponse! @auth(requires: ${Role.Anonymous})
`;
