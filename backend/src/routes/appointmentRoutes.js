const express = require('express');
const controller = require('../controllers/appointmentController');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');
const { createAppointmentSchema, updateStatusSchema } = require('../validators/appointmentValidators');

const router = express.Router();

router.use(protect);
router.post('/', validate(createAppointmentSchema), controller.create);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.patch('/:id', validate(updateStatusSchema), controller.updateStatus);

module.exports = router;