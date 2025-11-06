const EmergencyExit = require('../models/EmergencyExit');

// Get all emergency exits
exports.getAllEmergencyExits = async (req, res) => {
  try {
    const exits = await EmergencyExit.find().populate('event', 'name');
    res.json({ success: true, data: exits });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get emergency exits by event
exports.getEmergencyExitsByEvent = async (req, res) => {
  try {
    const exits = await EmergencyExit.find({ event: req.params.eventId })
      .populate('event', 'name');
    res.json({ success: true, data: exits });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single emergency exit
exports.getEmergencyExit = async (req, res) => {
  try {
    const exit = await EmergencyExit.findById(req.params.id).populate('event', 'name');
    if (!exit) {
      return res.status(404).json({ message: 'Emergency exit not found' });
    }
    res.json({ success: true, data: exit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create emergency exit
exports.createEmergencyExit = async (req, res) => {
  try {
    const exit = new EmergencyExit(req.body);
    exit.updateStatus();
    await exit.save();
    res.status(201).json({ success: true, data: exit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update emergency exit
exports.updateEmergencyExit = async (req, res) => {
  try {
    const exit = await EmergencyExit.findById(req.params.id);
    if (!exit) {
      return res.status(404).json({ message: 'Emergency exit not found' });
    }

    Object.assign(exit, req.body);
    exit.updateStatus();
    await exit.save();

    res.json({ success: true, data: exit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete emergency exit
exports.deleteEmergencyExit = async (req, res) => {
  try {
    const exit = await EmergencyExit.findByIdAndDelete(req.params.id);
    if (!exit) {
      return res.status(404).json({ message: 'Emergency exit not found' });
    }
    res.json({ success: true, message: 'Emergency exit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update crowd level (for real-time updates)
exports.updateCrowdLevel = async (req, res) => {
  try {
    const { currentCrowdLevel } = req.body;
    const exit = await EmergencyExit.findById(req.params.id);
    
    if (!exit) {
      return res.status(404).json({ message: 'Emergency exit not found' });
    }

    exit.currentCrowdLevel = currentCrowdLevel;
    exit.updateStatus();
    await exit.save();

    res.json({ success: true, data: exit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
