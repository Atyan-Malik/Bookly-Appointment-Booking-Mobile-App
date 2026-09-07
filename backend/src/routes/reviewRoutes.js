const express = require('express');
const controller = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/professional/:professionalId', controller.listForProfessional);
router.post('/', protect, controller.create);

module.exports = router;

