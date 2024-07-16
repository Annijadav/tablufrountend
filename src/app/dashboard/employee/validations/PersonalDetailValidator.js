import Joi from 'joi';

const personalDetailsSchema = Joi.object({
  cityType: Joi.string().required(),
  fatherName: Joi.string().pattern(/^\s*\S+(?:\s+\S+)*\s*$/).min(2).max(15).required(),
  motherName: Joi.string().pattern(/^\s*\S+(?:\s+\S+)*\s*$/).min(2).max(15).required(),
  profileImage: Joi.optional(),
  gender: Joi.string().allow('').required(),
  dateOfBirth: Joi.date().allow('').required(),
  maritalStatus: Joi.string().allow('').optional(),
  dateOfMarriage: Joi.date().allow('').optional(),
  nationality: Joi.string().allow('').optional(),
  PFUAN: Joi.string().allow('').optional(),
  joiningDate: Joi.date().allow('').required(),
  bloodGroup: Joi.string().allow('').optional(),
  noticeDays: Joi.number().allow('').optional(),
  passportNo: Joi.string().allow('').optional(),
  aadharCardNo: Joi.string().allow('').optional(),
  panNo: Joi.string().allow('').optional(),
  PFNo: Joi.string().allow('').optional(),
  dateOfGratuity: Joi.date().allow('').optional(),
  ESINumber: Joi.string().allow('').optional(),
  payRollType: Joi.string().allow('').optional(),
  contractEndDate: Joi.date().allow('').optional(),
});

const validatePersonalDetails = (data) => {
  return personalDetailsSchema.validate(data, {
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

export { validatePersonalDetails };