const express = require('express');
const router = express.Router();
const lostPersonController = require('../controllers/lostPersonController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', lostPersonController.getAllLostPersons);
router.get('/stats', lostPersonController.getLostPersonStats);
router.get('/event/:eventId', lostPersonController.getLostPersonsByEvent);
router.get('/:id', lostPersonController.getLostPerson);
router.post('/', lostPersonController.createLostPerson);
router.put('/:id', lostPersonController.updateLostPerson);
router.delete('/:id', lostPersonController.deleteLostPerson);

module.exports = router;
