const express = require('express');
const router = express.Router();

const staticsController = require('../controllers/statics');
// const artController = require('../controllers/arts');
// const authentications = require('../controllers/authentications');

router.route('/')
  .get(staticsController.home);


module.exports = router;
