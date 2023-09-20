const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const router = require('./router');
const keys = require('./config/keys');

// connect to db
mongoose.connect(keys.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// set up server
const app = express();

app.use(
  cookieSession({
    name: 'session',
    keys: keys.COOKIE_SECRET,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);

app.use(passport.initialize());
app.use(passport.session());

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
