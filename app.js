
const express = require("express")
const Router = require('./Router.js')
var cors = require('cors')

const app = express();
const port = 3001

var bodyParser = require('body-parser')
var multer = require('multer');
var upload = multer();

app.use(bodyParser.json());   
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array()); 

const corsConf = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
}
  
app.use(cors(corsConf));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

app.use('/v1', Router());
