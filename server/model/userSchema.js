var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var User = new Schema({
    firstname    :String,
    lastname     : String,
    email  : {type:String,unique:true},
    country     : String,
    password : String
});

module.exports=mongoose.model('user',User,'user');

