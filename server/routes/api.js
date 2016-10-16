var API = require('../API/apiImplementation.js');

var passport = require ('passport');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = 'secretKey';
opts.issuer = "ash@gmail.com";
opts.audience = "localhost";
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwt_payload.toString());
    USER.findOne({email:'aj@gmail.com'},function(err,user){
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
            // or you could create a new account 
        }
    });
}));

module.exports = function (app) {
  app.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
  });

  app.get('/test', API.test);
  app.get('/getData' , API.getData);
  app.get('/pvtdata' , passport.authenticate('jwt', { session: false}),function(req,res){
  	console.log('aaa');
  	res.send('pvt data');
  });
  app.post('/login', API.login);
  app.post('/addnewusr',API.addnewusr);
  app.post('/loginusr',API.loginusr);
}
