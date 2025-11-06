const mongoose = require('mongoose');

const emergencyExitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  currentCrowdLevel: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['clear', 'moderate', 'crowded', 'blocked'],
    default: 'clear'
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update status based on crowd level
emergencyExitSchema.methods.updateStatus = function() {
  const percentage = (this.currentCrowdLevel / this.capacity) * 100;
  if (percentage > 80) {
    this.status = 'crowded';
  } else if (percentage > 50) {
    this.status = 'moderate';
  } else {
    this.status = 'clear';
  }
  this.lastUpdated = new Date();
};

module.exports = mongoose.model('EmergencyExit', emergencyExitSchema);
