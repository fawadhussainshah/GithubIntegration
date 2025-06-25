const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('PullRequest', OrganizationSchema, 'github_pull_request');
