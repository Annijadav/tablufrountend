const Joi = require("joi");
// const { ObjectId } = require("mongodb");

// Custom Joi extension to validate ObjectID
// const customJoi = Joi.extend((joi) => ({
//   type: "objectId",
//   base: joi.string(),
//   messages: {
//     "objectId.base": "Invalid ObjectId format",
//   },
//   validate(value, helpers) {
//     if (!ObjectId.isValid(value)) {
//       return { value, errors: helpers.error("objectId.base") };
//     }
//   },
// }));

const holidayValidationSchema = Joi.object({
  name: Joi.string()
    .optional()
    .min(2)
    .max(30)
    .regex(/^[a-zA-Z\s]+$/)
    .messages({
      "string.pattern.base": " In name only alphabetic characters are allowed.",
    }),
  holidayType: Joi.not(),
  description: Joi.string().max(100).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  holidayApplicabilities: Joi.array()
    .items(
      Joi.object({
        applicableOn: Joi.string().optional(),
        additionalField: Joi.array().items(Joi.string().optional()).optional(),
      })
    )
    .optional(),
  modifiedBy: Joi.string().optional(),
  status: Joi.boolean().default(true).optional(),
});

const validateForm = (data) => {
  const { error } = holidayValidationSchema.validate(data);
  if (error) {
    return error.details[0].message;
  }
  return null;
};

export { validateForm };
