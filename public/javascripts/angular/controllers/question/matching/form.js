angular
.module('questionControllers')
.controller('matching',function($scope,questionService){
    $scope.success = false;
    $scope.message = "";
    $scope.gallery = null;
    $scope.question = null;
    $scope.category = null;

    $scope.editor = {
        section:"",
        index:"",
        text:""
    }

    questionService.getGallery(function(err,gallery){
        if(err){
            $scope.message = "Ha ocurrido un problema en el sistema. Recargue esta página por favor.";
        }else{
            $scope.gallery = gallery;
        }
    });

    questionService.getQuestionData('matching',function(err,question){
        if(err){
            $scope.message = "Ha ocurrido un problema en el sistema. Recargue esta página por favor.";
        }else{
            $scope.question = question;
        }
    });

    $scope.editor.setSection = function(section,index){
        $scope.editor.section = section;
        $scope.editor.index = index;

        switch(section){
            case 'statement':
                $scope.editor.text = $scope.question.statement;
                break;
            case 'concepts':
                if(angular.isNumber($scope.editor.index)){
                    $scope.editor.text = $scope.question.body.concepts[index].text;
                }
                break;
        }
    }

    $scope.editor.insertImage = function(url){
        var img = "<div><img class='preview' src='" + url + "'></div>";
        $scope.editor.text += img;        
    }

    $scope.editor.applyChanges = function(){
        switch($scope.editor.section){
            case 'statement':
                $scope.question.statement = $scope.editor.text;
                break;
            case 'concepts':
                if(angular.isNumber($scope.editor.index)){
                    $scope.question.body.concepts[$scope.editor.index].text = $scope.editor.text;
                    var internal_index = $scope.question.body.concepts[$scope.editor.index].index;
                    for(var i=0; i<$scope.question.body.categories.length; i++){
                        var category = $scope.question.body.categories[i].objects;
                        for(var j=0; j<category.length; j++){
                            if(category[j].index == internal_index){
                                category[j].text = $scope.editor.text;
                                j = category.length;
                            }
                        }
                    }
                }else{
                    $scope.question.body.concepts.push({index:questionService.newIndex(),text:$scope.editor.text});
                }
                break;
        }

        $scope.editor.cancel();
    }

    $scope.editor.cancel = function(){
        $scope.editor.section = "";
        $scope.editor.index = "";
        $scope.editor.text = "";
    }

    $scope.setCategory = function(category){
        $scope.category = category;
    }

    $scope.add = function(section,element){
        switch(section){
            case 'attachment':
                $scope.question.attachment = element;
                break;
            case 'categories':
                $scope.question.body.categories.push({name:"",objects:[]});
                break;
        }
    }

    $scope.remove = function(section,index){
        switch(section){
            case 'statement':
                $scope.question.statement = "";
                break;
            case 'attachment':
                $scope.question.attachment = null;
                break;
            case 'categories':
                if(angular.isNumber($scope.category)){
                    $scope.question.body.categories[$scope.category].objects.splice(index,1);
                }else{
                    $scope.question.body.categories.splice(index,1);
                }
                break;
            case 'concepts':
                var internal_index = $scope.question.body.concepts[index].index;
                for(var i=0; i<$scope.question.body.categories.length; i++){
                    var category = $scope.question.body.categories[i].objects;
                    for(var j=0; j<category.length; j++){
                        if(category[j].index == internal_index){
                            category.splice(j,1);
                            j = category.length;
                        }
                    }
                }
                questionService.removeIndex(internal_index);
                $scope.question.body.concepts.splice(index,1);
                break;
        }
    }

    $scope.validateCategories = function(){
        if($scope.question){
            var complete = true;

            if($scope.question.body.categories.length == 0){
                complete = false;
            }else{
                for(var i=0; i<$scope.question.body.categories.length; i++){
                    var category = $scope.question.body.categories[i];
                    if(!category.name){
                        complete = false; 
                    }
                }
            }

            return complete;
        }
    }
    
    $scope.validate = function(){
        var complete = true;
        $scope.message = "";

        if(!$scope.question.name){
            $scope.message += "* Asigne el nombre de la pregunta.\n";
            complete = false;
        }
        if(!$scope.question.statement){
            $scope.message += "* Asigne el enunciado de la pregunta.\n";
            complete = false; 
        }
        if($scope.question.body.concepts.length == 0){
            $scope.message += "* Debe agregar algunos conceptos a la pregunta.\n";
            complete = false;            
        }
        if($scope.question.body.categories.length == 0){
            $scope.message += "* Debe agregar algunas categorías a la pregunta.\n";
            complete = false;
        }else{
            for(var i=0; i<$scope.question.body.categories.length; i++){
                var category = $scope.question.body.categories[i];
                if(!category.name){
                    $scope.message += "* Asigne el nombre de la categoría " + (i+1) + "\n";
                    complete = false; 
                }
            }
        }

        return complete;
    }

    $scope.save = function(){
        if($scope.validate()){
            questionService.saveQuestion($scope.question,function(err){
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
        questionService.setCurrentQuestion(null);
        questionService.resetIndexes();
    }

    $scope.conceptListener = {
        clone:true,
        itemMoved:function(event){
            var array = event.dest.sortableScope.modelValue;
            var index = event.dest.index;
            var element = array[index];
            
            for (var i=0; i<array.length; i++){
                if(index != i){
                    if(element.index == array[i].index){
                        array.splice(i,1);
                        i = array.length;
                    }
                }
            }
        }
    }

    $scope.categoryListener = {
        accept:true
    }
});