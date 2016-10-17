var USER = require('../model/userSchema');
var jwt = require('jsonwebtoken');
var SECRET = 'server secret';
var TOKENTIME = 60 * 60;


var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

passport.use(new Strategy({
    clientID:'370960789960977',
    clientSecret:'e12daa5e8407332c09848499c8d54edc',
    callbackURL: 'http://localhost:3000/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


exports.addnewusr=function(req,res){

    var user = new USER({
        firstname    :req.body.fname,
        lastname     : req.body.lname,
        email  : req.body.email,
        country     : req.body.country,
        password : req.body.password
    });

    user.save(function (err,data){
        if (err) {
            if(err.code==11000){
                res.status(200).send({success:false,msg:'Oops! ,this data is already exists in database'});
                return;
            }            
            res.status(200).send({success:false,msg:'Somthing went wrong please try again'});
            return;
        }
        else {
            res.status(200).send({success:true,msg:'Hi ,'+data.firstname+' Congratulation , now you can login '});
            return;
        }
    })
	
}

exports.loginusr=function(req,res){

  req.token = jwt.sign({
    id: req.user.id,    
  }, SECRET, {
    expiresIn: TOKENTIME
  });
   res.status(200).send({ user: req.user, auth_token: req.token});
}

exports.profile=function(req,res){
    var decoded = jwt.decode(req.headers.authorization.split(' ')[1], SECRET);
    if(decoded.id){
        USER.findById(decoded.id,function(err,usr){
            res.send(usr);
        });
    }
}   

exports.fbLogin=function(req,res){
    
    passport.authenticate('facebook');
}