var express = require('express');
var router = express.Router();

router
  .get('/', function(req, res) {
    res.render('home.ejs', { title: "Home" });
  })
  .get('/uploads', function(req, res) {
    res.render('uploads.ejs', { title: "Uploads" });
  })

module.exports = router;
