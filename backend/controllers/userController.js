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
// @route   GET /leads?page=&limit=&filters...
exports.getLeads = catchAsync(async (req, res, next) => {
  let { page = 1, limit = 20, q, ...filters } = req.query;

  page = parseInt(page);
  limit = Math.min(parseInt(limit), 100);

  const query = { createdBy: req.user._id };

  // 🔎 Global search across name, email, company, city
  if (q && String(q).trim()) {
    const regex = new RegExp(String(q).trim(), 'i'); // case-insensitive
    query.$or = [
      { name: regex },
      { email: regex },
      { company: regex },
      { city: regex },
    ];
  }

  // String filters (equals/contains) — now includes name too
  ['email', 'company', 'city', 'name'].forEach((field) => {
    if (filters[`${field}_eq`]) {
      query[field] = { $regex: new RegExp(`^${filters[`${field}_eq`]}$`, 'i') };
    } else if (filters[`${field}_contains`] || filters[field]) {
      const val = filters[`${field}_contains`] ?? filters[field];
      query[field] = { $regex: new RegExp(val, 'i') };
    }
  });

  // … keep the rest of your enum/number/date/boolean filters and pagination exactly as you have it …
  // (status/source eq & in; score/lead_value eq/gt/lt/between; created_at/last_activity_at on/before/after/between; is_qualified)
  
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
