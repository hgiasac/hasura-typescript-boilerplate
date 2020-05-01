import { AuthDirectiveSchema } from "../shared/graphql/directives";
import { validatorDirectiveSchema } from "../shared/graphql/directives/ValidatiorDirective";
import { gqlCustomScalars } from "../shared/graphql/types";
import { GQL_ROLE_USER } from "../shared/types";
import * as auth from "./auth";

export function getRootSchema(): string {

  const gqlCommonSchemas = `
    ${gqlCustomScalars.schema}
    ${validatorDirectiveSchema}
    ${AuthDirectiveSchema([GQL_ROLE_USER])}
  `;

  const gqlSchemas = [
  ];
  const gqlQuerySchemas = [
    auth.gqlQuerySchema
  ];
  const gqlMutationSchemas = [
    auth.gqlMutationSchema
  ];

  return `
    ${gqlCommonSchemas}
    ${gqlSchemas.filter((e) => e).join("")}

    type Query {
      ${gqlQuerySchemas.filter((e) => e).join("")}
    }

    type Mutation {
      ${gqlMutationSchemas.filter((e) => e).join("")}
    }
  `;
}
