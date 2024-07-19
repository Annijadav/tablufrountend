import Joi from 'joi';

const workDetailsSchema = Joi.object({
  officeLandlineNumber: Joi.string().pattern(/^[0-9]+$/).min(10).max(12).allow('').optional().messages({
    'string.pattern.base': 'Office Landline Number can only contain numbers',
    'string.min': 'Office Landline Number should have a minimum length of 10',
    'string.max': 'Office Landline Number should have a maximum length of 12',
    'any.required': 'Office Landline Number is required'
  }),
  employeeCode: Joi.string().alphanum().min(3).allow('').optional().max(10).messages({
    'string.alphanum': 'Employee Code must only contain alphanumeric characters',
    'string.min': 'Employee Code should have a minimum length of 3',
    'string.max': 'Employee Code should have a maximum length of 10',
    'any.required': 'Employee Code is required'
  }),
  leaveRule: Joi.string().required().messages({
    'any.required': 'Leave Rule is required'
  }),
  reportingManager: Joi.string().min(3).max(50).required().messages({
    'string.min': 'Reporting Manager should have a minimum length of 3',
    'string.max': 'Reporting Manager should have a maximum length of 50',
    'any.required': 'Reporting Manager is required'
  }),
  shift: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Shift should have a minimum length of 3',
    'string.max': 'Shift should have a maximum length of 20',
    'any.required': 'Shift is required'
  }),
  department: Joi.string().required().messages({
    'any.required': 'Department is required'
  }),
  designation: Joi.string().required().messages({
    'any.required': 'Designation is required'
  }),
  grade: Joi.string().min(1).max(5).allow('').messages({
    'string.min': 'Grade should have a minimum length of 1',
    'string.max': 'Grade should have a maximum length of 5',
    'any.required': 'Grade is required'
  }),
  employeeType: Joi.string().valid('Permanent', 'Contract', 'Third Party', 'Consultant', 'Freelancer').required().messages({
    'any.only': 'Employee Type must be one of [Permanent, Contract, Third Party, Consultant, Freelancer]',
    'any.required': 'Employee Type is required'
  }),
  company: Joi.string().min(2).max(50).messages({
    'string.min': 'Company should have a minimum length of 2',
    'string.max': 'Company should have a maximum length of 50',
    'any.required': 'Company is required'
  }),
  location: Joi.string().min(2).max(50).messages({
    'string.min': 'Location should have a minimum length of 2',
    'string.max': 'Location should have a maximum length of 50',
    'any.required': 'Location is required'
  }),
  biomerticId: Joi.string().alphanum().min(3).max(15).allow('').messages({
    'string.alphanum': 'Biomertic ID must only contain alphanumeric characters',
    'string.min': 'Biomertic ID should have a minimum length of 3',
    'string.max': 'Biomertic ID should have a maximum length of 15',
    'any.required': 'Biomertic ID is required'
  }),
  hiringSource: Joi.string().min(2).max(50).allow('').messages({
    'string.min': 'Hiring Source should have a minimum length of 2',
    'string.max': 'Hiring Source should have a maximum length of 50',
    'any.required': 'Hiring Source is required'
  }),
  probationStatus: Joi.string().min(2).max(20).messages({
    'string.min': 'Probation Status should have a minimum length of 2',
    'string.max': 'Probation Status should have a maximum length of 20',
    'any.required': 'Probation Status is required'
  }),
  sourceOfVerification: Joi.string().min(2).max(50).allow('').messages({
    'string.min': 'Source of Verification should have a minimum length of 2',
    'string.max': 'Source of Verification should have a maximum length of 50',
    'any.required': 'Source of Verification is required'
  }),
});

const workDetailValidate = (data) => {
  return workDetailsSchema.validate(data, {
    abortEarly: false,
    messages: {
      'string.base': '{{#label}} must be a string',
      'string.empty': '{{#label}} cannot be empty',
      'string.min': '{{#label}} should have a minimum length of {{#limit}}',
      'string.max': '{{#label}} should have a maximum length of {{#limit}}',
      'string.pattern.base': '{{#label}} has invalid characters',
      'date.base': '{{#label}} must be a valid date',
      'number.base': '{{#label}} must be a number',
    },
  });
};

export { workDetailValidate };
