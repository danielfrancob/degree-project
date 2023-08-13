var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate')(mongoose);

var Question = new Schema({
    name:String,
    type:String,
    statement:String,
    attachment:{type:Schema.Types.ObjectId,ref:'Gallery'},
    questions:[{type:Schema.Types.ObjectId,ref:'Question'}],
    body:Object,
    owner:{type:Schema.Types.ObjectId,ref:'User'},
    status:{type:String,default:'available'}
});

Question.plugin(deepPopulate);

Question.statics.create = function(data,user,callback){
    var new_question = new this(data);
    new_question.owner = user;

    new_question.save(function(err,saved){
        callback(err,saved);
    });
}

Question.statics.update = function(data,callback){
    this.findByIdAndUpdate(data._id,{$set:data},function(err){
        callback(err);
    });
}

Question.statics.delete = function(id,callback){
    this.findById(id,function(err,question){
        if(err){
            callback(err);
        }else{
            question.status = 'deleted';
            question.save(callback);
        }
    });
}

Question.statics.getUserBank = function(user,callback){
    this.find({owner:user,status:'available'},{'name':1,'type':1,'questions':1})
    .populate('questions','name type')
    .exec(function(err,data){
        callback(err,data);
    });
}

Question.statics.getQuestion = function(id,callback){
    this.findById(id,{'name':1,'type':1,'statement':1,'attachment':1,'questions':1,'body':1})
    .populate('attachment')
    .populate('questions')
    .exec(function(err,data){
        callback(err,data);
    });
}

module.exports = mongoose.model('Question',Question,'Question');