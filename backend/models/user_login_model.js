const mongoose = require('mongoose');

const userLoginSchema = new mongoose.Schema({
  email: String,
  password: String
});

// This will simply be a placeholder, real auth will be done via `UserSignup` model
module.exports = mongoose.model('UserLogin', userLoginSchema);
