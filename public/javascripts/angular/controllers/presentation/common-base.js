angular
.module('presentationControllers')
.controller('common-base',function($scope,presentationService){
    $scope.question = null;
    $scope.question_index = null;
    $scope.subquestion_index = null;
    $scope.go_back = null;

    presentationService.getCurrentQuestion('common-base',function(data,go_back){
        $scope.go_back = go_back;
        $scope.question = data.question;
        $scope.question_index = data.q;
        $scope.subquestion_index = data.s;
    });
    
    $scope.previous = function(){
        presentationService.previousQuestion();
    }

    $scope.next = function(){
        presentationService.nextQuestion();
    }

    $scope.summary = function(){
        presentationService.goToSummary();
    }
});