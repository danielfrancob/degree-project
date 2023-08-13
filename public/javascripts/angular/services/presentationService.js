angular
.module('presentation-service',['ui.materialize','LocalStorageModule','as.sortable'])
.service('presentationService',function($http,$window,localStorageService){
    var that = this;
    this.assessment = null;
    this.answers = null;
    this.question = null;
    this.subquestion = null;
    this.status = null;

    this.getAssessmentList = function(callback){
        if(that.assessment){
            if(that.status == 'in progress'){
                var data = that.buildQuestion();
                that.redirectTo('question/' + data.question.type);
            }else{
                that.redirectTo('summary');
            }
        }else{
            $http.get('/presentation/assessments')
            .success(function(list){
                callback(null,list);
            })
            .error(function(error){
                callback(error);
            });
        }
    }

    this.loadAssessment = function(id,callback){
        if(that.assessment == null){
            $http.get('/presentation/assessment/data/'+id)
            .success(function(assessment){
                that.assessment = assessment;
                that.saveOnClient('p_assessment',that.assessment);
                that.start();
            })
            .error(function(error){
                callback(error);
            });
        }else{
            that.status = 'finished';
            that.saveOnClient('p_status',that.status);
            that.redirectTo('summary');
        }
    }

    this.isAssessmentSolved = function(id,callback){
        $http.get('/presentation/record/'+id)
        .success(function(response){
            callback(null,response);
        })
        .error(function(error){
            callback(error);
        }); 
    }

    this.finishAssessment = function(callback){
        $http.post('/presentation/record/'+that.assessment._id,{answers:that.answers})
        .success(function(response){
            callback(null);
            that.clearEnvironment();
            that.redirectTo('/home');
        })
        .error(function(error){
            callback(error);
        }); 
    }

    this.verifyAssessment = function(){
        var complete = true;

        for(var i=0; i<that.answers.length; i++){   
            if(angular.isArray(that.answers[i])){
                for(var j=0; j<that.answers[i].length; j++){
                    if(that.answers[i][j].status == 'incomplete'){
                        complete = false;
                        j = that.answers[i].length;
                    }
                }
                if(complete == false){
                    i = that.answers.length;
                }
            }else{
                if(that.answers[i].status == 'incomplete'){
                    complete = false;
                    i = that.answers.length;
                }
            }
        }

        return complete;
    }

    this.start = function(){
        that.answers = [];
        that.assessment.questions.forEach(function(question){
            if(question.type == 'common-base'){
                var subquestions = [];
                question.questions.forEach(function(subquestion){
                    subquestions.push({ans:null,status:'incomplete'});
                });
                that.answers.push(subquestions);
            }
            else{
                that.answers.push({ans:null,status:'incomplete'})
            }
        });

        that.saveOnClient('p_answers',that.answers);
        that.nextQuestion();
    }

    this.buildQuestion = function(){
        var data = {
            question:null,
            answer:null,
            resource:null,
            q:that.question,
            s:that.subquestion
        }

        if(that.subquestion != null && that.subquestion >= 0){
            data.question = that.assessment.questions[that.question].questions[that.subquestion];
            data.answer = that.answers[that.question][that.subquestion];
            data.resource = that.assessment.questions[that.question].attachment;
        }else{
            data.question = that.assessment.questions[that.question];
            if(data.question.type != 'common-base'){
                data.answer = that.answers[that.question];
            } 
        }

        return data;
    }

    this.getCurrentQuestion = function(type,callback){
        if(that.assessment != null){
            var data = that.buildQuestion();

            if(type == data.question.type){
                callback(data,that.assessment.go_back);    
            }else{
                that.redirectTo('question/' + data.question.type);
            }
        }else{
            that.clearEnvironment();
            that.redirectTo('/presentation');
        }
    }

    this.getAnswers = function(callback){
        if(that.assessment != null){
            callback(that.answers,that.assessment.go_back);
        }else{
            that.clearEnvironment();
            that.redirectTo('/presentation');
        }
    }

    this.previousQuestion = function(){
        var template = null;
        var type = null;

        if(that.status == 'finished'){
            that.status = 'in progress';
            that.saveOnClient('p_status',that.status);
        }else{
            that.previousIndexes();
        }

        if(that.subquestion != null && that.subquestion != -1){
            type = that.assessment.questions[that.question].questions[that.subquestion].type;
        }else{
            type = that.assessment.questions[that.question].type;
    
            if(type == 'common-base' && that.subquestion == null){
                that.subquestion = that.assessment.questions[that.question].questions.length - 1;
                type = that.assessment.questions[that.question].questions[that.subquestion].type;
                that.saveOnClient('subquestion',that.subquestion);
            }
        }
        
        template = 'question/' + type;

        that.redirectTo(template);
    }

    this.nextQuestion = function(){
        that.nextIndexes();

        var template = null;

        if(that.status == 'finished'){
            template = 'summary';
        }else{
            var type = null;

            if(that.subquestion != null && that.subquestion != -1){
                type = that.assessment.questions[that.question].questions[that.subquestion].type;
            }else{
                type = that.assessment.questions[that.question].type;
                
                if(type == 'common-base'){
                    that.subquestion = -1;
                    that.saveOnClient('p_subquestion',that.subquestion);
                }
            }

            template = 'question/' + type;
        }
        
        that.redirectTo(template);
    }

    this.goToQuestion = function(question,subquestion){
        var template = null;
        var type = null;

        if(that.status != 'in progress'){
            that.status = 'in progress';
            that.saveOnClient('p_status',that.status);
        }

        that.question = question;
        that.saveOnClient('p_question',that.question);

        if(subquestion != null){
            that.subquestion = subquestion;
            that.saveOnClient('p_subquestion',that.subquestion);
            type = that.assessment.questions[that.question].questions[that.subquestion].type;
        }else{
            type = that.assessment.questions[that.question].type;
            that.removeOnClient('p_subquestion');
            if(type == 'common-base'){
                that.subquestion = -1;
                that.saveOnClient('p_subquestion',that.subquestion);
            }
        }

        template = 'question/' + type
        that.redirectTo(template);
    }

    this.goToSummary = function(){
        that.status = 'finished';
        that.saveOnClient('p_status',that.status);
        this.redirectTo('summary');
    }

    this.previousIndexes = function(){
        if(that.subquestion != null){
            if(that.subquestion > -1){
                that.subquestion -= 1;
                that.saveOnClient('p_subquestion',that.subquestion);
            }else{
                if(that.question > 0){
                    that.subquestion = null;
                    that.question -= 1;
                    that.saveOnClient('p_question',that.question);
                    that.removeOnClient('p_subquestion');
                }
            }
        }else{
            if(that.question > 0){
                that.question -= 1;
                that.saveOnClient('p_question',that.question);
            }
        }
    }

    this.nextIndexes = function(){
        if(that.status == null){
            that.question = 0;
            that.status = 'in progress';
            that.saveOnClient('p_question',that.question);
            that.saveOnClient('p_status',that.status);
        }else{
            if(that.subquestion != null){
                if(that.subquestion + 1 < that.assessment.questions[that.question].questions.length){
                    that.subquestion += 1;
                    that.saveOnClient('p_subquestion',that.subquestion);
                }else{
                    if(that.question + 1 < that.assessment.questions.length){
                        that.subquestion = null;
                        that.question += 1;
                        that.saveOnClient('p_question',that.question);
                        that.removeOnClient('p_subquestion');
                    }else{
                        that.status = 'finished';
                        that.saveOnClient('p_status',that.status);                    
                    }
                }
            }else{
                if(that.question + 1 < that.assessment.questions.length){
                    that.question += 1;
                    that.saveOnClient('p_question',that.question);  
                }else{
                    that.status = 'finished';
                    that.saveOnClient('p_status',that.status);
                }     
            }            
        }
    }

    this.saveAnswer = function(ans,status){
        if(that.subquestion != null && that.subquestion != -1){
            that.answers[that.question][that.subquestion].ans = ans;
            that.answers[that.question][that.subquestion].status = status;
        }else{
            that.answers[that.question].ans = ans;
            that.answers[that.question].status = status;
        }

        that.saveOnClient('p_answers',that.answers);
    }

    this.saveOnClient = function(key,data){
        localStorageService.set(key,data);
    }

    this.removeOnClient = function(key){
        localStorageService.remove(key);
    }

    this.buildEnvironment = function(){
        that.assessment = localStorageService.get('p_assessment');
        that.answers = localStorageService.get('p_answers');
        that.question = localStorageService.get('p_question');
        that.subquestion = localStorageService.get('p_subquestion');
        that.status = localStorageService.get('p_status');
    }

    this.clearEnvironment = function(){
        that.assessment = null;
        that.answers = null;
        that.question = null;
        that.subquestion = null;
        that.status = null;
        localStorageService.clearAll();
    }

    this.redirectTo= function(url){
        $window.location.href = url;
    }

    that.buildEnvironment();
});