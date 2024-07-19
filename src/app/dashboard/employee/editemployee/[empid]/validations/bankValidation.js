import Joi from 'joi';

const bankDetailsSchema = Joi.object({
  bankName: Joi.string().pattern(/^[a-zA-Z\s]+$/).min(2).max(50).required(),
  accountNo: Joi.string().pattern(/^[0-9]+$/).min(6).max(20).required(),
  IFSCcode: Joi.string().pattern(/^[A-Z0-9]{11}$/).required().messages({
    'string.pattern.base': 'IFSC code is invalid',
    'any.required': 'IFSC code is required'
  }),
  accountHolderName: Joi.string().pattern(/^[a-zA-Z\s]+$/).min(2).max(50).required(),
  paymentType : Joi.string().optional(),
});

const bankValidation = (data) => {
  return bankDetailsSchema.validate(data, {
    abortEarly: false,
    messages: {
      'string.base': '{{#label}} must be a string',
      'string.empty': '{{#label}} cannot be empty',
      'string.min': '{{#label}} should have a minimum length of {{#limit}}',
      'string.max': '{{#label}} should have a maximum length of {{#limit}}',
      'string.pattern.base': '{{#label}} has invalid characters',
      'any.required': '{{#label}} is required',
    },
  });
};

export { bankValidation };
