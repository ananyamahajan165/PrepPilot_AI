import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Invalid email address",
      "string.empty": "Email is required",
    }),

  password: Joi.string()
    .min(8)
    .required()
    .messages({
      "string.min":
        "Password must be at least 8 characters",
      "string.empty": "Password is required",
    }),
});

export const loginValidation = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required(),
});

export const forgotPasswordValidation = Joi.object({
  email: Joi.string()
    .email()
    .required(),
});

export const resetPasswordValidation = Joi.object({
  password: Joi.string()
    .min(8)
    .required(),
});