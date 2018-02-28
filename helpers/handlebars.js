var User = require('../models/User.js')

module.exports = {
  getUserCount: function (bar_id) {
    var count = User.count({ bar_id: bar_id }).exec();
    console.log(count);
    return count;
  },
  bar: function () { return 'BAR!'; }
}
