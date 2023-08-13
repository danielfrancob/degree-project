var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Survey = new Schema({
    user:{type:Schema.Types.ObjectId,ref:'User'},
    number:Number,
    answers:Array
});

Survey.statics.isSolved = function(id,number,callback){
    this.find({user:id,number:number},{'_id':1},function(err,data){
        callback(err,data);
    });
}

Survey.statics.create = function(user,number,answers,callback){
    var data = {
        user:user,
        number:number,
        answers:answers
    }

    new_survey = new this(data);
    new_survey.save(function(err){
        callback(err);
    });
}

Survey.statics.getSurveyData = function(role,number,callback){
    this.find({'number':number},{'user':1,'answers':1})
    .populate({
        path:'user',
        select:'name lastname',
        match:{role:role}
    })
    .exec(function(err,data){
        var data2 = data.filter(function(doc){
            return doc.user != null;
        });
        callback(err,data2);
    });
}

module.exports = mongoose.model('Survey',Survey,'Survey');