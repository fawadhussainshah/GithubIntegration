const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('Organization', OrganizationSchema, 'github_organizations');
