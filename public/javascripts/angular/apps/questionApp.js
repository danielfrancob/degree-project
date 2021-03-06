angular
.module('questionApp',['ngRoute','questionControllers'])
.config(function($routeProvider,$locationProvider){
	$routeProvider
	.when('/',{
		controller:'bank',
		templateUrl:'/question/bank'
	})
    .when('/common-base/form',{
        controller:'common-base',
        templateUrl:'/question/template/common-base/form'
    })
    .when('/common-base/view',{
        controller:'viewer',
        templateUrl:'/question/template/common-base/viewer'
    })
    .when('/matching/form',{
        controller:'matching',
        templateUrl:'/question/template/matching/form'
    })
    .when('/matching/view',{
        controller:'viewer',
        templateUrl:'/question/template/matching/viewer'
    })
    .when('/multiplechoice/form',{
        controller:'multiplechoice',
        templateUrl:'/question/template/multiplechoice/form'
    })
    .when('/multiplechoice/view',{
        controller:'viewer',
        templateUrl:'/question/template/multiplechoice/viewer'
    })
    .when('/sorting/form',{
        controller:'sorting',
        templateUrl:'/question/template/sorting/form'        
    })
    .when('/sorting/view',{
        controller:'viewer',
        templateUrl:'/question/template/sorting/viewer'        
    })
    .when('/true-false/form',{
        controller:'true-false',
        templateUrl:'/question/template/true-false/form'        
    })
    .when('/true-false/view',{
        controller:'viewer',
        templateUrl:'/question/template/true-false/viewer'        
    })    
    .otherwise({redirectTo:'/'});

    $locationProvider.html5Mode({
        enabled:true,
        requireBase:true
    });
});