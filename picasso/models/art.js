const mongoose = require('mongoose');

const artSchema = mongoose.Schema({
  name: String,
  lat: String,
  lng: String
});

module.exports = mongoose.model('Art', artSchema);
