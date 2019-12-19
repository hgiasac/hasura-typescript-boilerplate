import { GraphQLScalarType } from "graphql";

export interface IGraphQLScalarType {
  name: string;
  type: GraphQLScalarType;
}

export interface ICreateCustomScalarsOutput {
  schema: string;
  resolver: { [key: string]: GraphQLScalarType };
}

export function createCustomScalars(inputs: IGraphQLScalarType[]) {
  return inputs.reduce((acc, o) => ({
    schema: acc.schema + `scalar ${o.name}\n`,
    resolver: {
      ...acc.resolver,
      [o.name]: o.type,
    }
  }), {
    schema: "",
    resolver: {}
  });
}
