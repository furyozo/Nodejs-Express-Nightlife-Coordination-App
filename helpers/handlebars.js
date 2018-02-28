var User = require('../models/User.js')

module.exports = {
  getUserCount: function (bar_id) {
    var count = User.count({ bar_id: bar_id }).exec();
    console.log(count);
    return count;
  },
  ifCond: function(v1, v2, options) {
    if (v1 == v2)
      return options.fn(this);
    return options.inverse(this);
  }
}
