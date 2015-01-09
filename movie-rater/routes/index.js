var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var https = require('https');

var APIKEY = 'a283f3647d2484cd1b3dad05152d7766';

function movieDB(data, cb){

	var host = 'https://api.themoviedb.org';
	var endpoint = '/3/genre/movie/list';
	endpoint += '?api_key=' + APIKEY;
	endpoint += '&' + querystring.stringify(data);


	var options = {
	host: host,
	path: endpoint,
	method: 'GET'
	};

	var req = https.request(options, function(res) {
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
	});
}

//Get homepage
router.get('/', function(req, res) {
  res.render('index', { title: 'Movie Rater App' });
});

//Get browse page
router.get('/browse', function(req, res) {
  res.render('browse', { title: 'Movie Rater App - Browse' });
});

router.route('/browse')
  .post(function(req, res){
  	movieDB(req.body, function(res){
  		console.log(res);
  	});
});

//Get report page
router.get('/report', function(req, res) {
  res.render('report', { title: 'Movie Rater App - Report' });
});

module.exports = router;
