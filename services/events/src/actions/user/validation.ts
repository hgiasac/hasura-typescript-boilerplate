import Joi = require("@hapi/joi");
import { RoleValidator } from "../../shared/validator";

const UserIDValidator = Joi.string().uuid().required();
const PasswordValidator = Joi.string().min(6).required();

export const LoginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: PasswordValidator,
});

export const CreateUserValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(1).max(50),
  lastName: Joi.string().min(1).max(50),
  role: RoleValidator.required(),
  createdBy: Joi.string().uuid(),
  updatedBy: Joi.string().uuid(),
})

export const ChangeUserPasswordValidator = Joi.object({
  userId: UserIDValidator,
  password: PasswordValidator,
});

export const ChangeProfilePasswordValidator = Joi.object({
  oldPassword: PasswordValidator,
  newPassword: PasswordValidator,
});
