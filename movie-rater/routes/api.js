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
var Account = require('../models/account');

// Save Account into Mongoose
router.route('/make_account')
  //create account wanted
  .post(function(req, res) {
    Account.findOne({name: req.body.name}, function(err, account){
      if(account === null){
        var account = new Account(req.body);

        account.save(function(err) {
        if (err)
          return res.send(err);

        res.send({ message: 'Account made!', data: account });
      });
      }else{
        res.json({mssage: "Account already exists!"});
      }
    });
  })
  //Get all movies from db
  .get(function(req, res) {
    Account.find(function(err, accounts) {
      if (err)
        return res.send(err);

      res.json(accounts);
    });
  });

router.route('/login')
  .post(function(req, res){
    Account.findOne({name: req.body.name},function(err, account){

      if(err){
        return res.send(err);
      }

      if(account === null){
        res.json({message: "Username does not exist"});
      }else{
        if(req.body.pass === account.pass){
          req.session.user = account._id;
          res.json({message: 'Logged in!'});
        }else{
          res.json({message: 'Incorrect password'});
        }
      }
    });
  });


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
  //Get all movies from db
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
    Movie.findOne({DBid: req.body.id}, function(err, movie){
      if(err){
        return res.send(err);
      }
      if(movie == null){
        var movie = new Movie();
        movie.DBid = req.body.id;
        movie.title = req.body.title;
        movie.poster = req.body.poster;
        movie.genres = JSON.parse(req.body.genres);
        movie.rating = 0;
        movie.votes = 0;

        movie.save(function(err){
          if(err){
            res.json({ message: err });
          }

          //res.json({ message: 'Movie added to DB'});

        });
      }
      console.log(req.session);
      Account.findOne({_id: req.session.user}, function(err, account){
        if(err){
          return res.send(err);
        }
        var name = "Anon"
        if(account){
          name = account.name;
          console.log(account.name);
        }
        var comment = new Comment();
        comment.movie_id = req.body.id;
        comment.user = name;
        comment.content = req.body.content;

        comment.save(function(err){
          if(err){
            return res.send(err);
          }

          res.json({ message: 'Comment Added', data: comment });
        });
      });
    });
  })
  .get(function(req, res) {
    Comment.find(function(err, comments) {
      if (err)
        return res.send(err);

      res.json(comments);
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

router.route('/rate/:id')
  .get(function(req,res){
    Movie.findOne({ DBid: req.params.id}, function(err, movie) {
      if (err) {
        return res.send(err);
      }
      res.json({rating : movie.rating});
    });
   });

router.route('/rate')
  .post(function(req, res){
    Movie.findOne({DBid: req.body.id}, function(err, movie){
      if(err){
        return res.send(err);
      }


      if(!req.body.val){
        return res.json({message: 'No value specified'});
      }
      var vote = req.body.val;
      vote = Math.min(vote, 5);
      vote = Math.max(vote, 0);


      if(movie !== null){
        movie.rating = ((movie.votes * movie.rating) + vote)/(movie.votes + 1);
        movie.votes += 1;

        movie.save(function(err){
          if(err){
            res.json({ message: err });
          }
        res.json({message: 'Voting correct'});

        })
      }else{
        var movie = new Movie();
        movie.DBid = req.body.id;
        movie.title = req.body.title;
        movie.poster = req.body.poster;
        movie.genres = JSON.parse(req.body.genres);
        movie.rating = vote;
        movie.votes = 1;

        movie.save(function(err){
          if(err){
            res.json({ message: err });
          }

          res.json({ message: 'Movie added to DB'});

        });
      }

    });
  });

router.route('/toprated')
  .get(function(req, res){
    Movie.find({}, function(err, movies){
      if(err){
        return res.send(err);
      }

      movies.sort(function(a,b){
        if(a.rating === undefined){
          return 1;
        }
        if(b.rating === undefined){
          return -1;
        }
        return b.rating - a.rating;
      });

      return res.json(movies.slice(0, 10));

    });
  });

router.route('/toprated/:genre')
  .get(function(req, res){
    Movie.find({genres: req.params.genre}, function(err, movies){
      if(err){
        return res.send(err);
      }

      movies.sort(function(a,b){
        if(a.rating === undefined){
          return -1;
        }
        if(b.rating === undefined){
          return 1;
        }
        return a.rating - b.rating;
      });

      return res.json(movies.slice(10));

    });
  });

// Api home page
router.get('/', function(req, res) {
    res.render('api', { title: 'Movie Rater App API' });
});

module.exports = router;
