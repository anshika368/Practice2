const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zoneController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', zoneController.getAllZones);
router.get('/event/:eventId', zoneController.getZonesByEvent);
router.get('/:id', zoneController.getZone);
router.post('/', zoneController.createZone);
router.put('/:id', zoneController.updateZone);
router.put('/:id/crowd', zoneController.updateCrowdCount);
router.delete('/:id', zoneController.deleteZone);

module.exports = router;
