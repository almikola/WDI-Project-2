const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const expressJWT = require('express-jwt');
const routes = require('./config/routes');
const apiRoutes = require('./config/apiRoutes');
const bodyParser = require('body-parser');

const config = require('./config/config');

mongoose.connect(config.db);

app.use(express.static(`${__dirname}/public`));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', expressJWT({ secret: config.secret })
  .unless({
    path: [
      { url: '/api/register', methods: ['POST'] },
      { url: '/api/login', methods: ['POST'] }
    ]
  }));
app.use(jwtErrorHandler);

function jwtErrorHandler(err, req, res, next) {
  if (err.name !== 'UnauthorizedError') return next();
  return res.status(401).json({ message: 'Unauthorized request.' });
}

app.use('/', routes);
app.use('/api', apiRoutes);

app.listen(config.port, console.log(`Server has started on port: ${config.port}`));
