angular
.module('questionControllers')
.controller('viewer',function($scope,questionService){
    $scope.message = "";
    $scope.question = null;
    $scope.category = null;

    questionService.getQuestionData(null,function(err,question){
        if(err){
            $scope.message = "Ha ocurrido un problema en el sistema. Recargue esta página por favor.";
        }else{
            $scope.question = question;
        }
    });

    $scope.setCategory = function(category){
        $scope.category = category;
    }

    $scope.exit = function(){
        questionService.setCurrentQuestion(null);
        questionService.resetIndexes();
    }
});