const express = require('express');
const router = express.Router();

const staticsController = require('../controllers/statics');
const artController = require('../controllers/arts');
const authentications = require('../controllers/authenticastions');

router.route('/register')
  .post(authentications.register);

router.route('/login')
  .post(authentications.login);


router.route('/')
  .get(staticsController.home);

router.route('/art')
  .get(artController.index);

module.exports = router;
