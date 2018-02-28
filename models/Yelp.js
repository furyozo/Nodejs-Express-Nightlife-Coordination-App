const yelp = require('yelp-fusion');
var session = require('express-session')

var User = require('./User.js')

module.exports = class Yelp {

  // get all bars in users area
  static getYelp(location, callback) {
    const client = yelp.client(
      'CDxbFqsN_yC806Yt7wYvIXYuqOofri-QZSaqUS0XWNOHjJJb9fIpNKLNmLNUWxNIezDO5srxO7aEywM8YLl4xdgGNvxKbXqY1aIItVMr3H_dhmVrYIsFAjXj8PqTWnYx'
    )
    client.search({
      term: 'bar',
      location: location
    }).then(response => {
      // save the session only if there is a yelp entry for the searched term
      if (response.jsonBody.businesses > 0) {
        req.session.searchedTerm = req.body.text;
      }
      // add count of users that are visiting the bar tonight
      var yelps = response.jsonBody.businesses;
      Yelp.SetYelps(yelps, 0, function() {
        // return by callback
        callback(null, yelps)
      })
    }).catch(e => {
      callback(e)
    });
  }

  static SetYelps(yelps, i, callback) {
    User.count({ bar_id: yelps[i].id }, function(err, count) {
      if (err) {
        console.error(err);
      } else {
        yelps[i].user_count = count;
      }
      // if (req.session.user.bar_id = yelps[i].id) {
      //   yelps[i].present = true;
      // } else {
      //   yelps[i].present = false;
      // }
      if (yelps[i+1]) {
        Yelp.SetYelps(yelps, i+1, callback);
      } else {
        callback();
      }
    });
  }

}
