const express = require('express');
const router = express.Router();
const collectorController = require('../controllers/collectorController');

router.get('/', collectorController.getAllCollectors);
router.post('/', collectorController.createCollector);

module.exports = router;