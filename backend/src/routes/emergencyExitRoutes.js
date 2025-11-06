const express = require('express');
const router = express.Router();
const emergencyExitController = require('../controllers/emergencyExitController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', emergencyExitController.getAllEmergencyExits);
router.get('/event/:eventId', emergencyExitController.getEmergencyExitsByEvent);
router.get('/:id', emergencyExitController.getEmergencyExit);
router.post('/', emergencyExitController.createEmergencyExit);
router.put('/:id', emergencyExitController.updateEmergencyExit);
router.put('/:id/crowd', emergencyExitController.updateCrowdLevel);
router.delete('/:id', emergencyExitController.deleteEmergencyExit);

module.exports = router;
