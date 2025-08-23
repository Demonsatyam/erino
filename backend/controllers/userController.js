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

  const token = user.getJwtToken(); // or jwt.sign(...)
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    user,
  });
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
  let { page = 1, limit = 20, q = "", status, source } = req.query;

  page = Number.parseInt(page, 10) || 1;
  limit = Math.min(Number.parseInt(limit, 10) || 20, 100);

  const query = { createdBy: req.user._id };

  // 1) Global text search: name | email | city | company (case-insensitive, contains)
  const qTrim = String(q).trim();
  if (qTrim) {
    const r = new RegExp(qTrim, "i");
    query.$or = [{ name: r }, { email: r }, { city: r }, { company: r }];
  }

  // 2) Status filter (exact). Ignore if empty or "all"
  if (status && status !== "all") {
    query.status = status;
  }

  // 3) Source filter (exact). Ignore if empty or "all"
  if (source && source !== "all") {
    query.source = source;
  }

  // ---- fetch + paginate ----
  const total = await Lead.countDocuments(query);
  const leads = await Lead.find(query)
    .sort({ created_at: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

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
