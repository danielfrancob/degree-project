angular
.module('recordControllers',['record-service','filters','chart.js'])
.controller('list',function($scope,recordService){
    $scope.message = "";
    $scope.list = null;

    recordService.getTeacherList(function(err,list){
        if(err){
            $scope.message = "Hubo un error en el sistema. Recargue esta página por favor.";
        }else{
            $scope.list = list;
        }
    });

    $scope.setAssessment = function(id){
        recordService.setAssessment(id);
    }

    $scope.changeVisibility = function(index,id,status){
        recordService.changeVisibility(id,status,function(err){
            if(err){
                $scope.message = "Falló el cambio de visibilidad de resultados para la evaluación.";
            }else{
                $scope.list[index].view_record = status;
            }
        });
    }
});