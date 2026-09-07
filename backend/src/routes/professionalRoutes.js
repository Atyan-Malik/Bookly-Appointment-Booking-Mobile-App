const express = require('express');
const controller = require('../controllers/professionalController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.get('/', controller.list);

router.get(
  '/me/availability',
  protect,
  restrictTo('provider'),
  controller.getMyAvailability
);

router.put(
  '/me/availability',
  protect,
  restrictTo('provider'),
  controller.updateMyAvailability
);

router.get('/:id/services', controller.getServices);
router.get('/:id/availability', controller.getAvailability);
router.get('/:id', controller.getById);

module.exports = router;