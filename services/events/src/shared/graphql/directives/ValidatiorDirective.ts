import { GraphQLField, GraphQLList, GraphQLNonNull, GraphQLScalarType } from "graphql";
import { SchemaDirectiveVisitor } from "graphql-tools";
import { MaxLength, MinLength } from "../types/Validators";

// min length validation directive
export const minLengthDirectiveSchema = `
  directive @minLength(value: Int) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION
`;

export class MinLengthDirective extends SchemaDirectiveVisitor {
  public visitInputFieldDefinition(field: any) {
    this.wrapType(field);
  }

  public visitFieldDefinition(field: any) {
    this.wrapType(field);
  }

  // Replace field.type with a custom GraphQLScalarType that enforces the
  // length restriction.
  public wrapType(field: GraphQLField<any, any>) {
    if (!this.args.value) {
      return;
    }
    if (field.type instanceof GraphQLNonNull) {
      field.type = new GraphQLNonNull(MinLength(this.args.value).type);

    } else if (field.type instanceof GraphQLScalarType) {
      field.type = MinLength(this.args.value).type;
    } else if (field.type instanceof GraphQLList) {

      field.type = MinLength(this.args.value).type;
    } else {
      throw new Error(`Not a scalar type: ${field.type}`);
    }
  }
}

// max length validation directive
export const maxLengthDirectiveSchema = `
  directive @maxLength(value: Int) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION
`;

export class MaxLengthDirective extends SchemaDirectiveVisitor {
  public visitInputFieldDefinition(field) {
    this.wrapType(field);
  }

  public visitFieldDefinition(field) {
    this.wrapType(field);
  }

    // Replace field.type with a custom GraphQLScalarType that enforces the
    // length restriction.
  public wrapType(field) {
    if (!this.args.value) {
      return;
    }
    if (field.type instanceof GraphQLNonNull &&
          field.type.ofType instanceof GraphQLScalarType) {
      field.type = new GraphQLNonNull(MaxLength(this.args.value).type);

    } else if (field.type instanceof GraphQLScalarType) {
      field.type = MaxLength(this.args.value).type;
    } else {
      throw new Error(`Not a scalar type: ${field.type}`);
    }
  }
}

export const validatorDirectiveSchema = `
  ${minLengthDirectiveSchema}
  ${maxLengthDirectiveSchema}
`;

export const validatorDirectiveResolver = {
  minLength: MinLengthDirective,
  maxLength: MaxLengthDirective,
};
