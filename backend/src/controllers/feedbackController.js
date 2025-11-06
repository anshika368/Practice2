const Feedback = require('../models/Feedback');

// Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate('event', 'name').sort({ submittedAt: -1 });
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get feedback by event
exports.getFeedbackByEvent = async (req, res) => {
  try {
    const feedback = await Feedback.find({ event: req.params.eventId })
      .populate('event', 'name')
      .sort({ submittedAt: -1 });
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single feedback
exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate('event', 'name');
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create feedback
exports.createFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get feedback analytics
exports.getFeedbackAnalytics = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    
    // Get all feedback for the event
    const feedback = await Feedback.find(eventId ? { event: eventId } : {});

    // Calculate average ratings by category
    const categories = ['safety', 'facilities', 'organization', 'crowd_management', 'medical', 'overall'];
    const analytics = {};

    for (const category of categories) {
      const categoryFeedback = feedback.filter(f => f.category === category);
      if (categoryFeedback.length > 0) {
        const totalRating = categoryFeedback.reduce((sum, f) => sum + f.rating, 0);
        analytics[category] = {
          averageRating: (totalRating / categoryFeedback.length).toFixed(2),
          count: categoryFeedback.length
        };
      } else {
        analytics[category] = {
          averageRating: 0,
          count: 0
        };
      }
    }

    // Overall statistics
    const totalFeedback = feedback.length;
    const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
    const overallAverage = totalFeedback > 0 ? (totalRating / totalFeedback).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        categories: analytics,
        overall: {
          totalFeedback,
          averageRating: overallAverage
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
