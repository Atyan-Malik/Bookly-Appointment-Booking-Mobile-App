const express = require('express');
const controller = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/me', protect, controller.getMe);
router.put('/me', protect, controller.updateMe);

module.exports = router;