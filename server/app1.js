// start with node authentication/refreshTokenScenario.js
'use strict';

///////////////////
// configuration //
///////////////////
const PORT = 3000; // i know, its old...
const SECRET = 'server secret';
const TOKENTIME = 1 * 60; // in seconds

/////////////
// modules //
/////////////
const bodyParser = require('body-parser');
const express = require('express');
const expressJwt = require('express-jwt');
const http = require('http');
const jwt = require('jsonwebtoken');
const logger = require('morgan');
const passport = require('passport');
const Strategy = require('passport-local');

const app = express();
const authenticate = expressJwt({
  secret: SECRET
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept ,Authorization");
  next();
});


////////////////////
// database dummy //
////////////////////
const db = {
  updateOrCreate: function(user, cb) {
    // db dummy, we just cb the user
    cb(null, user);
  },
  authenticate: function(username, password, cb) {
    // database dummy - find user and verify password   
    if (true||username === 'devils name' && password === '666') {
      cb(null, {id: 666, firstname: 'devils',    lastname: 'name',    email: 'devil@he.ll',    verified: true      });
    } else {
      cb(null, false);
    }
  }
};

//////////////
// passport //
//////////////
passport.use(new Strategy(
  function(username, password, done) {
    db.authenticate(username, password, done);
  }
));

////////////
// server //
////////////
app.use(logger('dev'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.status(200).json({
    hello: 'world'
  });
});

app.post('/loginusr', passport.initialize(), passport.authenticate('local', { session: false,scope: []}), serialize, generateToken, respond);


app.get('/pvtdata', authenticate, function(req, res) {
  res.status(200).json({id:23454});
});

http.createServer(app).listen(PORT, function() {
  console.log('server listening on port ', PORT);
});

////////////
// helper //
////////////
function serialize(req, res, next) {
  db.updateOrCreate(req.user, function(err, user) {
    if (err) {
      return next(err);
    }
    // we store information needed in token in req.user again
    req.user = {
      id: user.id||100
    };
    next();
  });
}

function generateToken(req, res, next) {
  req.token = jwt.sign({
    id: req.user.id,
  }, SECRET, {
    expiresIn: TOKENTIME
  });
  next();
}

function respond(req, res) {
  res.status(200).json({
    user: req.user,
    auth_token: req.token
  });
}