const Joi = require("joi");

const selectedDateSchema = Joi.object({
  startDate: Joi.date().required().messages({
    "date.base": "Start date must be a valid date.",
    "any.required": "Start date is required.",
  }),
  endDate: Joi.date().required().greater(Joi.ref("startDate")).messages({
    "date.base": "End date must be a valid date.",
    "date.greater": "End date must be greater than start date.",
    "any.required": "End date is required.",
  }),
  time: Joi.string().required().messages({
    "string.base": "Time must be a valid string.",
    "any.required": "Time is required.",
  }),
});

// Define the main schema for the data object
const leaveRequestSchema = Joi.object({
  // userID: Joi.string().required().messages({
  //   "string.base": "User ID must be a valid string.",
  //   "any.required": "User ID is required.",
  // }),
  leaveType: Joi.string().required().messages({
    "string.base": "Leave type must be a valid string.",
    "any.required": "Leave type is required.",
  }),
  selectedDates: Joi.array().items(selectedDateSchema).required().messages({
    "array.base": "Selected dates must be a valid array.",
    "any.required": "Selected dates are required.",
  }),
  leaveReason: Joi.string().optional().messages({
    "string.base": "Leave reason must be a valid string.",
  }),
  proof: Joi.string().optional().messages({
    "string.base": "Proof must be a valid string.",
  }),
});

// Example usage
const validateLeaveRequestForm = (data) => {
  const { error } = leaveRequestSchema.validate(data);
  if (error) {
    return error.details[0].message;
  }
  return null;
};

export { validateLeaveRequestForm };
