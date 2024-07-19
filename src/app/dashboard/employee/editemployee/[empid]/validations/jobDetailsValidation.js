import Joi from 'joi';

const jobDetailsSchema = Joi.object({
  previousCompanyName: Joi.string().pattern(/^[a-zA-Z\s]+$/).min(2).max(50).required(),
  jobTitle: Joi.string().pattern(/^[a-zA-Z\s]+$/).min(2).max(50).required(),
  fromDate: Joi.date().iso().required(),
  toDate: Joi.date().iso().required(),
  _id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
});

const jobDetailsValidation = (data) => {
  return jobDetailsSchema.validate(data, {
    abortEarly: false,
    messages: {
      'string.base': '{{#label}} must be a string',
      'string.empty': '{{#label}} cannot be empty',
      'string.min': '{{#label}} should have a minimum length of {{#limit}}',
      'string.max': '{{#label}} should have a maximum length of {{#limit}}',
      'string.pattern.base': '{{#label}} has invalid characters',
      'date.base': '{{#label}} must be a valid date',
    },
  });
};

export { jobDetailsValidation };
