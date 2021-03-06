angular
.module('questionControllers')
.controller('sorting',function($scope,questionService){
    $scope.success = false;
    $scope.message = "";
    $scope.gallery = null;
    $scope.question = null;

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

    questionService.getQuestionData('sorting',function(err,question){
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
            case 'answer':
                if(angular.isNumber($scope.editor.index)){
                    $scope.editor.text = $scope.question.body.answer[$scope.editor.index].text;
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
            case 'answer':
                if(angular.isNumber($scope.editor.index)){  
                    $scope.question.body.answer[$scope.editor.index].text = $scope.editor.text;
                }else{
                    $scope.question.body.answer.push({index:questionService.newIndex(),'text':$scope.editor.text});
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

    $scope.add = function(section,element){
        switch(section){
            case 'attachment':
                $scope.question.attachment = element;
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
            case 'answer':
                questionService.removeIndex($scope.question.body.answer[index].index);
                $scope.question.body.answer.splice(index,1);
                break;
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
        if($scope.question.body.answer.length == 0){
            $scope.message += "* Asigne los elementos a ordenar.\n";
            complete = false;
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

    $scope.answersListener = {
        accept:function(src,dst){return true}
    }
});