import Joi from "joi";

const leaveRuleNameSchema = Joi.object({
  leaveRuleName: Joi.string()
    .min(2)
    .max(30)
    .regex(/^[a-zA-Z\s]+$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Check leave rule name only alphabetic characters are allowed.",
    }),
  leaveName: Joi.string()
    .optional()
    .min(2)
    .max(30)
    .regex(/^[a-zA-Z\s]+$/)
    .messages({
      "string.base": "Leave name should be a string.",
      "string.pattern.base":
        "Check leave type name only alphabetic characters are allowed.",
      "string.empty": "Leave name cannot be empty.",
      "string.min": "Leave name should have at least 2 characters.",
      "string.max": "Leave name should have at most 30 characters.",
    }),
  leaveDetails: Joi.array()
    .items(
      Joi.object({
        basicLeave: Joi.object({
          leaveName: Joi.string().optional().min(2).max(30),
          status: Joi.string().valid("Active", "Inactive").default("Inactive"),
          lastAppiedDate: Joi.date().optional(),
        }).optional(),

        leaveDetail: Joi.object({
          disbursementCycle: Joi.string().optional(),
          disbursementTime: Joi.string().optional(),
          isEnableTenureBasedOnLeaveDisbursement: Joi.boolean().optional(),
          forTenure: Joi.array()
            .items(
              Joi.object({
                lessThanYear: Joi.number().default(0),
                disburseLeaves: Joi.number().default(0),
              }).optional()
            )
            .optional(),
          leaveCount: Joi.number().default(0),
          leaveCountProbation: Joi.number().default(0),
          isLeaveTypePaid: Joi.string().valid("Yes", "No", "").optional(),
          isEncashLeaveBalance: Joi.string().valid("Yes", "No", "").optional(),
          wantToRecoverTheExcessLeaveBalance: Joi.string()
            .valid("Yes", "No", "")
            .optional(),
          gender: Joi.string().optional(),
          maritalStatus: Joi.string().optional(),
          isCarryForwardToNextDisbursementCycle: Joi.boolean().default(false),
          isCarryForwardToNextYear: Joi.boolean().default(false),
          setMaxCarryForwardLeave: Joi.number().default(0),
          isLeaveDisbuseOnTenureCompletion: Joi.boolean().default(false),
        }).optional(),

        leaveRestriction: Joi.object({
          probationLeavesAllowed: Joi.string()
            .valid("Yes", "No", "")
            .optional(),
          probationLeaveVisibility: Joi.string()
            .valid("Yes", "No", "")
            .optional(),
          noticePeriodLeavesAllowed: Joi.string()
            .valid("Yes", "No", "")
            .optional(),
          roundOffLeaveBalance: Joi.string().valid("Yes", "No", "").optional(),
          isRestrictionWhileApplyingLeave: Joi.boolean().optional(),
          backDatedLeaveRestriction: Joi.string()
            .valid("Yes", "No", "")
            .optional(),
          countOfBackDatedLeaveRestriction: Joi.number().default(0),
          priorNoticeForFutureLeaves: Joi.string()
            .valid("Yes", "No", "")
            .optional(),
          countOffutureDatedLeavesBeforeDays: Joi.number().default(0),
          isThierMaxLeavesPerMonth: Joi.string()
            .valid("Yes", "No", "")
            .optional(),
          maxLeavesPerMonth: Joi.number().default(0),
          leaveAvailAfterJoiningDays: Joi.number().default(0),
          minLeavesAtATime: Joi.number().default(0),
          isTheirLimitForConsecutiveLeave: Joi.string()
            .valid("Yes", "No", "")
            .optional(),
          consecutiveLeaveLimit: Joi.number().default(0),
        }).optional(),

        advanceSettings: Joi.object({
          negativeLeaveAllowed: Joi.string().valid("Yes", "No", "").optional(),
          maxNegativeLeaveCount: Joi.number().default(0),
          halfDayLeaveAllowed: Joi.string().valid("Yes", "No", "").optional(),
          viewLeaveDetailsOnDashboard: Joi.string()
            .valid("Yes", "No", "")
            .optional(),
          viewLeaveBalanceOnDashboard: Joi.string()
            .valid("Yes", "No", "")
            .optional(),
          proofRequiredForLeaveRequest: Joi.string()
            .valid("Yes", "No", "")
            .optional(),
          proofRequiredExceedingDays: Joi.number().default(0),
          manualLeaveDisbursement: Joi.string()
            .valid("Yes", "No", "")
            .optional(),
          maxLeaveAvailPerYear: Joi.number().default(0),
        }).optional(),
      }).optional()
    )
    .optional(),

  company: Joi.string().optional(),
}).unknown(true); // .unknown(true) allows other fields that are not defined in the schema

