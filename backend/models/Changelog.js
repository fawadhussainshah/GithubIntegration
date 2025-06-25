const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('ChangeLog', OrganizationSchema, 'github_change_log');
