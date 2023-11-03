const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const router = require('./router');

// set up server
const app = express();

app.use(passport.initialize());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());
router(app);

const port = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);
