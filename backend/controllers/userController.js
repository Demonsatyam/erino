const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user_signup_model');
const Lead = require('../models/lead_model');
const ErrorHandler = require('../utils/errorHandler');
const catchAsync = require('../middlewares/catchAsync');

// Utility: Send token in httpOnly cookie
const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.status(statusCode).cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  }).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

// -------------------- AUTH CONTROLLERS --------------------

// @route   POST /register
exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new ErrorHandler('Email already exists', 400));

  const user = await User.create({ name, email, password });
  sendToken(user, 201, res);
});

// @route   POST /login
exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler('Invalid email or password', 401));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new ErrorHandler('Invalid email or password', 401));

  sendToken(user, 200, res);
});

// @route   POST /logout
exports.logoutUser = catchAsync(async (req, res, next) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @route   GET /me
exports.getCurrentUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});


// -------------------- LEAD CONTROLLERS --------------------

// @route   POST /leads
exports.createLead = catchAsync(async (req, res, next) => {
  const lead = await Lead.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: lead });
});

// @route   GET /leads?page=&limit=&filters...
exports.getLeads = catchAsync(async (req, res, next) => {
  let { page = 1, limit = 20, ...filters } = req.query;

  page = parseInt(page);
  limit = Math.min(parseInt(limit), 100);

  const query = { createdBy: req.user._id }; // 👈 User-specific query

  // String filters
  ['email', 'company', 'city'].forEach(field => {
    if (filters[field]) {
      query[field] = new RegExp(filters[field], 'i');
    }
  });

  // Enum filters
  ['status', 'source'].forEach(field => {
    if (filters[field]) {
      query[field] = filters[field];
    }
  });

  // Numeric filters
  ['score', 'lead_value'].forEach(field => {
    if (filters[`${field}_gt`]) query[field] = { ...query[field], $gt: filters[`${field}_gt`] };
    if (filters[`${field}_lt`]) query[field] = { ...query[field], $lt: filters[`${field}_lt`] };
    if (filters[`${field}_eq`]) query[field] = { ...query[field], $eq: Number(filters[`${field}_eq`]) };
  });

  // Date filters
  ['created_at', 'last_activity_at'].forEach(field => {
    const from = filters[`${field}_from`];
    const to = filters[`${field}_to`];
    if (from || to) {
      query[field] = {};
      if (from) query[field].$gte = new Date(from);
      if (to) query[field].$lte = new Date(to);
    }
  });

  // Boolean filter
  if (filters.is_qualified !== undefined) {
    query.is_qualified = filters.is_qualified === 'true';
  }

  const total = await Lead.countDocuments(query);
  const leads = await Lead.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ created_at: -1 });

  res.status(200).json({
    success: true,
    data: leads,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});


// @route   GET /leads/:id
exports.getLeadById = catchAsync(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return next(new ErrorHandler('Lead not found', 404));
  res.status(200).json({ success: true, data: lead });
});

// @route   PUT /leads/:id
exports.updateLead = catchAsync(async (req, res, next) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!lead) return next(new ErrorHandler('Lead not found', 404));
  res.status(200).json({ success: true, data: lead });
});

// @route   DELETE /leads/:id
exports.deleteLead = catchAsync(async (req, res, next) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return next(new ErrorHandler('Lead not found', 404));
  res.status(200).json({ success: true, message: 'Lead deleted' });
});
