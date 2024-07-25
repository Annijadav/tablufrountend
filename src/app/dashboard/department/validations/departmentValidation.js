import Joi from 'joi';

const customJoi = Joi.extend((joi) => ({
    type: "objectId",
    base: joi.string(),
    messages: {
      "objectId.base": "Invalid ObjectId format",
    },
    validate(value, helpers) {
      if (!ObjectId.isValid(value)) {
        return { value, errors: helpers.error("objectId.base") };
      }
    },
  }));

const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(30)
      .regex(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.pattern.base": "Only alphabetic characters are allowed.",
      }),
    departmentManager: Joi.not(),
  }).unknown(true);

  const validateForm = (data) => {
    const { error } = schema.validate(data);
    if (error) {
      return error.details[0].message;
    }
    return null;
  };

  export { validateForm };