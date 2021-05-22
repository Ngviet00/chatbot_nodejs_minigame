const mongoose = require('mongoose');

var user = new mongoose.Schema({
  psid: {
    type: String
  },
  name: {
    type: String
  },
  number: {
    type: String
  },
  email: {
    type: String
  },
  txtDate: {
    type: String
  },
  major: {
    type: String
  },
  address: {
    type: String
  },
  prize: {
    type: String
  }
});
module.exports = mongoose.model('user', user);
