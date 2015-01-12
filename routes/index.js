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

var APIKEY = 'a283f3647d2484cd1b3dad05152d7766';

function movieDB(data, endpoint, cb){

	var host = 'api.themoviedb.org';
	var endpoint = endpoint;
	endpoint += '?api_key=' + APIKEY;
	endpoint += '&' + querystring.stringify(data);

	var options = {
		host: host,
		path: endpoint,
		method: 'get'
	};

	var req = https.get(options, function(res) {
		res.setEncoding('utf-8');

		var responseString = '';

		res.on('data', function(data) {
		  responseString += data;
		});

		res.on('end', function() {
		  //console.log(responseString);
		  var responseObject = JSON.parse(responseString);
		  cb(responseObject);
		});

		res.on('error', function(e){
			console.log('problem with request: ' + e.message);
		});
	});
}

//Get homepage
router.get('/', function(req, res) {
	Account.findOne({_id: req.session.user}, function(err, account){
		if(err){
			return res.send(err);
		}
		var name = "Anon"
		if(account){
			name = account.name;
		}
		res.render('index', { title: 'Movie Rater App', name: name });
	});
});

//Get browse page
router.get('/browse', function(req, res) {
	Account.findOne({_id: req.session.user}, function(err, account){
		if(err){
			return res.send(err);
		}
		var name = "Anon"
		if(account){
			name = account.name;
		}
		res.render('browse', { title: 'Movie Rater App - Browse', name: name });
	});
});

router.route('/browse')
  .post(function(req, res){
  	movieDB(req.body, '/3/search/movie', function(data){
  		return res.json(data);
  	});
});

//Get register page
router.get('/register', function(req, res) {
	Account.findOne({_id: req.session.user}, function(err, account){
		if(err){
			return res.send(err);
		}
		var name = "Anon"
		if(account){
			name = account.name;
		}
		res.render('register', { title: 'Movie Rater App - Register', name: name });
	});
});

//Get movie page
router.get('/movie/:id', function(req, res) {
	Account.findOne({_id: req.session.user}, function(err, account){
		if(err){
			return res.send(err);
		}
		var name = "Anon"
		var rating = 0;
		if(account){
			name = account.name;
			for(var i=0; i<account.ratings.length; i++){
				if(account.ratings[i].DBid == req.params.id){
					rating = account.ratings[i].rating;
				}
			}
		}
		Movie.findOne({DBid: req.params.id}, function(err, movie){
			if(err){
				return res.send(err);
			}
			var average;
			if(movie && movie.votes > 0){
				average = movie.rating;
			}
			movieDB(req.body, '/3/movie/' + req.params.id, function(data){
				res.render('movie', { title: 'Movie Rater App - ' + data.title, name: name, rating: rating, average: average, data: data});
			});
		});
	});
});

//Get report page
router.get('/report', function(req, res) {
	Account.findOne({_id: req.session.user}, function(err, account){
		if(err){
			return res.send(err);
		}
		var name = "Anon"
		if(account){
			name = account.name;
		}
		res.render('report', { title: 'Movie Rater App - Report', name: name});
	});
});

module.exports = router;
