const LostPerson = require('../models/LostPerson');

// Get all lost person reports
exports.getAllLostPersons = async (req, res) => {
  try {
    const lostPersons = await LostPerson.find().populate('event', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: lostPersons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get lost persons by event
exports.getLostPersonsByEvent = async (req, res) => {
  try {
    const lostPersons = await LostPerson.find({ event: req.params.eventId })
      .populate('event', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: lostPersons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single lost person
exports.getLostPerson = async (req, res) => {
  try {
    const lostPerson = await LostPerson.findById(req.params.id).populate('event', 'name');
    if (!lostPerson) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ success: true, data: lostPerson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create lost person report
exports.createLostPerson = async (req, res) => {
  try {
    const lostPerson = new LostPerson(req.body);
    await lostPerson.save();
    res.status(201).json({ success: true, data: lostPerson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update lost person report
exports.updateLostPerson = async (req, res) => {
  try {
    const lostPerson = await LostPerson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!lostPerson) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ success: true, data: lostPerson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete lost person report
exports.deleteLostPerson = async (req, res) => {
  try {
    const lostPerson = await LostPerson.findByIdAndDelete(req.params.id);
    if (!lostPerson) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get statistics
exports.getLostPersonStats = async (req, res) => {
  try {
    const totalReported = await LostPerson.countDocuments();
    const found = await LostPerson.countDocuments({ status: 'found' });
    const searching = await LostPerson.countDocuments({ status: 'searching' });
    const reported = await LostPerson.countDocuments({ status: 'reported' });

    res.json({
      success: true,
      data: {
        totalReported,
        found,
        searching,
        reported
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
