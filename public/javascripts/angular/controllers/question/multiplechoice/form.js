angular
.module('questionControllers')
.controller('multiplechoice',function($scope,questionService){
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

    questionService.getQuestionData('multiplechoice',function(err,question){
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
            case 'options':
                if(angular.isNumber($scope.editor.index)){
                    $scope.editor.text = $scope.question.body.options[$scope.editor.index].text;
                }
                break;
            case 'answers':
                if(angular.isNumber($scope.editor.index)){
                    $scope.editor.text = $scope.question.body.answers[$scope.editor.index].text;
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
            case 'options':
                if(angular.isNumber($scope.editor.index)){
                    $scope.question.body.options[$scope.editor.index].text = $scope.editor.text;
                }else{
                    $scope.question.body.options.push({index:questionService.newIndex(),'text':$scope.editor.text});
                }
                break;
            case 'answers':
                if(angular.isNumber($scope.editor.index)){  
                    $scope.question.body.answers[$scope.editor.index].text = $scope.editor.text;
                }else{
                    $scope.question.body.answers.push({index:questionService.newIndex(),'text':$scope.editor.text});
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
            case 'options':
                questionService.removeIndex($scope.question.body.options[index].index);
                $scope.question.body.options.splice(index,1);
                break;
            case 'answers':
                questionService.removeIndex($scope.question.body.answers[index].index);
                $scope.question.body.answers.splice(index,1);
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
        if($scope.question.body.answers.length == 0){
            if($scope.question.body.options.length == 0){
                $scope.message += "* Asigne opciones a la pregunta.\n";
            }
            $scope.message += "* Asigne respuestas a la pregunta.\n";
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

    $scope.optionsListener = {
        accept:function(src,dst){return true}
    }

    $scope.answersListener = {
        accept:function(src,dst){return true}
    }
});