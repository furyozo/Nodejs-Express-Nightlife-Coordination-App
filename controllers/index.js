var express = require('express');
var router = express.Router();

var Yelp = require('../models/Yelp.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  Yelp.getYelp(function(err, yelps) {
    console.log(yelps)
    res.render('index', { yelps: yelps });
  })
});

module.exports = router;
