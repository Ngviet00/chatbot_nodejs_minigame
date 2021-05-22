const mongoose = require('mongoose');

const user = new mongoose.Schema({
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

var User = mongoose.model('user', user);
module.exports = User;
