const express = require('express');
const router = express.Router();

const artController = require('../controllers/arts');
const authentications = require('../controllers/authentications');

router.route('/register')
  .post(authentications.register);

router.route('/login')
  .post(authentications.login);

router.route('/art')
  .get(artController.index);

module.exports = router;
