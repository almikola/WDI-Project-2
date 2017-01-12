const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const expressJWT = require('express-jwt');
const routes = require('./config/routes');
const port = process.env.PORT || 3000;

const config = require('./config/config');
const databaseURL = process.env.MONGOLAB_URL || 'mongodb://localhost:27017/art-thiefs';

mongoose.connect(databaseURL);

app.use(express.static(`${__dirname}/public`));
app.use(cors());
app.use('/', routes);

app.use('/api', expressJWT({ secret: config.secret })
  .unelss({
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

app.listen(port, console.log(`Server has started on port: ${port}`));
