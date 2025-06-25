const mongoose = require('mongoose');

const RepoSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('User', RepoSchema, 'github_users');
