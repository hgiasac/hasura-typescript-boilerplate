import { GraphQLScalarType } from "graphql";

export type IGraphQLScalarType = {
  readonly name: string
  readonly type: GraphQLScalarType
};

export type ICreateCustomScalarsOutput = {
  readonly schema: string
  readonly resolver: { readonly [key: string]: GraphQLScalarType }
};

export type CustomScalar = {
  readonly schema: string
  readonly resolver: {}
};
export function createCustomScalars(inputs: readonly IGraphQLScalarType[]): CustomScalar {
  return inputs.reduce((acc, o) => ({
    schema: `${acc.schema}scalar ${o.name}\n`,
    resolver: {
      ...acc.resolver,
      [o.name]: o.type
    }
  }), {
    schema: "",
    resolver: {}
  });
}
