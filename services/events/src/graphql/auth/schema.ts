import { Role } from "../../shared/types";

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
  hello: String! @auth(requires: [${Role.Admin}, ${Role.Anonymous}])
`;

export const gqlMutationSchema = `
  login(input: LoginInput!): TokenResponse! @auth(requires: ${Role.Anonymous})
  createUser(input: CreateUserInput): User! @auth(requires: [${Role.Admin}, ${Role.User}])
`;

export interface ITokenResponse {
  id: string;
  email: string;
  fullName: string;
  role: string;
  token: string;
}
