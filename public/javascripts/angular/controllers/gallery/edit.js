angular
.module('galleryControllers')
.controller('edit',function($scope,galleryService){
    $scope.success = false;
    $scope.message = "";
    $scope.item = null;

    galleryService.getItemData(function(err,item){
        if(err || !item){
            $scope.message = "Ha ocurrido un error en el sistema. Regrese a la galería e inicie el proceso de edición nuevamente.";
        }else{
            if(item){
                $scope.item = item;
            }
        }
    });

    $scope.save = function(){
        if($scope.item.name){
            galleryService.update($scope.item,function(err){
                if(err){
                    $scope.message = "Ha ocurrido un problema en el sistema. Intente nuevamente.";
                }else{
                    $scope.success = true;
                }
            });
        }else{
            $scope.message = "Debe asignar un nombre al elemento.";
        }
    }

    $scope.exit = function(){
        galleryService.setCurrentItem(null);
    }
});