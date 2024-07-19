import Joi from 'joi';

const educationDetailsSchema = Joi.object({
  diplomaDegreeName: Joi.string().pattern(/^[a-zA-Z\s]+$/).min(2).max(50).required(),
  instituteName: Joi.string().min(2).max(100).required(),
  PassingYear: Joi.date().iso().required(),
  percentage: Joi.number().min(1).max(100).required(),
  _id: Joi.string().optional(),
});

const educationValidation = (data) => {
    
  return educationDetailsSchema.validate(data, {
    abortEarly: false,
    messages: {
      'string.base': '{{#label}} must be a string',
      'string.empty': '{{#label}} cannot be empty',
      'string.min': '{{#label}} should have a minimum length of {{#limit}}',
      'string.max': '{{#label}} should have a maximum length of {{#limit}}',
      'string.pattern.base': '{{#label}} has invalid characters',
      'number.base': '{{#label}} must be a number',
      'number.integer': '{{#label}} must be an integer',
      'number.min': '{{#label}} should be at least {{#limit}}',
      'number.max': '{{#label}} should be at most {{#limit}}',
      'any.required': '{{#label}} is required',
    },
  });
};

export { educationValidation };
