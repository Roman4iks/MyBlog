import { body } from "express-validator";

export const registerValidation = [
  body("email", "Error value Email").isEmail(),
  body("password", "Error password minimum length 5 symbols").isLength({
    min: 5,
  }),
  body("fullName", "Error write full name").isLength({ min: 2 }),
  body("avatarUrl", "Error incorrect url avatar").optional().isURL(),
];

export const loginValidation = [
  body("email", "Error value Email").isEmail(),
  body("password", "Error password minimum length 5 symbols").isLength({
    min: 5,
  }),
];
