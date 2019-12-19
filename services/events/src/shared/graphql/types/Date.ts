import { GraphQLError, GraphQLScalarType } from "graphql";

const DateScalarName = "Date";

export default {
  name: DateScalarName,
  type: new GraphQLScalarType({
    name: DateScalarName,
    description: "Type DateTime with fixed format",
    serialize: (value: Date) => value.toISOString(),
    parseValue: (value: Date) => value,
    parseLiteral: (data: any) => {
      const timestamp = Date.parse(data.value);

      if (isNaN(timestamp)) {
        throw new GraphQLError("Invalid date: " + data.value);
      }

      return new Date(timestamp);
    }
  })
};
