const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('Issue', OrganizationSchema, 'github_issue');
