const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', feedbackController.getAllFeedback);
router.get('/analytics', feedbackController.getFeedbackAnalytics);
router.get('/analytics/event/:eventId', feedbackController.getFeedbackAnalytics);
router.get('/event/:eventId', feedbackController.getFeedbackByEvent);
router.get('/:id', feedbackController.getFeedback);
router.post('/', feedbackController.createFeedback);

module.exports = router;
