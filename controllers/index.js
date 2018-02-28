var express = require('express');
var router = express.Router();
var session = require('express-session')

var User = require('../models/User.js')
var Yelp = require('../models/Yelp.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log(req.session.searchedTerm)
  if (req.session.searchedTerm) {
    Yelp.getYelp(req.session.searchedTerm, function(err, yelps) {
      if (err) console.error(err);
      console.log("tato zmrdovina: ")
      console.log(req.session.user)
      res.render('search', { user: req.session.user, yelps: yelps });
    })
  } else {
    res.render('index', { user: req.session.user });
  }
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('auth/register');
});

/* login a user */
router.post('/login', function(req, res, next) {
  User.login(req.body.email, req.body.password, function(err, user) {
    if (!req.body.email || !req.body.password)
      res.render('auth/login', {err: "some form data is missing"});
    else if (!user) {
      res.render('auth/login', {err: "the user credentials were not found"});
    }
    else if (user) {
      req.session.cookie.expires = new Date(Date.now() + 3600000 * 24)
      req.session.auth = true;
      req.session.user = user;
      res.redirect('/');
    }
  });
});

/* register a new user */
router.post('/register', function(req, res, next) {
  if (!req.body.name || !req.body.email || !req.body.password || !req.body.repassword)  // check whether all form data was inputted
    res.render('auth/register', {err: "some form data is missing"});
  else if (req.body.password != req.body.repassword)  // check whether the password and repeated password are matching
    res.render('auth/register', {err: "passwords are not matching"});
  else {
    User.register(req, function(err, user) {
      res.redirect('/');
    });
  }
});

/* GET /logout */
router.get('/logout', function(req, res, next) {
  User.logout(req);
  res.redirect('/');
});

/* search through bar loactions */
router.post('/search', function(req, res, next) {
  Yelp.getYelp(req.body.text, function(err, yelps) {
    req.session.searchedTerm = req.body.text;
    console.log(req.session.user)
    res.render('search', { user: req.session.user, yelps: yelps });
  })
})

/* tag a user for joining a specific bar in the night */
router.get('/join/:bar_id', function(req, res, next) {

  if (!req.session.user) {
    res.redirect('/login');
    return
  }

  User.findById(req.session.user._id, function (err, user) {
    user.bar_id = req.params.bar_id;
    user.save();
    req.session.user = user;
    res.redirect('/');
  });

})

/* tag a user for joining a specific bar in the night */
router.get('/leave/:bar_id', function(req, res, next) {

  if (!req.session.user) {
    res.redirect('/login');
    return
  }

  User.findById(req.session.user._id, function (err, user) {
    user.bar_id = '';
    user.save();
    req.session.user = user;
    res.redirect('/');
  });

})

module.exports = router;
