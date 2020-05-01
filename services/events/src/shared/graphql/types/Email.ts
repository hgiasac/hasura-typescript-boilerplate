/* eslint-disable no-useless-escape */
import { GraphQLError, GraphQLScalarType } from "graphql";

const EmailScalarName = "Email";
// eslint-disable-next-line max-len
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default {
  name: EmailScalarName,
  type: new GraphQLScalarType({
    name: EmailScalarName,
    description: "Type email",
    serialize: (value: string) => value,
    parseValue: (value: string) => value,
    parseLiteral: (data: any) => {
      if (!emailRegex.test(data.value)) {
        throw new GraphQLError(`Invalid email: ${data.value}`);
      }

      return data.value;
    }
  })
};
