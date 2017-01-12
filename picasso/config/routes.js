const express = require('express');
const router = express.Router();

const staticsController = require('../controllers/statics');
const artController = require('../controllers/arts');

router.route('/')
  .get(staticsController.home);

router.route('/art')
  .get(artController.index);

module.exports = router;
