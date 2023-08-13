var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate')(mongoose);

var Record = new Schema({
    assessment:{type:Schema.Types.ObjectId,ref:'Assessment'},
    student:{type:Schema.Types.ObjectId,ref:'User'},
    score:Number,
    answers:[],
    goals:[]
});

Record.plugin(deepPopulate);

Record.statics.create = function(assessment,student,score,answers,goals,callback){
    var data = {
        assessment:assessment,
        student:student,
        score:score,
        answers:answers,
        goals:goals
    }

    new_record = new this(data);
    new_record.save(function(err){
        callback(err);
    });
}

Record.statics.isAssessmentSolved = function(assessment,student,callback){
    this.find({assessment:assessment,student:student},{'_id':1},function(err,data){
        callback(err,data);
    });
}

Record.statics.getRecordForStudent = function(id,callback){
    this.findById(id,{'_id':1,'assessment':1,'student':1,'score':1,'answers':1,'goals':1})
    .populate('student','name lastname')
    .deepPopulate('assessment.questions.attachment assessment.questions.questions assessment.questions.questions.attachment',{
        populate:{
            'assessment':{
                select:'name questions parameters goals'
            },
            'assessment.questions':{
                select:'name statement type attachment questions body'
            },
            'assessment.questions.questions':{
                select:'name statement type attachment body'
            },
            'assessment.questions.attachment':{
                select:'type url text'
            },
            'assessment.questions.questions.attachment':{
                select:'type url text'
            }
        }
    })
    .exec(function(err,data){
        callback(err,data);
    });
}

Record.statics.getStudentRecords = function(student,callback){
    this.find({student:student},{'assessment':1})
    .deepPopulate('assessment.owner',{
        populate:{
            'assessment':{
                select:'name view_record owner',
                match:{'status':{'$in':['available']}}
            },
            'assessment.owner':{
                select:'name lastname'
            }
        }
    }).exec(function(err,data){
        callback(err,data);
    });
}

Record.statics.getAssessmentRecords = function(assessment,callback){
    this.find({assessment:assessment},{'_id':1,'student':1,'score':1,'answers':1,'goals':1})
    .deepPopulate('student',{
        populate:{
            'student':{
                select:'name lastname'
            }
        }
    })
    .exec(function(err,data){
        callback(err,data);
    });
}

Record.statics.getAssessmentRecordsForFile = function(assessment,callback){
    this.find({assessment:assessment},{'_id':1,'student':1,'score':1})
    .populate({
        path:'student',
        select:'name lastname'
    })
    .sort('student')
    .exec(function(err,data){
        callback(err,data);
    });    
}

module.exports = mongoose.model('Record',Record,'Record');