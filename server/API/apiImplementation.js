var USER = require('../model/userSchema');
var jwt = require('jsonwebtoken');
var SECRET = 'server secret';
var TOKENTIME = 30 * 60;

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
        }
        else {
            res.status(200).send({success:true,msg:'Hi ,'+data.firstname+' Congratulation , now you can login '});
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