import Joi from "joi";

const passwordValidation = Joi.string()
  .min(8)
  .max(128)
  .pattern(/(?=.*[a-z])/, "lowercase")
  .pattern(/(?=.*[A-Z])/, "uppercase")
  .pattern(/(?=.*\d)/, "digit")
  .pattern(/(?=.*[!@#$%^&*])/, "special")
  .required()
  .messages({
    "string.pattern.name":
      "Password must contain uppercase, lowercase, a number, and a special character",
       "any.required": "Password is required",
  });

export const userSignupSchema = Joi.object({
  firstname: Joi.string().min(3).max(30).required().messages({
    "string.min": "First name must be at least {#limit} characters",
    "string.max": "First name cannot exceed {#limit} characters",
    "any.required": "First name is required",
  }),
  lastname: Joi.string().min(3).max(30).required().messages({
    "string.min": "Last name must be at least {#limit} characters",
    "string.max": "Last name cannot exceed {#limit} characters",
    "any.required": "Last name is required",
  }), 
  email: Joi.string()
    .email({ tlds: { allow: true } })
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
    role: Joi.string().valid("Admin", "User").default("User"),
  isActive: Joi.boolean().default(false),
  password: passwordValidation,
}).options({
  abortEarly: false,
  stripUnknown: true,
});