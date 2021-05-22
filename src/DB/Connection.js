const mongoose = require('mongoose');
require("dotenv").config();
const URI = process.env.URI;

const connectDB = async () => {
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  console.log('db connected..!');
};

module.exports = connectDB;






// const { MongoClient } = require("mongodb");
// require("dotenv").config();
// const URI = process.env.URI;
// const client = new MongoClient(URI);

// const connectDB = async ()=>{
//   try {
//     await client.connect();
//     console.log("Connected successful!");
//   } catch (err) {
//       console.log(err.stack);
//   }
//   finally {
//       await client.close();
//   }
// }
// module.exports =  connectDB;
