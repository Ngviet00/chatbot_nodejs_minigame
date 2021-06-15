const express = require('express');
const mongoose = require('mongoose');
const User = require('../DB/User');
const route = express.Router();

route.post('/', async (req, res) => {
   const { name, number, email, txtDate, major, address } = req.body;
   let user = {};
   user.name = name;
   user.number = number;
   user.email = email;
   user.txtDate = txtDate;
   user.major = major;
   user.address = address;
   user.prize = "";
   let userModel = new User(user);
   await userModel.save();
   res.json(userModel);
});

module.exports = route;
