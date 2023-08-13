angular
.module('assessment-service',['ui.materialize','as.sortable','LocalStorageModule'])
.service('assessmentService',function($http,localStorageService){
    var that = this;
    this.current = null;

    this.setCurrentAssessment = function(assessment){
        that.current = assessment;
        if(that.current != null){
            that.saveOnClient('a_current',that.current);
        }else{
            that.removeOnClient('a_current');
        }
    }

    this.getQuestionBank = function(callback){
        $http.get('/question/data')
        .success(function(questionBank){
            callback(null,questionBank);
        })
        .error(function(error){
            callback(error);
        });
    }

    this.getAssessmentBank = function(callback){
        $http.get('/assessment/data')
        .success(function(assessmentBank){
            callback(null,assessmentBank);
        })
        .error(function(error){
            callback(error);
        });
    }

    this.getAssessmentData = function(callback){
        if(this.current){
            $http.get('/assessment/data/'+this.current)
            .success(function(assessment){
                callback(null,assessment,50);           
            })
            .error(function(error){
                callback(error);
            });        
        }else{
            var assessment = {
                name:"",
                password:"",
                view_record:true,
                go_back:true,
                questions:[],
                goals:[],
            }

            callback(null,assessment,0);
        }
    }

    this.saveAssessment = function(data,callback){
        var assessment = JSON.parse(JSON.stringify(data));

        var questions = assessment.questions;
        assessment.questions = [];
        assessment.parameters = [];

        for(var i=0; i<questions.length; i++){
            assessment.questions.push(questions[i].question._id);
            if(questions[i].question.type == "common-base"){
                var goals = [];
                for(var j=0; j<questions[i].question.questions.length; j++){
                    var sub_goals = [];
                    var score = questions[i].question.questions[j].score;
                    for(var k=0; k<questions[i].question.questions[j].goals.length; k++){
                        sub_goals.push(questions[i].question.questions[j].goals[k].index);
                    }
                    goals.push({goals:sub_goals,score:score});
                }
                assessment.parameters.push(goals);
            }else{
                var goals = [];
                var score = questions[i].score;
                for(var j=0; j<questions[i].goals.length; j++){
                    goals.push(questions[i].goals[j].index);
                }
                assessment.parameters.push({goals:goals,score:score});
            }
        }

        if(this.current){
            $http.put('/assessment/data/'+assessment._id,{assessment:assessment})
            .success(function(answer){
                callback(null);
            })
            .error(function(error){
                callback(error);
            });
        }else{
            $http.post('/assessment/form',{assessment:assessment})
            .success(function(answer){
                callback(null);
            })
            .error(function(error){
                callback(error);
            });
        }
    }

    this.deleteAssessment = function(assessment,callback){
        $http.delete('/assessment/data/'+assessment)
        .success(function(response){
            callback(null);
        })
        .error(function(error){
            callback(error);
        });

    }

    this.saveOnClient = function(key,data){
        localStorageService.set(key,data);
    }

    this.removeOnClient = function(key){
        localStorageService.remove(key);
    }

    this.buildEnvironment = function(){
        that.current = localStorageService.get('a_current');
    }

    this.clearEnvironment = function(){
        localStorageService.clearAll();
    }

    that.buildEnvironment();
});