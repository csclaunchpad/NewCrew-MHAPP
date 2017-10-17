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
    
    .when("/sqlTester", {
    	controller: "SqlTesterCtrl",
    	templateUrl: "partials/sqlTester.html"
    })
	
	.when("/toolStore", {
		controller: "ToolStoreCtrl",
		templateUrl: "partials/toolStore.html"
	})
	
	.when("/moreDetails", {
		controller: "MoreDetailsCtrl",
		templateUrl: "partials/moreDetails.html"
	})
	
	.when("/checkinLog", {
		controller: "CheckinLogCtrl",
		templateUrl: "partials/checkinLog.html"
	})
	
	.when("/checkinLogInfo", {
		controller: "CheckinLogInfoCtrl",
		templateUrl: "partials/checkinLogInfo.html"
	})
	
	.when("/diary", {
		controller: "DiaryCtrl",
		templateUrl: "partials/diary.html"
	})
	
	.when("/diaryManager", {
		controller: "DiaryManagerCtrl",
		templateUrl: "partials/diaryManager.html"
	})
	
	.when("/analyticDashboard", {
		controller: "analyticDashboardCtrl",
		templateUrl: "partials/analyticDashboard.html"
	})
    
    // Whenever none of the above .when method calls occur, run this .otherwise method instead (This should always be the application's initial landing page)
	.otherwise({redirectTo: "/home"});
}]);
