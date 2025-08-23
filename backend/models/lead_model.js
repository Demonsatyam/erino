const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: String,
  company: String,
  city: String,
  state: String,
  source: {
    type: String,
    enum: ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'],
    required: true,
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'lost', 'won'],
    default: 'new',
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
  },
  lead_value: Number,
  last_activity_at: {
    type: Date,
    default: null,
  },
  is_qualified: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Lead', leadSchema);
