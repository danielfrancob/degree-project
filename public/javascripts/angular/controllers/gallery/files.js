angular
.module('galleryControllers')
.controller('files',function($scope,galleryService){
    $scope.message = "";
    $scope.files = [];

    $scope.change = function(){
        $scope.files.forEach(function(file){
            if(!file.progress){
                file.progress = 0;
                file.customName = file.name.split('.')[0];
            }
        });
    }

    $scope.remove = function(index){
        $scope.files.splice(index,1);
    }

    $scope.removeComplete = function(){
        var to_remove = [];

        for(var i=$scope.files.length-1; i>=0 ; i--){
            if($scope.files[i].result === 'ok'){
                $scope.files.splice(i,1);
            }
        }
    }

    $scope.removeAll = function(){
        $scope.files = [];
    }

    $scope.upload = function(){
        angular.forEach($scope.files,function(file){
            if(file.result !== 'ok'){
                galleryService.uploadFile(file);
            }
        });
    }
});
