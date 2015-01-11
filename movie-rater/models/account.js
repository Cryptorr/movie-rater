//Imgur image schema

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AccountSchema   = new Schema({
  ID: String,
    name: String,
  pass: String,
  });

module.exports = mongoose.model('Account', AccountSchema);