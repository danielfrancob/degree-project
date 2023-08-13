angular
.module('questionControllers',['question-service','filters'])
.controller('bank',function($scope,questionService){
    $scope.message = "";
    $scope.bank = null;

    questionService.getQuestionBank(function(err,bank){
        if(err){
            $scope.message = "Ha ocurrido un problema en el sistema. Recargue esta página por favor.";
        }else{
            $scope.bank = bank;
        }
    });

    $scope.edit = function(id){
        questionService.setCurrentQuestion(id);
    }

    $scope.delete = function(id,index){
        questionService.deleteQuestion(id,function(err){
            if(err){
                $scope.message = "Ha ocurrido un error al borrar la pregunta. Intente nuevamente.";
            }else{
                $scope.bank.splice(index,1);
            }
        });
    }
});