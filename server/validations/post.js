import { body } from "express-validator";

export const postCreateValidation = [
  body("title", "Error write title").isLength({ min: 3 }).isString(),
  body("text", "Error write post text").isLength({ min: 10 }).isString(),
  body("tags", "Error incorrect format tags (write array)")
    .optional()
    .isString(),
  body("imageUrl", "Error incorrect image url").optional().isString(),
];
