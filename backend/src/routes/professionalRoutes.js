const express = require('express');
const controller = require('../controllers/professionalController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

// ==============================
// PROVIDER — SPECIFIC /me ROUTES
// MUST COME BEFORE /:id ROUTES
// ==============================

router.get(
  '/me',
  protect,
  restrictTo('provider'),
  controller.getMyProfessional
);

router.post(
  '/',
  protect,
  restrictTo('provider'),
  controller.createProfessional
);

router.put(
  '/me',
  protect,
  restrictTo('provider'),
  controller.updateMyProfessional
);

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


// ==============================
// PUBLIC / CUSTOMER
// ==============================

router.get('/', controller.list);

router.get('/:id/services', controller.getServices);

router.get('/:id/availability', controller.getAvailability);

router.get('/:id', controller.getById);


module.exports = router;