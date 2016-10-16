var uuid = require('uuid');
var nJwt = require('njwt');
var secretKey = uuid.v4();
var Cookies = require('cookies');
var USER = require('../model/userSchema');


exports.test = function (req, res) {
    res.json({ apiToken: 'SECREATEKEY' });
}

exports.login = function (req, res) {   
    if (typeof req.body.username != "undefined" && typeof req.body.password != "undefined") {
        if (req.body.username == 'admin' && req.body.password == 'admin') {
            
            var claims = {
                iss: "http://localhost:4200/",  // The URL of your service 
                sub: "users/user1234",    // The UID of the user in your system 
                scope: "self, admins"
            }
            var jwt = nJwt.create(claims, secretKey);
            var token=jwt.compact();
            new Cookies(req, res).set('access_token', token, {
                httpOnly: true,
                secure: false      // for your production environment set true
            });  
            req.session.token=token;
            console.log(req.session);      
            res.status(200).send({ msg: "login successfully", token: token });
        } else {
            res.status(400).send("no valid credentials...");
        }
    } else
        res.status(401).send("no data send...");
}  

exports.getData=function(req,res){
    console.log(req.session);    
    // var token = new Cookies(req,res).get('access_token');
    //console.log(token);
    res.status(200).send('req.session');
} 
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
    USER.findOne({email:req.body.username,password:req.body.password},function(err,usr){
        if(err) {
            res.send({success:false,msg:'Login fail'})
            return;
        }
        else if(!usr){
            res.send({success:false,msg:'Please enter valid credentials'})  
            return;
        }else{ 
            var claims = usr;
            var jwt = nJwt.create(claims, 'secretKey');
            console.log()
            var token=jwt.compact();
            new Cookies(req, res).set('access_token', token, {
                httpOnly: true,
                secure: false      // for your production environment set true
            }); 
            res.send({success:true,msg:'successfully login',auth_token:token})
        }
    })
}
