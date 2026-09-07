const express = require('express');
const controller = require('../controllers/favoriteController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.get('/', controller.list);
router.post('/', controller.add);
router.delete('/:professionalId', controller.remove);

module.exports = router