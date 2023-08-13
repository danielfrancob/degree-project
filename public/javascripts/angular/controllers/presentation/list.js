angular
.module('presentationControllers',['presentation-service','filters'])
.controller('list',function($scope,presentationService){
    $scope.message = "";
    $scope.modal_message = "";
    $scope.list = null;

    $scope.assessment_index = null;
    $scope.password = null;
    $scope.valid = false;
    $scope.solved = false;

    presentationService.getAssessmentList(function(err,list){
        if(err){
            $scope.message = "Ha ocurrido un problema en el sistema. Recargue esta página por favor.";
        }else{
            $scope.list = list;
        }
    });

    $scope.setAssessment = function(index){
        $scope.assessment_index = index;
    }

    $scope.validate = function(){
        $scope.message = "";
        $scope.modal_message = "";

        if($scope.password){
            if($scope.list[$scope.assessment_index].password == $scope.password){
                presentationService.isAssessmentSolved($scope.list[$scope.assessment_index]._id,function(err,ans){
                    if(err){
                        $scope.modal_message = "Ha ocurrido un problema en el sistema. Intente nuevamente.";
                    }else{
                        if(ans == true){
                            $scope.solved = true;
                        }else{
                            $scope.valid = true;
                        }  
                    }
                });
            }else{
                $scope.modal_message = "Ha ingresado una contraseña incorrecta. Intente nuevamente.";
            }
        }else{
            $scope.modal_message = "Debe escribir una contraseña para validar.";
        }
    }

    $scope.load = function(){
        $scope.message = "";
        var id = $scope.list[$scope.assessment_index]._id;

        presentationService.loadAssessment(id,function(err){
            if(err){
                $scope.message = "Ha ocurrido un error. Intente nuevamente";
            }
        });
    }

    $scope.clear = function(){
        $scope.assessment_index = null;
        $scope.password = "";
        $scope.valid = false;
        $scope.modal_message = "";
        $scope.solved = false;
    }
});