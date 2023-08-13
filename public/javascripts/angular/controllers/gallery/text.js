angular
.module('galleryControllers')
.controller('text',function($scope,galleryService){
    $scope.success = false;
    $scope.message = "";
    $scope.gallery = null;
    $scope.editor = {
        name:"",
        text:""
    };

    galleryService.getGallery(function(err,gallery){
        if(err){
            $scope.message = "Ha ocurrido un problema en el sistema. Recargue esta página por favor.";
        }else{
            $scope.gallery = gallery;
        }
    });

    galleryService.getItemData(function(err,item){
        if(err){
            $scope.message = "Ha ocurrido un problema en el sistema. Recargue esta página por favor.";
        }else{
            if(item){
                $scope.editor._id = item._id;
                $scope.editor.name = item.name;
                $scope.editor.text = item.text;
            }
        }
    });

    $scope.editor.insertImage = function(url){
        var img = "<div><img class='preview' src='" + url + "'></div>";
        $scope.editor.text += img;         
    }

    $scope.editor.clear = function(){
        $scope.editor.text = "";
    }

    $scope.validate = function(){
        var complete = true;
        $scope.message = "";

        if(!$scope.editor.name){
            $scope.message += "* Asigne un nombre al texto.\n";
            complete = false;
        }
        if(!$scope.editor.text){
            $scope.message += "* Ingrese el texto a almacenar.\n";
            complete = false;
        }

        return complete;
    }

    $scope.save = function(){
        if($scope.validate()){
            galleryService.uploadText($scope.editor,function(err){
                if(err){
                    $scope.message = "Ha ocurrido un problema en el sistema. Intente nuevamente.";
                }else{
                    $scope.success = true;
                }
            });
        }else{
            $scope.message = "Verifique lo siguiente: \n" + $scope.message;
        }
    }

    $scope.exit = function(){
        galleryService.setCurrentItem(null);
    }
});