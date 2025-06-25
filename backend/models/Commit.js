const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('Commit', OrganizationSchema, 'github_commit');
