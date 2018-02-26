const yelp = require('yelp-fusion');

module.exports = class Yelp {

  // get all bars in users area
  static getYelp(callback) {
    const client = yelp.client('CDxbFqsN_yC806Yt7wYvIXYuqOofri-QZSaqUS0XWNOHjJJb9fIpNKLNmLNUWxNIezDO5srxO7aEywM8YLl4xdgGNvxKbXqY1aIItVMr3H_dhmVrYIsFAjXj8PqTWnYx')
    client.search({
      term: 'Four Barrel Coffee',
      location: 'san francisco, ca'
    }).then(response => {
      callback(null, response.jsonBody.businesses)
    }).catch(e => {
      callback(e)
    });
  }

}
