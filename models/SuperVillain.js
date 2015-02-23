'use strict';

var mongoose = require('mongoose');

var villainSchema = new mongoose.Schema({
  realName: {type: String, default: 'Unknown'},
  superName: String,
  publisher: String
});

module.exports = mongoose.model('SuperVillain', villainSchema);