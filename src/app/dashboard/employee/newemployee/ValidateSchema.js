const Joi = require('joi');

const JoiSchema = Joi.object({
  firstName: Joi.string().pattern(/^[a-zA-Z]+$/).min(2).max(15).required(),
  lastName: Joi.string().pattern(/^[a-zA-Z]+$/).min(2).max(15).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net","in"] },
  }),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required(), // Assuming phone number is 10 digits
  role: Joi.string().min(23).required(),
  password: Joi.string().min(6).required(), 
});

module.exports = JoiSchema;