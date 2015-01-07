var express = require('express');
var router = express.Router();

//Get homepage
router.get('/', function(req, res) {
  res.render('index', { title: 'Movie Rater App' });
});

//Get browse page
router.get('/browse', function(req, res) {
  res.render('browse', { title: 'Movie Rater App - Browse' });
});

//Get report page
router.get('/report', function(req, res) {
  res.render('report', { title: 'Movie Rater App - Report' });
});

module.exports = router;
