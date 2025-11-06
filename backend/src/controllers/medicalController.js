const MedicalFacility = require('../models/MedicalFacility');

// Get all medical facilities
exports.getAllMedicalFacilities = async (req, res) => {
  try {
    const facilities = await MedicalFacility.find().populate('event', 'name');
    res.json({ success: true, data: facilities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get medical facilities by event
exports.getMedicalFacilitiesByEvent = async (req, res) => {
  try {
    const facilities = await MedicalFacility.find({ event: req.params.eventId })
      .populate('event', 'name');
    res.json({ success: true, data: facilities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single medical facility
exports.getMedicalFacility = async (req, res) => {
  try {
    const facility = await MedicalFacility.findById(req.params.id).populate('event', 'name');
    if (!facility) {
      return res.status(404).json({ message: 'Medical facility not found' });
    }
    res.json({ success: true, data: facility });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create medical facility
exports.createMedicalFacility = async (req, res) => {
  try {
    const facility = new MedicalFacility(req.body);
    await facility.save();
    res.status(201).json({ success: true, data: facility });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update medical facility
exports.updateMedicalFacility = async (req, res) => {
  try {
    const facility = await MedicalFacility.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!facility) {
      return res.status(404).json({ message: 'Medical facility not found' });
    }
    res.json({ success: true, data: facility });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete medical facility
exports.deleteMedicalFacility = async (req, res) => {
  try {
    const facility = await MedicalFacility.findByIdAndDelete(req.params.id);
    if (!facility) {
      return res.status(404).json({ message: 'Medical facility not found' });
    }
    res.json({ success: true, message: 'Medical facility deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
