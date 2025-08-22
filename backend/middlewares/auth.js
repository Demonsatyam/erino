const jwt = require('jsonwebtoken');
const User = require('../models/user_signup_model'); // updated path
const ErrorHandler = require('../utils/errorHandler');
const catchAsync = require('./catchAsync');

exports.isAuthenticated = catchAsync(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler('Please login to access this resource', 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id); // `id` should be correct from your token payload

  if (!req.user) {
    return next(new ErrorHandler('User not found', 404));
  }

  next();
});
