var API = require('../API/apiImplementation.js');


module.exports = function (app , passport , Strategy , authenticate) {
  app.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
  });

  app.post('/addnewusr',API.addnewusr);
  app.post('/loginusr', passport.initialize(), passport.authenticate('local', { session: false,scope: ['ashu']}), API.loginusr);
  app.get('/pvtdata', authenticate, API.profile);
  app.post('/fbLogin',API.fbLogin);  
  app.get('/fb',API.fbLogin);  
}