angular
.module('presentationControllers')
.controller('true-false',function($scope,presentationService){
    $scope.question = null;
    $scope.question_index = null;
    $scope.subquestion_index = null;
    $scope.resource = null;
    $scope.container = [];
    $scope.go_back = null;

    presentationService.getCurrentQuestion('true-false',function(data,go_back){
        $scope.go_back = go_back;
        $scope.question = data.question;
        $scope.question_index = data.q;
        $scope.subquestion_index = data.s;
        $scope.resource = data.resource;

        $scope.container = $scope.question.body.true.slice().concat($scope.question.body.false.slice());
        $scope.question.body.true = [];
        $scope.question.body.false = [];           
        
        if(data.answer.ans != null){
            $scope.question.body.true = data.answer.ans.true;
            $scope.question.body.false = data.answer.ans.false;

            $scope.question.body.true.forEach(function(item){
                $scope.container.forEach(function(container,index){
                    if(item.index == container.index){
                        $scope.container.splice(index,1);
                    }
                });
            });

            $scope.question.body.false.forEach(function(item){
                $scope.container.forEach(function(container,index){
                    if(item.index == container.index){
                        $scope.container.splice(index,1);
                    }
                });
            });
        }

        $scope.container = $scope.container.sort(function(){return Math.random() - 0.5});
    });

    $scope.save = function(){
        var status = null;

        if($scope.container.length > 0){
            status = 'incomplete';
        }else{
            status = 'complete';
        }

        presentationService.saveAnswer($scope.question.body,status);
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

    $scope.trueListener = {
        accept:function(src,dst){return true}
    }

    $scope.falseListener = {
        accept:function(src,dst){return true}
    }

    $scope.containerListener = {
        accept:function(src,dst){return true}   
    }
});