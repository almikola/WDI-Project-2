const mongoose = require('mongoose');

const stolenArtSchema = new mongoose.Schema({
  headline: { type: String, trim: true },
  artStolen: { type: String, trim: true },
  location: { type: String },
  year: { type: String },
  worth: { type: String },
  description: {type: String}
});

module.exports = mongoose.model('StolenArt', stolenArtSchema);
