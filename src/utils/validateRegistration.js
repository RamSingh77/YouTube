import { body } from "express-validator";
const registerValidator = [
  body("fullName")
    .trim()
    .notEmpty().withMessage("Full name is required"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email must be valid"),

  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export {registerValidator}

