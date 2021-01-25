import Joi from "Joi";

interface rawUserData {
  email: any;
  username: any;
  password: any;
}

export const registerValidation = (data: rawUserData) => {
  const schema = Joi.object({
    email: Joi.string().max(254).required(),
    username: Joi.string().min(6).max(20).required(),
    password: Joi.string().min(6).max(30).required(),
  });

  return schema.validate(data);
};
