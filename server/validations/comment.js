import { body } from 'express-validator';

export const commentValidation = [
  body('comments.*.author', 'Error: Invalid author').isMongoId(),
  body('comments.*.text', 'Error: Invalid comment text').isLength({ min: 10 }),
];
