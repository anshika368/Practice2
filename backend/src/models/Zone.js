const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  area: {
    type: Number,
    required: true // in square meters
  },
  currentCount: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  densityStatus: {
    type: String,
    enum: ['low', 'moderate', 'crowded'],
    default: 'low'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate density status based on people per square meter
zoneSchema.methods.updateDensityStatus = function() {
  const density = this.currentCount / this.area;
  if (density > 200) {
    this.densityStatus = 'crowded';
  } else if (density > 100) {
    this.densityStatus = 'moderate';
  } else {
    this.densityStatus = 'low';
  }
  this.lastUpdated = new Date();
};

module.exports = mongoose.model('Zone', zoneSchema);
