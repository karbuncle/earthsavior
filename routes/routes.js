var express = require('express');
var router = express.Router();

router
  .get('/', function(req, res) {
    res.render('login.ejs', { title: "Welcome", beta: false });
  })
  .get('/home', function(req, res) {
    res.render('home.ejs', { title: "Home", beta: false });
  })
  .get('/uploads', function(req, res) {
    res.render('uploads.ejs', { title: "Uploads", beta: false });
  })
  .get('/uploads/beta', function(req, res) {
    res.render('uploads.ejs', { title: "Uploads", beta: true });
  })
  .get('/forum', function(req, res) {
    res.render('forum.ejs', {title: "Feedback", beta: false });
  })
  .get('/stat', function(req, res) {
    res.render('stat.ejs', {title: "Statistics", beta: false });
  })




module.exports = router;
