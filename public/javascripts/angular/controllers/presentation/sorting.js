angular
.module('presentationControllers')
.controller('sorting',function($scope,presentationService){
    $scope.question = null;
    $scope.question_index = null;
    $scope.subquestion_index = null;
    $scope.resource = null;
    $scope.go_back = null;

    presentationService.getCurrentQuestion('sorting',function(data,go_back){
        $scope.go_back = go_back;
        $scope.question = data.question;
        $scope.question_index = data.q;
        $scope.subquestion_index = data.s;
        $scope.resource = data.resource;

        if(data.answer.ans != null){
            $scope.question.body.answer = data.answer.ans;
        }else{
            $scope.question.body.answer = $scope.question.body.answer.sort(function() {return Math.random() - 0.5});
        }
    });

    $scope.save = function(){
        presentationService.saveAnswer($scope.question.body.answer,'complete');
    }
    
    $scope.previous = function(){
        $scope.save();
        presentationService.previousQuestion();
    }

    $scope.next = function(){
        $scope.save();
        presentationService.nextQuestion();
    }

    $scope.summary = function(){
        $scope.save();
        presentationService.goToSummary();
    }

    $scope.answersListener = {
        accept:function(src,dst){return true}
    }
});