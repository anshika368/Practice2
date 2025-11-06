const mongoose = require('mongoose');

const lostPersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  photo: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    required: true
  },
  lastSeenTime: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  reporterName: {
    type: String,
    required: true
  },
  reporterContact: {
    type: String,
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    enum: ['reported', 'found', 'searching'],
    default: 'reported'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LostPerson', lostPersonSchema);
