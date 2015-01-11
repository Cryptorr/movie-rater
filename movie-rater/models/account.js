//Imgur image schema

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AccountSchema   = new Schema({
  ID: String,
  name: String,
  pass: String,
  ratings: [{movie_id:Number}]
  });

module.exports = mongoose.model('Account', AccountSchema);
