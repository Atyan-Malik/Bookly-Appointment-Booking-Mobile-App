const express = require('express');
const controller = require('../controllers/notificationController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.get('/', controller.list);
router.patch('/:id/read', controller.markRead);

module.exports = router;