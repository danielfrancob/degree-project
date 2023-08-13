angular
.module('presentationControllers')
.controller('multiplechoice',function($scope,presentationService){
    $scope.question = null;
    $scope.question_index = null;
    $scope.subquestion_index = null;
    $scope.resource = null;
    $scope.go_back = null;

    presentationService.getCurrentQuestion('multiplechoice',function(data,go_back){
        $scope.go_back = go_back;
        $scope.question = data.question;
        $scope.question_index = data.q;
        $scope.subquestion_index = data.s;
        $scope.resource = data.resource;

        $scope.question.body.options = $scope.question.body.options.concat($scope.question.body.answers.slice());
        $scope.question.body.answers = [];

        if(data.answer.ans != null){
            $scope.question.body.answers = data.answer.ans;
            $scope.question.body.answers.forEach(function(ans){
                $scope.question.body.options.forEach(function(opt,index){
                    if(ans.index == opt.index){
                        $scope.question.body.options.splice(index,1);
                    }
                });
            });
        }

        $scope.question.body.options = $scope.question.body.options.sort(function() {return Math.random() - 0.5});
    });

    $scope.save = function(){
        var status = null;

        if($scope.question.body.answers.length > 0){
            status = 'complete';
        }else{
            status = 'incomplete';
        }

        presentationService.saveAnswer($scope.question.body.answers,status);
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

    $scope.optionsListener = {
        accept:function(src,dst){return true}
    }

    $scope.answersListener = {
        accept:function(src,dst){return true}
    }
});