var express = require('express');
var router = express.Router();

var querystring = require('querystring');
var https = require('https');

var mongoose = require('mongoose');
//Setup db
var uristring = 'mongodb://admin:V04L1jx6yl2nXIKreaKg@ds029541.mongolab.com:29541/movierater'; //DB url
//Connect to db
mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});
//Get models
var Movie = require('../models/movie');
var Comment = require('../models/comment');

// Restricted api:
router.route('/movies')
  //Create new movie
  .post(function(req, res) {
    var movie = new Movie(req.body);

    movie.save(function(err) {
    if (err)
      return res.send(err);

    res.send({ message: 'Movie Added', data: movie });
    });
  })
  //Get all images from db
  .get(function(req, res) {
    Movie.find(function(err, movies) {
      if (err)
        return res.send(err);

      res.json(movies);
    });
  });

router.route('/movies/:id')
  //Get movie by id
  .get(function(req, res) {
    Movie.findOne({ _id: req.params.id}, function(err, movie) {
      if (err) {
        return res.send(err);
      }

      res.json(movie);
    });
  })
  .delete(function(req, res) {
    Movie.remove({ _id: req.params.id}, function(err, movie) {
      if (err) {

        return res.send(err);
      }

      res.json({ message: 'Successfully deleted' });
    });
  })
  //Update movie
  .put(function(req,res){
    Movie.findOne({ _id: req.params.id }, function(err, movie) {
      if (err) {
        return res.send(err);
      }
      console.log(req.body);

      for (prop in req.body) {
        movie[prop] = req.body[prop];
      }

      // save the movie
      movie.save(function(err) {
        if (err) {
          return res.send(err);
        }

        res.json({ message: 'Movies updated!' });
      });
    });
  });

router.route('/comment')
  .post(function(req, res){
    var comment = new Comment(req.body);

    comment.save(function(err){
      if(err){
        return res.send(err);
      }

      res.send({ message: 'Comment Added', data: comment });
    });
  });

router.route('/comment/:id')
  .get(function(req, res){
    Comment.find({movie_id: req.params.id}, function(err, comments){
      if(err) {
        return res.send(err);
      }

      res.json(comments);

    });
  });

// Api home page
router.get('/', function(req, res) {
    res.render('api', { title: 'Movie Rater App API' });
});

module.exports = router;
