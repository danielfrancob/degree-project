angular
.module('recordApp',['ngRoute','recordControllers'])
.config(function($routeProvider,$locationProvider){
    $routeProvider
    .when('/',{
        controller:'list',
        templateUrl:'/record/template/teacher-list'
    })
    .when('/assessment',{
        controller:'assessment',
        templateUrl:'/record/template/assessment'
    })
    .when('/assessment/student',{
        controller:'student',
        templateUrl:'/record/template/teacher-single'
    })
    .otherwise({redirectTo:'/'});

    $locationProvider.html5Mode({
        enabled:true,
        requireBase:true
    });
});