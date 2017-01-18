const mongoose = require('mongoose');

const stolenArtSchema = new mongoose.Schema({
  headline: { type: String, trim: true },
  artStolen: { type: String, trim: true },
  location: { type: String, trim: true },
  year: { type: String, trim: true },
  worth: { type: String, trim: true },
  description: { type: String, trim: true },
  image: { type: String, trim: true }
});

module.exports = mongoose.model('StolenArt', stolenArtSchema);
