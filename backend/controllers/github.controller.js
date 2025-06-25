const Integration = require('../models/Integration');
const { syncGitHubData } = require('./github.data.controller');

exports.githubCallback = async (req, res) => {
  try {
    const { accessToken, profile } = req.user;
    await Integration.findOneAndUpdate(
      { githubId: profile.id },
      {
        githubId: profile.id,
        username: profile.username,
        accessToken,
        connectedAt: new Date()
      },
      { upsert: true }
    );
    res.redirect('http://localhost:4200');
    // syncGitHubData(); // Can be triggered by scheduler or CLI

  } catch (err) {
    res.status(500).json({ error: 'Callback error' });
  }
};

exports.getStatus = async (req, res) => {
  try {
    const record = await Integration.findOne({});
    if (record) {
      res.json({ connected: true, date: record.connectedAt, _id: record._id, username: record.username, githubId: record.githubId });
    } else {
      res.json({ connected: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Status check failed' });
  }
};


exports.removeIntegration = async (req, res) => {
  try {
    await Integration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Integration removed' });
  } catch (err) {
    res.status(500).json({ error: 'Remove failed' });
  }
};

