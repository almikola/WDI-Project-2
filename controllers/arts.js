const StolenArt = require('../models/stolen-art');

function artsIndex(req, res){
  StolenArt.find((err, arts) => {
    if (err) return res.status(500).send();
    return res.status(200).json({ arts: arts });
  });
}

function artsShow(req, res) {
  StolenArt.findById(req.params.id, (err, user) => {
    if (err) return res.status(500).json({ message: 'Something went wrong. '});
    if (!user) return res.status(404).json({ message: 'Art not found.' });
    return res.status(200).json({ user });
  });
}

module.exports = {
  index: artsIndex,
  show: artsShow
};