const validateForm = (data) => {
  const { error } = leaveRuleNameSchema.validate(data);
  if (error) {
    return error.details[0].message;
  }
  return null;
};

const leaveDetailSchema = Joi.object({
  disbursementCycle: Joi.string().required().messages({
    "string.base": "Disbursement cycle must be a string.",
    "any.required": "Disbursement cycle is required.",
  }),
  disbursementTime: Joi.string().required().messages({
    "string.base": "Disbursement time must be a string.",
    "any.required": "Disbursement time is required.",
  }),
  isEnableTenureBasedOnLeaveDisbursement: Joi.boolean().required().messages({
    "boolean.base":
      "Enable tenure based on leave disbursement must be a boolean.",
    "any.required": "Enable tenure based on leave disbursement is required.",
  }),
  forTenure: Joi.array()
    .items(
      Joi.object({
        lessThanYear: Joi.number().integer().min(0).messages({
          //   'number.base': 'Less than year must be a number.',
          "number.min": "Less than year cannot be less than 0.",
          "any.required": "Less than year is required.",
        }),
        disburseLeaves: Joi.number().integer().min(0).messages({
          //   'number.base': 'Disburse leaves must be a number.',
          "number.min": "Disburse leaves cannot be less than 0.",
          "any.required": "Disburse leaves is required.",
        }),
      }).unknown(true)
    )
    .unique(
      (a, b) =>
        a.lessThanYear === b.lessThanYear &&
        a.disburseLeaves === b.disburseLeaves
    )
    .messages({
      "array.unique": "Duplicate forTenure entries are not allowed.",
    }),
  leaveCount: Joi.number().integer().min(0).required().messages({
    "number.base": "Leave count must be a number.",
    "number.min": "Leave count cannot be less than 0.",
    "any.required": "Leave count is required.",
  }),
  leaveCountProbation: Joi.number().integer().min(0).required().messages({
    "number.base": "Leave count probation must be a number.",
    "number.min": "Leave count probation cannot be less than 0.",
    "any.required": "Leave count probation is required.",
  }),
  isLeaveTypePaid: Joi.string().valid("Yes", "No", "").required().messages({
    "string.base": "Is leave type paid must be a string.",
    "any.only": "Is leave type paid must be Yes, No, or empty.",
    "any.required": "Is leave type paid is required.",
  }),
  isEncashLeaveBalance: Joi.string()
    .valid("Yes", "No", "")
    .required()
    .messages({
      "string.base": "Is encash leave balance must be a string.",
      "any.only": "Is encash leave balance must be Yes, No, or empty.",
      "any.required": "Is encash leave balance is required.",
    }),
  wantToRecoverTheExcessLeaveBalance: Joi.string()
    .valid("Yes", "No", "")
    .required()
    .messages({
      "string.base":
        "Want to recover the excess leave balance must be a string.",
      "any.only":
        "Want to recover the excess leave balance must be Yes, No, or empty.",
      "any.required": "Want to recover the excess leave balance is required.",
    }),
  gender: Joi.string().required().messages({
    "string.base": "Gender must be a string.",
    "any.required": "Gender is required.",
  }),
  maritalStatus: Joi.string().required().messages({
    "string.base": "Marital status must be a string.",
    "any.required": "Marital status is required.",
  }),
  isCarryForwardToNextDisbursementCycle: Joi.boolean().required().messages({
    "boolean.base":
      "Is carry forward to next disbursement cycle must be a boolean.",
    "any.required": "Is carry forward to next disbursement cycle is required.",
  }),
  isCarryForwardToNextYear: Joi.boolean().required().messages({
    "boolean.base": "Is carry forward to next year must be a boolean.",
    "any.required": "Is carry forward to next year is required.",
  }),
  setMaxCarryForwardLeave: Joi.number().integer().min(0).required().messages({
    "number.base": "Set max carry forward leave must be a number.",
    "number.min": "Set max carry forward leave cannot be less than 0.",
    "any.required": "Set max carry forward leave is required.",
  }),
  isLeaveDisbuseOnTenureCompletion: Joi.boolean().required().messages({
    "boolean.base": "Is leave disburse on tenure completion must be a boolean.",
    "any.required": "Is leave disburse on tenure completion is required.",
  }),
}).unknown(true);

