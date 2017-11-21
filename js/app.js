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

	.when("/resources/cscContacts", {
		templateUrl: "partials/resources/cscContacts.html"
	})	
	
	.when("/resources/employeeFamily", {
		templateUrl: "partials/resources/employeeFamily.html"
	})

	.when("/resources/public", {
		templateUrl: "partials/resources/public.html"
	})
	
	.when("/checkinLog", {
		controller: "CheckinLogCtrl",
		templateUrl: "partials/checkinLog.html",
        resolve: {
            entryList: ["$rootScope", "queryService", "scoreManager", entryListResolve]
        }
	})
	
	.when("/checkinLogInfo/:id", {
		controller: "CheckinLogInfoCtrl",
		templateUrl: "partials/checkinLogInfo.html",
        resolve: {
            entryList: ["$rootScope", "queryService", "scoreManager", entryListResolve]
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
	
	.when("/moreDetails", {
		controller: "MoreDetailsCtrl",
		templateUrl: "partials/moreDetails.html"
	})
	
	.when("/analyticDashboard", {
		controller: "analyticDashboardCtrl",
		templateUrl: "partials/analyticDashboard.html"
	})

	.when("/dailyEntry", {
		controller: "DailyEntry",
		templateUrl: "partials/dailyEntry.html"
	})

	.when("/sleepTool", { // Login Page: Added by TJ - 2017/11/07
		controller: "SleepTool",
		templateUrl: "partials/sleepTool.html"
	})

    .when("/panicTool", { // Login Page: Added by TJ - 2017/11/07
		controller: "PanicTool",
		templateUrl: "partials/panicTool.html"
	})
	
	.when("/dietTool", { // Login Page: Added by TJ - 2017/11/07
		controller: "DietTool",
		templateUrl: "partials/dietTool.html"
	})
	
	.when("/depressionTool", { // Login Page: Added by TJ - 2017/11/07
		controller: "DepressionTool",
		templateUrl: "partials/depressionTool.html"
	})
	
	.when("/login", { // Login Page: Added by JW - 2017/11/01
		controller: "LoginCtrl",
		templateUrl: "partials/login.html"
	})
	
	.when("/newUser", { // New User Page: Added by JW - 2017/11/01
		controller: "NewUserCtrl",
		templateUrl: "partials/newUser.html"
	})
	
	.when("/forgotPin", { // Forgot Pin Page: Added by JW - 2017/11/01
		controller: "ForgotPinCtrl",
		templateUrl: "partials/forgotPin.html"
	})
	
	.when("/anxiety101", { // Forgot Pin Page: Added by JW - 2017/11/21
		controller: "Anxiety101Ctrl",
		templateUrl: "partials/tools/anxiety101.html"
	})
	
	.when("/stress101", { // Forgot Pin Page: Added by JW - 2017/11/21
		controller: "Stress101Ctrl",
		templateUrl: "partials/tools/stress101.html"
	})
	
	.when("/depression101", { // Forgot Pin Page: Added by JW - 2017/11/21
		controller: "Depression101Ctrl",
		templateUrl: "partials/tools/depression101.html"
	})
    
    // Whenever none of the above .when method calls occur, run this .otherwise method instead (This should always be the application's initial landing page)
	.otherwise({redirectTo: "/home"});



	function entryListResolve($rootScope, queryService, scoreManager){
		
		if(localStorage.getItem("user") != "undefined") {
			var whereClause = "userID = '" + localStorage.getItem("user") + "' ORDER BY dateEntered DESC";
			return queryService.selectQuery("*", "wellnessTrackerEntries", whereClause).then(function(response) {
				$rootScope.entries = response.data;

				// Calculating the total scores (This SHOULD be done in the DB - Justin)
				for(var i = 0; i < $rootScope.entries.length; i++) {
					var entry = $rootScope.entries[i];
					entry.entryScore = ((parseInt(entry.moodScore) + parseInt(entry.sleepScore) + parseInt(entry.dietScore) + scoreManager.reverseScore(parseInt(entry.stressScore))) * 2.5).toFixed(0);
					entry.date = new Date(entry.dateEntered);
				}

				return $rootScope.entries;
			});
		}
	}
}]);
