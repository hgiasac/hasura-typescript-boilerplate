import { GraphQLError, GraphQLScalarType } from "graphql";

const scalarName = "UUID";
// eslint-disable-next-line no-useless-escape
const uuidRegex = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/;

export default {
  name: scalarName,
  type: new GraphQLScalarType({
    name: scalarName,
    description: "Type uuid",
    serialize: (value: string) => value,
    parseValue: (value: string) => value,
    parseLiteral: (data: any) => {
      if (!uuidRegex.test(data.value)) {
        throw new GraphQLError(`Invalid uuid: ${data.value}`);
      }

      return data.value;
    }
  })
};
