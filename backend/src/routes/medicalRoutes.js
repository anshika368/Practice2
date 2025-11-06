const express = require('express');
const router = express.Router();
const medicalController = require('../controllers/medicalController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', medicalController.getAllMedicalFacilities);
router.get('/event/:eventId', medicalController.getMedicalFacilitiesByEvent);
router.get('/:id', medicalController.getMedicalFacility);
router.post('/', medicalController.createMedicalFacility);
router.put('/:id', medicalController.updateMedicalFacility);
router.delete('/:id', medicalController.deleteMedicalFacility);

module.exports = router;
