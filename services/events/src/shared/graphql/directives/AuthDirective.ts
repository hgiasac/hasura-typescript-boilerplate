/* eslint-disable functional/no-class */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/immutable-data */
import { defaultFieldResolver } from "graphql";
import { SchemaDirectiveVisitor } from "graphql-tools";
import { XHasuraRole } from "../../types";

const AnonymousRole = "ANONYMOUS";
const AdminRole = "ADMIN";

export const AuthDirectiveSchema = (roles: readonly string[], defaultRole = AnonymousRole): string => `
  directive @auth(
    requires: [Role] = [${defaultRole}]
  ) on OBJECT | FIELD_DEFINITION

  enum Role {
    ${AdminRole}
    ${AnonymousRole}
    ${roles.join("\n")}
  }
`;

export type IAuthDirectiveConfig = {
  readonly validate: <C = any>(context: C, requiredRoles: readonly string[]) => Promise<boolean>
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const AuthDirective = (cfg: IAuthDirectiveConfig) => {

  function ensureFieldsWrapped(objectType): void {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) { return; }
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function (...args) {
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        const requiredRole =
          field._requiredAuthRoles ||
          objectType._requiredAuthRoles;

        if (!requiredRole) {
          return resolve.apply(this, args);
        }
        const context = args[2];

        const isValidated = await cfg.validate(context, requiredRole);
        if (!isValidated) {
          throw new Error("permission denied");
        }

        return resolve.apply(this, args);
      };
    });
  }

  return class extends SchemaDirectiveVisitor {
    public visitObject(type): void {
      ensureFieldsWrapped(type);
      type._requiredAuthRoles = this.args.requires;
    }
    // Visitor methods for nested types like fields and arguments
    // also receive a details object that provides information about
    // the parent and grandparent types.
    public visitFieldDefinition(field, details): void {
      ensureFieldsWrapped(details.objectType);
      field._requiredAuthRoles = this.args.requires;
    }

  };
};

export function DefaultAuthValidator(context: any, requiredRoles: readonly string[]): Promise<boolean> {
  const role = <string>context.request.get(XHasuraRole);

  return Promise.resolve(
    requiredRoles
      .some((r) => role.toLowerCase() === r.toLowerCase())
  );
}
