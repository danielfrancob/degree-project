angular
.module('assessmentControllers')
.controller('form',function($scope,assessmentService){
    $scope.success = false;
    $scope.message = "";
    $scope.bank = null;
    $scope.assessment = null;
    $scope.question = {
        index:null,
        subindex:null
    }

    $scope.score = 0;
    $scope.validScore = true;

    assessmentService.getQuestionBank(function(err,bank){
        if(err){
            $scope.message = "Ha ocurrido un problema en el sistema. Recargue esta página por favor.";
        }else{
            $scope.bank = bank;
        }
    });

    assessmentService.getAssessmentData(function(err,assessment,score){
        if(err){
            $scope.message = "Ha ocurrido un problema en el sistema. Recargue esta página por favor.";
        }else{
            $scope.assessment = assessment;
            $scope.score = score;         
        }
    });

    $scope.add = function(section,item){
        switch(section){
            case 'goals':
                $scope.assessment.goals.push({index:$scope.assessment.goals.length,name:"",text:""});
                break;
            case 'questions':
                var exist = false;

                for(var i=0; i<$scope.assessment.questions.length; i++){
                    if($scope.assessment.questions[i].question._id == item._id){
                        exist = true;
                        i = $scope.assessment.questions.length;
                    }
                }

                if(!exist){
                    if(item.type == 'common-base'){
                        item.questions.forEach(function(question){
                            question.goals = [];
                            question.score = 0;
                        });
                        $scope.assessment.questions.push({question:JSON.parse(JSON.stringify(item))});
                    }else{
                        $scope.assessment.questions.push({question:JSON.parse(JSON.stringify(item)),goals:[],score:0});
                    }
                }
                break;
        }
    }

    $scope.remove = function(section,index){
        switch(section){
            case 'goal':
                if($scope.question.subindex != null){
                    $scope.assessment.questions[$scope.question.index].question.questions[$scope.question.subindex].goals.splice(index,1);
                }else{
                    $scope.assessment.questions[$scope.question.index].goals.splice(index,1);
                }
                break;
            case 'goals':
                $scope.assessment.questions.forEach(function(question){
                    if(question.question.type == "common-base"){
                        question.question.questions.forEach(function(subquestion){
                            for(var i=0; i<subquestion.goals.length; i++){
                                if(subquestion.goals[i].index == index){
                                    subquestion.goals.splice(i,1);
                                    i = subquestion.goals.length;
                                }
                            }
                        });
                    }else{
                        for(var i=0; i<question.goals.length; i++){
                            if(question.goals[i].index == index){
                                question.goals.splice(i,1);
                                i = question.goals.length;
                            }
                        }
                    }
                });
                $scope.assessment.goals.splice(index,1);
                break;
            case 'questions':
                $scope.assessment.questions.splice(index,1);
                $scope.calculateScore();
                break;
        }
    }

    $scope.setQuestion = function(index,subindex){
        $scope.question.index = index;
        $scope.question.subindex = subindex;
    }

    $scope.assignGoalToAllQuestions = function(goal){
        if($scope.assessment.questions){
            $scope.assessment.questions.forEach(function(question){
                if(question.question.type == "common-base"){
                    question.question.questions.forEach(function(subquestion){
                        var exist = false;
                        for(var i=0; i<subquestion.goals.length; i++){
                            if(subquestion.goals[i].index == goal.index){                                
                                i = subquestion.goals.length;
                                exist = true;
                            }
                        }
                        if(!exist){
                            subquestion.goals.push(goal);
                        }
                    });
                }else{
                    var exist = false;
                    for(var i=0; i<question.goals.length; i++){
                        if(question.goals[i].index == goal.index){
                            i = question.goals.length;
                            exist = true;
                        }
                    }
                    if(!exist){
                        question.goals.push(goal);
                    }
                }
            });
        }
    }

    $scope.validateGoals = function(){
        if($scope.assessment && $scope.assessment.goals){
            var complete = true;
            for(var i=0; i<$scope.assessment.goals.length; i++){
                var goal = $scope.assessment.goals[i];
                if(!goal.name || !goal.text){
                    complete = false;
                    i = $scope.assessment.goals.length;
                }
            }
            return complete;
        }else{
            return false;
        }
    }

    $scope.validateQuestions = function(){
        if($scope.assessment && $scope.assessment.questions){
            var complete = true;
            for(var q=0; q<$scope.assessment.questions.length; q++){
                var question = $scope.assessment.questions[q];
                if(question.question.type == 'common-base'){
                    for(var s=0; s<question.question.questions.length; s++){
                        var subquestion = question.question.questions[s];
                        if(subquestion.score == 0 || !subquestion.score || subquestion.goals.length == 0){
                            complete = false;
                            s = question.question.questions.length;
                            q = $scope.assessment.questions.length;
                        }
                    }
                }else{
                    if(question.score == 0 || !question.score || question.goals.length == 0){
                         complete = false;
                        q = $scope.assessment.questions.length;
                    }
                }
            }
            return complete;
        }else{
            return false;
        }
    }

    $scope.calculateScore = function(){
        $scope.score = 0;
        if($scope.assessment.questions.length > 0){
            $scope.assessment.questions.forEach(function(item){
                if(item.question.type == 'common-base'){
                    item.question.questions.forEach(function(subquestion){
                        $scope.score += subquestion.score;
                    });
                }else{
                    $scope.score += item.score;
                }
            });
        }
        $scope.score = $scope.score;
        $scope.validScore = isFinite($scope.score); 
    }

    $scope.validate = function(){
        $scope.message = "";
        var complete = true;

        if(!$scope.assessment.name){
            $scope.message += "* Asigne un nombre a la evaluación.\n";
            complete = false;
        }
        if(!$scope.assessment.password){
            $scope.message += "* Asigne una clave a la evaluación.\n";
            complete = false;
        }
        if($scope.assessment.goals.length == 0){
            $scope.message += "* Debe agregar al menos un logro.\n";
            complete = false;
        }else{
            for(var i=0; i<$scope.assessment.goals.length; i++){
                if(!$scope.assessment.goals[i].name || !$scope.assessment.goals[i].text){
                    $scope.message += "* Debe completar el nombre y/o texto para el logro " + (i+1) + "\n";
                    complete = false;
                }
            }
        }
        if($scope.assessment.questions.length == 0){
            $scope.message += "* Debe agregar al menos una pregunta.\n";
            complete = false;   
        }else{
            if($scope.score < 50){
                $scope.message += "* El puntaje de la evaluación es inferior a 50.\n";
                complete = false;  
            }

            for(var i=0; i<$scope.assessment.questions.length; i++){
                if($scope.assessment.questions[i].question.type == "common-base"){
                    for(var j=0; j<$scope.assessment.questions[i].question.questions.length; j++){
                        if($scope.assessment.questions[i].question.questions[j].score == 0){
                            $scope.message += "* El puntaje de la pregunta " + (i+1) + "." + (j+1) + " debe ser mayor a 0. \n";
                            complete = false;
                        }
                        if($scope.assessment.questions[i].question.questions[j].goals.length == 0){
                            $scope.message += "* Debe asignar al menos un logro a la pregunta " + (i+1) + "." + (j+1) + ".\n";
                            complete = false;                            
                        }
                    }
                }else{
                    if($scope.assessment.questions[i].score == 0){
                        $scope.message += "* El puntaje de la pregunta " + (i+1) + " debe ser mayor a 0. \n";
                        complete = false;                       
                    }
                    if($scope.assessment.questions[i].goals.length == 0){
                        $scope.message += "* Debe asignar al menos un logro a la pregunta " + (i+1) + ".\n";
                        complete = false;                          
                    }
                }
            }
        }

        return complete;
    }

    $scope.save = function(){
        if($scope.validate()){
            assessmentService.saveAssessment($scope.assessment,function(err){
                if(err){
                    $scope.message = "Ha ocurrido un problema en el sistema. Intente nuevamente.";
                }else{
                    $scope.success = true;
                }
            });
        }else{
            $scope.message = "Verifique lo siguiente:\n" + $scope.message;
        }
    }

    $scope.exit = function(){
        assessmentService.setCurrentAssessment(null);
    }

    $scope.assessmentListener = {
        accept:true
    }

    $scope.goalListener = {
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

    $scope.questionListener = {
        accept:true
    }
});