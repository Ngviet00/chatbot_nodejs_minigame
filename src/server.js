require('dotenv').config();
import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import bodyParser from "body-parser";
const connectDB = require('./DB/Connection');

let app = express();

//config body-parser to post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use( express.static( "public" ) );

//config view engine
configViewEngine(app);

//config web routes
initWebRoutes(app);

let port = process.env.PORT || 8080;

connectDB();

app.listen(port, () => {
    console.log(`Messenger bot is running at the port ${port}`);
});
