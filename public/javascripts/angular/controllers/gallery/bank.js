angular
.module('galleryControllers',['gallery-service','filters'])
.controller('bank',function($scope,galleryService){
    $scope.message = "";
    $scope.gallery = null;
    $scope.item = null;

    galleryService.getGallery(function(err,gallery){
        if(err){
            $scope.message = "Ha ocurrido un problema en el sistema. Recargue esta página por favor.";
        }else{
            $scope.gallery = gallery;
        }
    });

    $scope.view = function(item){
        $scope.item = item;
    }

    $scope.edit = function(id){
        galleryService.setCurrentItem(id);
    }

    $scope.delete = function(id,index){
        galleryService.deleteItem(id,function(err){
            if(err){
                $scope.message = "Ha ocurrido un error al borrar el elemento. Intente nuevamente.";
            }else{
                $scope.gallery.splice(index,1);
            }
        });
    }
});
