const {body} = require ('express-validator');
const User = require ('../models/user');

exports.todoValidator = [
  body ('title').isString ().notEmpty ().withMessage ('Title is required'),
  body ('user')
    .isMongoId ()
    .withMessage ('Invalid user ID')
    .custom (async userId => {
      const user = await User.findById (userId);
      if (!user) {
        return Promise.reject ('User not found');
      }
    }),
  body ('description')
    .optional ()
    .isString ()
    .withMessage ('Description must be a string'),
  body ('filePath')
    .optional ()
    .isString ()
    .withMessage ('File path must be a string'),
];
