import { UserInputError } from "apollo-server-core";
import { GraphQLScalarType } from "graphql";
import { IGraphQLScalarType } from "./types";

export function rangeScalaTypes(
  fn: (val: number) => IGraphQLScalarType, length: number): readonly IGraphQLScalarType[] {
  const result = [];

  // eslint-disable-next-line 
  for (let i = 0; i <= length; i++) {
    // eslint-disable-next-line functional/immutable-data
    result.push(fn(i));
  }

  return result;
}

export function MinLength(min: number): IGraphQLScalarType {
  const name = `MinLength${min}`;

  return {
    name,
    type: new GraphQLScalarType({
      name,
      description: `Type ${name}`,
      serialize: (value) => value,
      parseValue: (value) => value,
      parseLiteral: (data: any) => {
        switch (data.kind) {
          case "StringValue":
            if (data.value.length < min) {
              throw new UserInputError(`Must be at least ${min} characters in length`);
            }

            return data.value;
          case "ListValue":
            if (data.values.length < min) {
              throw new UserInputError(`Must be at least ${min} list items`);
            }

            return data.values;
          default:
            throw new Error(`Invalid data type for minLength: ${typeof (data.value)}`);
        }

      }
    })
  };
}

export function MaxLength(val: number): IGraphQLScalarType {
  const name = `MaxLength${val}`;

  return {
    name,
    type: new GraphQLScalarType({
      name,
      description: `Type ${name}`,
      serialize: (value) => value,
      parseValue: (value) => value,
      parseLiteral: (data: any) => {
        switch (data.kind) {
          case "StringValue":
            if (data.value.length > val) {
              throw new UserInputError(`Must be no more than ${val} characters in length`);
            }

            return data.value;
          case "ListValue":
            if (data.values.length > val) {
              throw new UserInputError(`Must be no more than ${val} list items`);
            }

            return data.values;
          default:
            throw new Error(`Invalid data type for minLength: ${typeof (data.value)}`);
        }
      }

    })
  };
}
