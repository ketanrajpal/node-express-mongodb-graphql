const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
  name: String,
  verified: Boolean,
  user: String
});

module.exports = mongoose.model('Domain', domainSchema);
