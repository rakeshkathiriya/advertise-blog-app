import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validate =
  (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,   // return all errors, not just first
      stripUnknown: true,  // remove unknown fields
      convert: true,       // convert input types automatically
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    req.body = value; // sanitized body
    next();
  };

export default validate;
