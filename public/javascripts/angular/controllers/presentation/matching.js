angular
.module('presentationControllers')
.controller('matching',function($scope,presentationService){
    $scope.presentation = true;
    $scope.question = null;
    $scope.question_index = null;
    $scope.subquestion_index = null;
    $scope.resource = null;
    $scope.go_back = null;
    $scope.category = null;

    presentationService.getCurrentQuestion('matching',function(data,go_back){
        $scope.go_back = go_back;
        $scope.question = data.question;
        $scope.question_index = data.q;
        $scope.subquestion_index = data.s;
        $scope.resource = data.resource;

        $scope.question.body.concepts = $scope.question.body.concepts.sort(function() {return Math.random() - 0.5});
        
        if(data.answer.ans != null){
            $scope.question.body.categories = data.answer.ans;
        }else{
            $scope.question.body.categories.forEach(function(category){
                category.objects = [];
            });
        }
    });

    $scope.setCategory = function(category){
        $scope.category = category;
    }

    $scope.remove = function(section,index){
        if(angular.isNumber($scope.category)){
            $scope.question.body.categories[$scope.category].objects.splice(index,1);
        }
    }

    $scope.save = function(){
        var status = null;
        var complete = false;

        for(var i=0; i<$scope.question.body.categories.length; i++){
            if($scope.question.body.categories[i].objects.length > 0){
                complete = true;
                i = $scope.question.body.categories.length;
            }
        }

        if(complete == true){
            status = 'complete';
        }else{
            status = 'incomplete';
        }

        presentationService.saveAnswer($scope.question.body.categories,status);
    }

    $scope.previous = function(){
        $scope.save();        
        presentationService.previousQuestion();
    }

    $scope.next = function(){
        $scope.save();        
        presentationService.nextQuestion();
    }

    $scope.summary = function(){
        $scope.save();       
        presentationService.goToSummary();
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