const validateleaveDetailForm = (data) => {
  const { error } = leaveDetailSchema.validate(data);
  if (error) {
    return error.details[0].message;
  }
  return null;
};

const leaveRestrictionSchema = Joi.object({
  probationLeavesAllowed: Joi.string().valid("Yes", "No", "").messages({
    "string.base": "Probation leaves allowed must be a string.",
    "any.only": "Probation leaves allowed must be Yes, No, or empty.",
  }),
  probationLeaveVisibility: Joi.string().valid("Yes", "No", "").messages({
    "string.base": "Probation leave visibility must be a string.",
    "any.only": "Probation leave visibility must be Yes, No, or empty.",
  }),
  noticePeriodLeavesAllowed: Joi.string().valid("Yes", "No", "").messages({
    "string.base": "Notice period leaves allowed must be a string.",
    "any.only": "Notice period leaves allowed must be Yes, No, or empty.",
  }),
  roundOffLeaveBalance: Joi.string().valid("Yes", "No", "").messages({
    "string.base": "Round off leave balance must be a string.",
    "any.only": "Round off leave balance must be Yes, No, or empty.",
  }),
  isRestrictionWhileApplyingLeave: Joi.boolean().messages({
    "boolean.base": "Is restriction while applying leave must be a boolean.",
  }),
  backDatedLeaveRestriction: Joi.string().valid("Yes", "No", "").messages({
    "string.base": "Back dated leave restriction must be a string.",
    "any.only": "Back dated leave restriction must be Yes, No, or empty.",
  }),
  countOfBackDatedLeaveRestriction: Joi.number().integer().min(0).messages({
    "number.base": "Count of back dated leave restriction must be a number.",
    "number.min":
      "Count of back dated leave restriction cannot be less than 0.",
  }),
  priorNoticeForFutureLeaves: Joi.string().valid("Yes", "No", "").messages({
    "string.base": "Prior notice for future leaves must be a string.",
    "any.only": "Prior notice for future leaves must be Yes, No, or empty.",
  }),
  countOffutureDatedLeavesBeforeDays: Joi.number().integer().min(0).messages({
    "number.base": "Count of future dated leaves before days must be a number.",
    "number.min":
      "Count of future dated leaves before days cannot be less than 0.",
  }),
  isThierMaxLeavesPerMonth: Joi.string().valid("Yes", "No", "").messages({
    "string.base": "Is there max leaves per month must be a string.",
    "any.only": "Is there max leaves per month must be Yes, No, or empty.",
  }),
  maxLeavesPerMonth: Joi.number().integer().min(0).messages({
    "number.base": "Max leaves per month must be a number.",
    "number.min": "Max leaves per month cannot be less than 0.",
  }),
  leaveAvailAfterJoiningDays: Joi.number().integer().min(0).messages({
    "number.base": "Leave avail after joining days must be a number.",
    "number.min": "Leave avail after joining days cannot be less than 0.",
  }),
  minLeavesAtATime: Joi.number().integer().min(0).messages({
    "number.base": "Min leaves at a time must be a number.",
    "number.min": "Min leaves at a time cannot be less than 0.",
  }),
  isTheirLimitForConsecutiveLeave: Joi.string().messages({
    "string.base": "Is there limit for consecutive leave must be a string.",
    "any.only":
      "Is there limit for consecutive leave must be Yes, No, or empty.",
  }),
  consecutiveLeaveLimit: Joi.number().integer().min(0).messages({
    "number.base": "Consecutive leave limit must be a number.",
    "number.min": "Consecutive leave limit cannot be less than 0.",
  }),
});

