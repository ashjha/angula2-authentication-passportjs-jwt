var express = require('express');
var path = require('path'); //remove on final
var logger = require('morgan');//remove on final
var bodyParser = require('body-parser');

var USER = require('./model/userSchema');
var mongoose = require('mongoose');


var SECRET = 'server secret';

var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var Strategy = require('passport-local');
var authenticate = expressJwt({
  secret: SECRET
});


mongoose.connect('mongodb://localhost/passport',function(err){
    if (err) throw err;
    else console.log('Mongo db connnected');
});


var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept ,Authorization");
  next();
});

passport.use(new Strategy(
  function(username, password, done) {
    authenticateCredentials(username, password, done);
  }
));

function authenticateCredentials(usr,psw,cb){
   USER.findOne({email:usr,password:psw},function(err,usr){
        if(err) {
            cb(null,false);
            return;
        }
        else if(!usr){
            cb(null,false);
            return;
        }else{            
            cb(null, {id: usr._id, firstname: usr.firstname,lastname:usr.lastname,email: usr.email,verified: true });
            return;
        }
    })
}

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.set('views', path.join(__dirname, 'views'));//remove on final
app.set('view engine', 'jade');//remove on final

app.use(logger('dev'));//remove on final
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));//remove on final

require('./routes/api')(app, passport , Strategy , authenticate);

app.listen(3000);
module.exports = app;
