"use strict";

var app = angular.module("zenApp", ["ngRoute", "zenApp.controllers"]);

//When the appropriate URL is present, inject the file indicated by it's templateUrl property into ng-view in index.html (Which is always displayed)
app.config(["$routeProvider", function($routeProvider) {
		
	$routeProvider
	
	// routeProvider for partials/home.html
	.when("/home", {
		controller: "HomeCtrl",
        templateUrl: "partials/home.html"
    })
	
    // routeProvider for partials/page1.html
	.when("/page1", {
		controller: "Page1Ctrl",
        templateUrl: "partials/page1.html"
    })
	
    // routeProvider for partials/page2.html
	.when("/page2", {
		controller: "Page2Ctrl",
        templateUrl: "partials/page2.html"
    })
    
    .when("/sqlTester", {
    	controller: "SqlTesterCtrl",
    	templateUrl: "partials/sqlTester.html"
    })
    
    // Whenever none of the above .when method calls occur, run this .otherwise method instead (This should always be the application's initial landing page)
	.otherwise({redirectTo: "/home"});
}]);
