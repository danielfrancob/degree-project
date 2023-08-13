angular
.module('userApp',['LocalStorageModule'])
.controller('user',function($scope,$http,localStorageService){    
    $scope.hideModal = false;
    $scope.message = "";
    $scope.password = "";

    $scope.changePassword = function(){
        $scope.message = "";
        if($scope.password){
            $http.post('/home/changepassword',{password:$scope.password})
            .success(function(response){
                $scope.hideModal = true;
            })
            .error(function(error){
                $scope.message = "Ocurrió un error en el servidor. Intente nuevamente.";
            })
        }else{
            $scope.message = "Debe ingresar una clave";
        }
    }

    $scope.clearPassword = function(){
        $scope.message = "";
        $scope.password = "";
        $scope.hideModal = false;
    }

    $scope.clear = function(){
        localStorageService.clearAll();
    }
});