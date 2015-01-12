//Imgur image schema

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MovieSchema   = new Schema({
  DBid: String,
	title: String,
  poster: String,
  genres: [{id:String, name:String}],
  rating: Number,
  votes: Number
  });

module.exports = mongoose.model('Movie', MovieSchema);
