import Joi from "Joi";

interface rawUserData {
  username: any;
  password: any;
}

const validationRules = {
  username: Joi.string().min(6).max(20).required(),
  password: Joi.string().min(6).max(30).required(),
};

export const registerValidation = (data: rawUserData) => {
  const schema = Joi.object({
    username: validationRules.username,
    password: validationRules.password,
  });

  return schema.validate(data);
};

export const loginValidation = (data: rawUserData) => {
  const schema = Joi.object({
    username: validationRules.username,
    password: validationRules.password,
  });

  return schema.validate(data);
};
