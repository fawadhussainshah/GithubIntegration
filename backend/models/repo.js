const mongoose = require('mongoose');

const RepoSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('Repo', RepoSchema, 'github_repos');
