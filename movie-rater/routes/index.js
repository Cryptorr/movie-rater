var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var http = require('http');

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

	var req = http.get(options, function(res) {
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
  res.render('index', { title: 'Movie Rater App' });
});

//Get browse page
router.get('/browse', function(req, res) {
  res.render('browse', { title: 'Movie Rater App - Browse' });
});

router.route('/browse')
  .post(function(req, res){
  	movieDB(req.body, '/3/search/movie', function(data){
  		return res.json(data);
  	});
});

//Get movie page
router.get('/movie/:id', function(req, res) {
	movieDB(req.body, '/3/movie/' + req.params.id, function(data){
		console.log(data);
		res.render('movie', { title: 'Movie Rater App - ' + data.title, data: data,  });
	});
});


//Get report page
router.get('/report', function(req, res) {
  res.render('report', { title: 'Movie Rater App - Report' });
});

module.exports = router;