const validateLeaveRestrictionForm = (data) => {
  const { error } = leaveRestrictionSchema.validate(data);
  if (error) {
    return error.details[0].message;
  }
  return null;
};

const advanceSettingsSchema = Joi.object({
  negativeLeaveAllowed: Joi.string()
    .valid("Yes", "No", "")
    .required()
    .messages({
      "string.base": "Negative leave allowed must be a string.",
      "any.only": "Negative leave allowed must be Yes, No, or empty.",
      "any.required": "Negative leave allowed is required.",
    }),
  maxNegativeLeaveCount: Joi.number().integer().min(0).required().messages({
    "number.base": "Max negative leave count must be a number.",
    "number.min": "Max negative leave count cannot be less than 0.",
    "any.required": "Max negative leave count is required.",
  }),
  halfDayLeaveAllowed: Joi.string().valid("Yes", "No", "").required().messages({
    "string.base": "Half day leave allowed must be a string.",
    "any.only": "Half day leave allowed must be Yes, No, or empty.",
    "any.required": "Half day leave allowed is required.",
  }),
  viewLeaveDetailsOnDashboard: Joi.string()
    .valid("Yes", "No", "")
    .required()
    .messages({
      "string.base": "View leave details on dashboard must be a string.",
      "any.only": "View leave details on dashboard must be Yes, No, or empty.",
      "any.required": "View leave details on dashboard is required.",
    }),
  viewLeaveBalanceOnDashboard: Joi.string()
    .valid("Yes", "No", "")
    .required()
    .messages({
      "string.base": "View leave balance on dashboard must be a string.",
      "any.only": "View leave balance on dashboard must be Yes, No, or empty.",
      "any.required": "View leave balance on dashboard is required.",
    }),
  proofRequiredForLeaveRequest: Joi.string()
    .valid("Yes", "No", "")
    .required()
    .messages({
      "string.base": "Proof required for leave request must be a string.",
      "any.only": "Proof required for leave request must be Yes, No, or empty.",
      "any.required": "Proof required for leave request is required.",
    }),
  proofRequiredExceedingDays: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "Proof required exceeding days must be a number.",
      "number.min": "Proof required exceeding days cannot be less than 0.",
      "any.required": "Proof required exceeding days is required.",
    }),
  manualLeaveDisbursement: Joi.string()
    .valid("Yes", "No", "")
    .required()
    .messages({
      "string.base": "Manual leave disbursement must be a string.",
      "any.only": "Manual leave disbursement must be Yes, No, or empty.",
      "any.required": "Manual leave disbursement is required.",
    }),
  maxLeaveAvailPerYear: Joi.number().integer().min(0).required().messages({
    "number.base": "Max leave avail per year must be a number.",
    "number.min": "Max leave avail per year cannot be less than 0.",
    "any.required": "Max leave avail per year is required.",
  }),
});

// Example usage
const validateAdvanceSettingsForm = (data) => {
  const { error } = advanceSettingsSchema.validate(data);
  if (error) {
    return error.details[0].message;
  }
  return null;
};

export {
  validateForm,
  validateleaveDetailForm,
  validateLeaveRestrictionForm,
  validateAdvanceSettingsForm,
};
