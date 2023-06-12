import TourneyFunc from 'components/tourneyfunc.js'


module.exports = async function (req, res) {
  return res.status(401).json({ error: 'Unauthorized' });
};
