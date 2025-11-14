import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validate =
  (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        errors: messages,
      });
    }

    req.body = value; // sanitized body
    next();
  };

export default validate;
