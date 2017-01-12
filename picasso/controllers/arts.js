const Art = require('../models/art');

function artsIndex(req, res){
  Art.find((err, arts) => {
    if (err) return res.status(500).send();
    return res.status(200).json({ arts: arts });
  });
}

module.exports = {
  index: artsIndex
};
