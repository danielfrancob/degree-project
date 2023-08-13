angular
.module('assessmentControllers',['assessment-service','filters'])
.controller('bank',function($scope,assessmentService){
    $scope.message = "";
    $scope.bank = null;

    assessmentService.getAssessmentBank(function(err,bank){
        if(err){
            $scope.message = "Ha ocurrido un problema en el sistema. Recargue esta página por favor.";
        }else{
            $scope.bank = bank;
        }
    });

    $scope.setAssessment = function(id){
        assessmentService.setCurrentAssessment(id);
    }

    $scope.delete = function(id,index){
        assessmentService.deleteAssessment(id,function(err){
            if(err){
                $scope.message = "Ha ocurrido un error al borrar la evaluación. Intente nuevamente.";
            }else{
                $scope.bank.splice(index,1);
            }
        });
    }
});