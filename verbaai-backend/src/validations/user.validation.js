import Joi from "joi";

export const updateProfileValidation = Joi.object({
  name: Joi.string().min(3),

  college: Joi.string(),

  branch: Joi.string(),

  graduationYear: Joi.number(),

  bio: Joi.string().max(500),

  profilePic: Joi.string(),
});