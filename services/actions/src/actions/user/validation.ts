import Joi = require("@hapi/joi");
import { RoleValidator } from "../../shared/validator";

const PasswordValidator = Joi.string().min(6).required();

export const CreateUserValidator = Joi.object({
  email: Joi.string().email().required(),
  emailVerified: Joi.bool().required(),
  password: PasswordValidator,
  firstName: Joi.string().min(1).max(50),
  lastName: Joi.string().min(1).max(50),

  role: RoleValidator.required(),
  createdBy: Joi.string().uuid(),
  updatedBy: Joi.string().uuid()
});

export const ChangeUserPasswordValidator = Joi.object({
  userId: Joi.string().uuid().required(),
  password: PasswordValidator
});
