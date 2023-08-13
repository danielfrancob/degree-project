angular
.module('recordControllers')
.controller('assessment',function($scope,recordService){
    $scope.message = "";
    $scope.assessment = null;
    $scope.pattern = "";

    $scope.pass_chart = {
        data:[],
        labels:['Aprobados','Reprobados'],
        options:{
            legend:{
                display:true,
                position:'right'
            }
        }
    };

    $scope.goal_chart = {
        data:[],
        labels:[],
        options:{
            legend:{
                display:true,
                position:'bottom'
            },
            scale:{
                ticks:{
                    min:0,
                    max:100
                }
            }
        }
    };

    recordService.getAssessmentRecords(function(err,assessment){
        if(err){
            $scope.message = "Ha ocurrido un error en el servidor. Recargue esta página por favor.";
        }else{
            $scope.assessment = assessment;
            
            $scope.pass_chart.data.push(Math.floor(($scope.assessment.pass_count[0] * 100 / $scope.assessment.records.length) * 10) / 10);
            $scope.pass_chart.data.push(Math.floor(($scope.assessment.pass_count[1] * 100 / $scope.assessment.records.length) * 10) / 10);

            $scope.assessment.goals.forEach(function(goal){
                $scope.goal_chart.data.push(goal.score);
                $scope.goal_chart.labels.push(goal.name);
            });
        }
    });

    $scope.setRecord = function(id){
        recordService.setStudentRecord(id);
    }

    $scope.clear = function(){
        recordService.setAssessment(null);
    }
});