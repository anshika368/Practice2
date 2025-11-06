const Zone = require('../models/Zone');

// Get all zones for an event
exports.getZonesByEvent = async (req, res) => {
  try {
    const zones = await Zone.find({ event: req.params.eventId }).populate('event', 'name');
    res.json({ success: true, data: zones });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all zones
exports.getAllZones = async (req, res) => {
  try {
    const zones = await Zone.find().populate('event', 'name');
    res.json({ success: true, data: zones });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single zone
exports.getZone = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id).populate('event', 'name');
    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    res.json({ success: true, data: zone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create zone
exports.createZone = async (req, res) => {
  try {
    const zone = new Zone(req.body);
    zone.updateDensityStatus();
    await zone.save();
    res.status(201).json({ success: true, data: zone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update zone
exports.updateZone = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    Object.assign(zone, req.body);
    zone.updateDensityStatus();
    await zone.save();

    res.json({ success: true, data: zone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete zone
exports.deleteZone = async (req, res) => {
  try {
    const zone = await Zone.findByIdAndDelete(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    res.json({ success: true, message: 'Zone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update zone crowd count (for real-time updates)
exports.updateCrowdCount = async (req, res) => {
  try {
    const { currentCount } = req.body;
    const zone = await Zone.findById(req.params.id);
    
    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    zone.currentCount = currentCount;
    zone.updateDensityStatus();
    await zone.save();

    res.json({ success: true, data: zone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
