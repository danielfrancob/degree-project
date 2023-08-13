angular
.module('recordControllers')
.controller('student',function($scope,recordService){
    $scope.message = "";
    $scope.record = null;
    $scope.question = null;
    $scope.category = null;

    $scope.score_chart = {
        data:[],
        labels:["Resultado"],
        series:["Nota máxima","Nota para aprobar","Nota obtenida"],
        options:{
            legend:{
                display:true,
                position:'bottom'
            },
            scales:{
                yAxes:[{
                    ticks:{
                        min:0,
                        max:50
                    }
                }]
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

    recordService.getStudentRecord(function(err,record){
        if(err){
            $scope.message = "Ha ocurrido un error en el servidor. Recargue esta página por favor.";
        }else{
            $scope.record = record;
            $scope.score_chart.data = [[50],[30],[record.score]];
            for(var i=0; i<record.goals.length; i++){
                $scope.goal_chart.labels.push(record.goals[i].goal.name);
                $scope.goal_chart.data.push(record.goals[i].value);
            }
        }
    });

    $scope.setQuestion = function(question){
        $scope.question = question;
    }

    $scope.setCategory = function(category){
        $scope.category = category;
    }

    $scope.clear = function(){
        recordService.setStudentRecord(null);
    }
});