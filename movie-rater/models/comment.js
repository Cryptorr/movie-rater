//Comment Schema

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CommentSchema = new Schema({
  user: String,
  content: String,
  movie_id: String
  });

module.exports = mongoose.model('Comment', CommentSchema);
