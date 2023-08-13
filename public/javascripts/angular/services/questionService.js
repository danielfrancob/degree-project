angular
.module('question-service',['ui.materialize','text-editor','as.sortable','LocalStorageModule'])
.service('questionService',function($http,localStorageService){    
    var that = this;
    this.indexes = [];
    this.current = null;

    var isIndex = function(index){
        var exist = false;

        for (var i = 0; i < that.indexes.length; i++){
            if(that.indexes[i] === index){
                exist = true;
                i = that.indexes.length;
            }
        }

        return exist;
    }

    var setIndexes = function(question){
        switch(question.type){
            case 'matching':
                question.body.concepts.forEach(function(concept){
                    that.indexes.push(concept.index);
                });
                break;
            case'multiplechoice':
                question.body.options.forEach(function(option){
                    that.indexes.push(option.index);
                });
                question.body.answers.forEach(function(answer){
                    that.indexes.push(answer.index);
                });
                break;
            case 'sorting':
                question.body.answer.forEach(function(answer){
                    that.indexes.push(answer.index);
                });
                break;
            case 'true-false':
                question.body.true.forEach(function(item){
                    that.indexes.push(item.index);
                });
                question.body.false.forEach(function(item){
                    that.indexes.push(item.index);
                });            
                break;
        }        
    }

    this.newIndex = function(){
        var index = null;
        var exist = false;
        
        do{
            index = Math.floor((Math.random() * 1000) + 1);
            exist = isIndex(index);
        }while(exist);

        this.indexes.push(index);
        return index;
    }

    this.removeIndex = function(index){
        var i = this.indexes.indexOf(index);
        this.indexes.splice(i,1);
    }

    this.resetIndexes = function(){
        this.indexes = [];
    }

    this.setCurrentQuestion = function(question){
        that.current = question;
        if(that.current != null){
            that.saveOnClient('q_current',that.current);
        }else{
            that.removeOnClient('q_current');
        }
    }

    this.getGallery = function(callback){
        $http.get('/gallery/data')
        .success(function(gallery){
            callback(null,gallery);
        })
        .error(function(error){
            callback(error);
        });
    }

    this.getQuestionBank = function(callback){
        $http.get('/question/data')
        .success(function(bank){
            callback(null,bank);
        })
        .error(function(error){
            callback(error);
        });
    }

    this.getQuestionData = function(type,callback){
        if(this.current){
            $http.get('/question/data/'+this.current)
            .success(function(question){
                setIndexes(question);
                callback(null,question);           
            })
            .error(function(error){
                callback(error);
            });
        }else{
            var question = {
                type:type,
                name:"",
                statement:"",
                attachment:null,
                body:null
            };

            switch(type){
                case 'common-base':
                    question.questions = [];
                    break;
                case 'matching':
                    question.body = {
                        concepts:[],
                        categories:[]
                    }
                    break;
                case 'multiplechoice':
                    question.body = {
                        options:[],
                        answers:[]
                    }
                    break;
                case 'sorting':
                    question.body = {
                        answer:[]
                    }
                    break;
                case 'true-false':
                    question.body = {
                        true:[],
                        false:[]
                    }
                    break;
            }

            callback(null,question);
        }
    }

    this.saveQuestion = function(data,callback){
        var question = data;

        if(question.attachment){
            var attachmentOID = question.attachment._id;
            question.attachment = attachmentOID;
        }

        if(question.type == 'common-base'){
            var questions = [];
            for(var i=0; i<question.questions.length; i++){
                questions.push(question.questions[i]._id);
            }
            question.questions = questions;
        }

        if(this.current){
            $http.put('/question/data/'+question._id,{question:question})
            .success(function(response){
                callback(null);
            })
            .error(function(error){
                callback(error);
            });
        }else{
            $http.post('/question/'+question.type+'/form',{question:question})
            .success(function(response){
                callback(null);
            })
            .error(function(error){
                callback(error);
            });            
        }
    }

    this.deleteQuestion = function(question,callback){
        $http.delete('/question/data/'+question)
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
        that.current = localStorageService.get('q_current');
    }

    this.clearEnvironment = function(){
        localStorageService.clearAll();
    }

    that.buildEnvironment();
});