var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate')(mongoose);

var Assessment = new Schema({
    name:String,
    password:String,
    view_record:Boolean,
    go_back:Boolean,
    goals:Array,
    questions:[{type:Schema.Types.ObjectId,ref:'Question'}],
    parameters:Array,
    owner:{type:Schema.Types.ObjectId,ref:'User'},
    status:{type:String,default:'available'}
});

Assessment.plugin(deepPopulate);

Assessment.statics.create = function(data,user,callback){
    var new_assessment = new this(data);
    new_assessment.owner = user;    
    new_assessment.save(callback);
}

Assessment.statics.update = function(data,callback){
    this.findByIdAndUpdate(data._id,{$set:data},function(err){
        callback(err);
    });
}

Assessment.statics.delete = function(id,callback){
    this.findById(id,function(err,assessment){
        if(err){
            callback(err);
        }else{
            assessment.status = 'deleted';
            assessment.save(callback);
        }
    });
}

Assessment.statics.setViewRecord = function(id,status,callback){
    this.findByIdAndUpdate(id,{$set:{view_record:status}},function(err){
        callback(err);
    });   
}

Assessment.statics.getAllAssessments = function(callback){
    this.find({status:'available'},{'_id':1,'name':1,'password':1,'owner':1}).populate('owner','name lastname').exec(function(err,data){
        callback(err,data);
    });
}

Assessment.statics.getAssessment = function(id,callback){
    this.findById(id,{'name':1,'password':1,'questions':1,'view_record':1,'go_back':1,'goals':1,'parameters':1})
    .deepPopulate('questions.attachment questions.questions questions.questions.attachment')
    .exec(function(err,data){
        callback(err,data);
    });
}

Assessment.statics.getAssessmentForPresentation = function(id,callback){
    this.findById(id,{'name':1,'password':1,'questions':1,'go_back':1})
    .deepPopulate('questions.attachment questions.questions questions.questions.attachment')
    .exec(function(err,data){
        callback(err,data);
    });
}

Assessment.statics.getAssessmentForRecord = function(id,callback){
    this.findById(id,{'name':1,'questions':1,'goals':1,'parameters':1})
    .deepPopulate('questions.questions',{
        populate:{
            'questions':{
                select:'name statement type questions'
            },
            'questions.questions':{
                select:'name statement type'  
            }
        }
    })
    .exec(function(err,data){
        callback(err,data);
    });
}

Assessment.statics.getAssessmentQuestions = function(id,callback){
    this.findById(id,{'_id':1,'questions':1},function(err,data){
        callback(err,data);
    });
}

Assessment.statics.getAssessmentBank = function(user,callback){
    this.find({owner:user,status:'available'},{'_id':1,'name':1,'view_record':1},function(err,data){
        callback(err,data);
    });
}

module.exports = mongoose.model('Assessment',Assessment,'Assessment');