var express = require('express');
var router = express.Router();

router
  .get('/', function(req, res) {
    res.render('home.ejs', { title: "Home" });
  })
  .get('/login', function(req, res) {
    res.render('login.ejs', { title: "Welcome" });
  })
  .get('/uploads', function(req, res) {
    res.render('uploads.ejs', { title: "Uploads" });
  })
  .get('/forum', function(req, res) {
    res.render('forum.ejs', {title: "Feedback" });
  })
  .get('/stat', function(req, res) {
    res.render('stat.ejs', {title: "Statistics" });
  })




module.exports = router;
