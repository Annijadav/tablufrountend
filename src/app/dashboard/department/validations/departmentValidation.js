import Joi from 'joi';

const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(30)
      .regex(/^[a-zA-Z]+$/)
      .required()
      .messages({
        "string.pattern.base": "Only alphabetic characters are allowed.",
      }),
    departmentManager: Joi.not(),
  });

  const validateForm = (data) => {
    const { error } = schema.validate(data);
    if (error) {
      return error.details[0].message;
    }
    return null;
  };

  export { validateForm };