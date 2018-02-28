var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

mongoose.connect('mongodb://prase:prase@ds151348.mlab.com:51348/nightlife-app')

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  bar_id: {
    type: String,
    created_at: { type: Date, default: Date.now }
  }
});

/**
 * hashing a password before saving it to the database
 */
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

/**
 * registers a new user
 * @param  {Request} req request containing all user inputted data
 */
UserSchema.statics.register = function (req, callback) {

  // create a new database-inputtable object
  var userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }

  var User = this
  // check if user credentials already exist
  User.findOne({ $or: [{'name': req.body.name}, {'email': req.body.email}] }).exec(function (err, user) {
    if (err) return callback(err)
    else if (user) {
      var err = new Error('user already exists');
      err.status = 401;
      return callback(err);
    }
    // use schema.create to insert data into the db
    else {
      User.create(userData, function (err, user) {
        if (err) {
          callback(err)
        }
        else {
          req.session.cookie.expires = new Date(Date.now() + 3600000 * 24)
          req.session.auth = true;
          req.session.user = user;
          callback(null, user);
        }
      });
    }
  });

}

/**
 * authenticate input against database
 */
UserSchema.statics.login = function (email, password, callback) {
  this.findOne({ email: email }).exec(function (err, user) {
    if (err) return callback(err)
    if (!user) return callback("User credentials not found")
    bcrypt.compare(password, user.password, function (err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback()
      }
    })
  });
}

/**
 * logout session user
 */
UserSchema.statics.logout = function (req) {
  delete req.session.auth;
  delete req.session.user;
  delete req.session.searchedTerm;
}

module.exports = mongoose.model('User', UserSchema);
