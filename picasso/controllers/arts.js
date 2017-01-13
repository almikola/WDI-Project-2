const StolenArt = require('../models/stolen-art');

function artsIndex(req, res){
  StolenArt.find((err, arts) => {
    if (err) return res.status(500).send();
    console.log(arts.length);
    return res.status(200).json({ arts: arts });
  });
}

module.exports = {
  index: artsIndex
};
