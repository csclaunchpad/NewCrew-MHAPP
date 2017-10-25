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
	
	.when("/resources", {
		controller: "ResourcesCtrl",
		templateUrl: "partials/resources/resources.html"
	})

	.when("/resources/employee", {
		templateUrl: "partials/resources/employee.html"
	})

	.when("/resources/employeeFamily", {
		templateUrl: "partials/resources/employeeFamily.html"
	})

	.when("/resources/public", {
		templateUrl: "partials/resources/employeeFamily.html"
	})
	
	.when("/checkinLog", {
		controller: "CheckinLogCtrl",
		templateUrl: "partials/checkinLog.html",
        resolve: {
            entryList: ["$rootScope", "queryService", entryListResolve]
        }
	})
	
	.when("/checkinLogInfo/:id", {
		controller: "CheckinLogInfoCtrl",
		templateUrl: "partials/checkinLogInfo.html",
        resolve: {
            entryList: ["$rootScope", "queryService", entryListResolve]
        }
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

	.when("/dailyEntry", {
		controller: "DailyEntry",
		templateUrl: "partials/dailyEntry.html"
	})
    
    // Whenever none of the above .when method calls occur, run this .otherwise method instead (This should always be the application's initial landing page)
	.otherwise({redirectTo: "/home"});



	function entryListResolve($rootScope, queryService){
        return queryService.selectQuery("*", "wellnessTrackerEntries", "").then(function(response) {
            $rootScope.entries = response.data;

            // Calculating the total scores (This SHOULD be done in the DB - Justin)
            for(var i = 0; i < $rootScope.entries.length; i++) {
                var entry = $rootScope.entries[i];
                entry.entryScore = (parseInt(entry.happinessScore) + parseInt(entry.sleepScore)) * 5;
                entry.date = new Date(entry.dateEntered);
            }

            return $rootScope.entries;
        });
	}
}]);
