angular
.module('recordControllers',['record-service','filters','chart.js'])
.controller('list',function($scope,recordService){
    $scope.message = "";
    $scope.list = null;

    recordService.getStudentList(function(err,list){
        if(err){
            $scope.message = "Hubo un error en el sistema. Recargue esta página por favor.";
        }else{
            $scope.list = list;
        }
    });

    $scope.setRecord = function(id){
        recordService.setStudentRecord(id);
    }
});