angular
.module('presentationControllers')
.controller('summary',function($scope,presentationService){
    $scope.message = "";
    $scope.answers = [];
    $scope.complete = null;
    $scope.go_back = null;
    $scope.finishing = false;

    presentationService.getAnswers(function(answers,go_back){
        $scope.go_back = go_back;
        for(var i=0; i<answers.length; i++){
            var obj = {};
            obj.question = i;

            if(angular.isArray(answers[i])){
                obj.answers = [];
                for(var j=0; j<answers[i].length; j++){
                    var subobj = {};
                    subobj.question = i;
                    subobj.subquestion = j;
                    subobj.status = answers[i][j].status;
                    obj.answers.push(subobj);
                }
            }else{
                obj.status = answers[i].status;
            }

            $scope.answers.push(obj);
        }
    });

    $scope.goTo = function(question,subquestion){
        presentationService.goToQuestion(question,subquestion);
    }

    $scope.verify = function(){
        $scope.complete = presentationService.verifyAssessment();
    }

    $scope.finish = function(){
        $scope.finishing = true;
        presentationService.finishAssessment(function(err){
            if(err){
                $scope.finishing = false;
                $scope.message = "Ocurrió un error en el servidor. Haga click en finalizar nuevamente.";
            }
        });
    }

    $scope.clear = function(){
        $scope.complete = null;
        $scope.message = "";
    }
});