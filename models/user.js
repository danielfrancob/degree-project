var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username:{type:String,"unique":true},
    name:String,
    lastname:String,
    role:String
});

User.pre('save',function(next){
    this.name = this.name.toUpperCase();
    this.lastname = this.lastname.toUpperCase();
    next();
});

var options = {
    usernameLowerCase:true
}

User.plugin(passportLocalMongoose,options);

User.statics.create = function(data,callback){
    var password = data.password;
    delete data.password;
    
    this.register(data,password,function(err,user){
        callback(err,user);
    });
}

User.statics.verifyUser = function(username,callback){
    this.findOne({username:username},function(err,user){
        callback(err,user);
    });
}   

User.statics.changePassword = function(id,password,callback){
    this.findById(id,function(err,user){
        if(err){
            callback(err);
        }else{
            user.setPassword(password,function(err){
                if(err){
                    callback(err);
                }else{
                    user.save(callback);
                }
            });
        }
    });
}

User.statics.resetPassword = function(username,password,callback){
    this.findOne({username:username},function(err,user){
        if(err){
            callback(err);
        }else{
            user.setPassword(password,function(err){
                if(err){
                    callback(err);
                }else{
                    user.save(callback);
                }
            });
        }
    });
}

module.exports = mongoose.model('User',User,'User');