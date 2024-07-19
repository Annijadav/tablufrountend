import Joi from 'joi';

const contactDetailsSchema = Joi.object({
  name: Joi.string().pattern(/^[a-zA-Z\s]+$/).min(2).max(50).required(),
  address: Joi.string().min(5).max(100).required(),
  mobileNo: Joi.string().pattern(/^[0-9]{10}$/).required(),
  relationShip: Joi.string().pattern(/^[a-zA-Z\s]+$/).min(2).max(50).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
});

const emergencyContactValidation = (data) => {
  return contactDetailsSchema.validate(data, {
    abortEarly: false,
    messages: {
      'string.base': '{{#label}} must be a string',
      'string.empty': '{{#label}} cannot be empty',
      'string.min': '{{#label}} should have a minimum length of {{#limit}}',
      'string.max': '{{#label}} should have a maximum length of {{#limit}}',
      'string.pattern.base': '{{#label}} has invalid characters',
      'string.email': '{{#label}} must be a valid email',
      'any.required': '{{#label}} is required',
    },
  });
};

export { emergencyContactValidation };
