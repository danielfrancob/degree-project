angular
.module('assessmentControllers')
.controller('viewer',function($scope,assessmentService){
    $scope.message = "";
    $scope.assessment = "";
    $scope.score = 0;
    $scope.question = {
        index:null,
        subindex:null
    }

    assessmentService.getAssessmentData(function(err,assessment,score){
        if(err){
            $scope.message = "Ha ocurrido un problema en el sistema. Recargue esta página por favor.";
        }else{
            $scope.assessment = assessment;
            $scope.score = score;
        }
    });

    $scope.setQuestion = function(index,subindex){
        $scope.question.index = index;
        $scope.question.subindex = subindex;
    }

    $scope.clear = function(){
        assessmentService.setCurrentAssessment(null);
    }
});