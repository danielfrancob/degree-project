angular
.module('record-service',['ui.materialize','LocalStorageModule'])
.service('recordService',function($http,$window,localStorageService){
    var that = this;
    this.st_record = null;
    this.r_assessment = null;

    this.getStudentList = function(callback){
        $http.get('/record/student/list')
        .success(function(list){
            callback(null,list);
        })
        .error(function(error){
            callback(error);
        });
    }

    this.getTeacherList = function(callback){
        $http.get('/assessment/data')
        .success(function(list){
            callback(null,list);
        })
        .error(function(error){
            callback(error);
        });
    }

    this.getStudentRecord = function(callback){
        $http.get('/record/data/student/'+that.st_record)
        .success(function(record){
            callback(null,record);
        })
        .error(function(error){
            callback(error);
        });
    }

    this.setStudentRecord = function(id){
        that.st_record = id;
        if(id == null){
            that.removeOnClient('st_record');
        }else{
            that.saveOnClient('st_record',that.st_record);
        }
    }

    this.getAssessmentRecords = function(callback){
        $http.get('/record/data/teacher/'+that.r_assessment)
        .success(function(assessment){
            callback(null,assessment);
        })
        .error(function(error){
            callback(error);
        });
    }

    this.setAssessment = function(id){
        that.r_assessment = id;
        if(id == null){
            that.removeOnClient('r_assessment');
        }else{
            that.saveOnClient('r_assessment',that.r_assessment);
        }        
    }

    this.changeVisibility = function(id,status,callback){
        $http.put('/record/assessment/'+id,{status:status})
        .success(function(answer){
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
        that.st_record = localStorageService.get('st_record');
        that.r_assessment = localStorageService.get('r_assessment');
    }

    this.clearEnvironment = function(){
        localStorageService.clearAll();
    }

    that.buildEnvironment();
});