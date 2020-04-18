import Joi = require("@hapi/joi");
import { RoleValidator } from "../../shared/validator";

export const CreateUserValidator = Joi.object({
  email: Joi.string().email().required(),
  email_verified: Joi.bool().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().min(1).max(50),
  last_name: Joi.string().min(1).max(50),

  role: RoleValidator.required(),
  created_by: Joi.string().uuid(),
  updated_by: Joi.string().uuid(),
})
