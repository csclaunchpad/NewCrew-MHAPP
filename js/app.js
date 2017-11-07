"use strict";

var app = angular.module("zenApp", ["ngRoute", "zenApp.controllers"]);

//When the appropriate URL is present, inject the file indicated by it's templateUrl property into ng-view in index.html (Which is always displayed)
app.config(["$routeProvider", function($routeProvider) {
		
	$routeProvider
	
	// routeProvider for partials/home.html
	.when("/home", {
		controller: "HomeCtrl",
        templateUrl: "partials/home.html"  //Change by JW -cooment by TJ- May need to be Language splash page.
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
<<<<<<< HEAD

	.when("/sleepTool", {
		controller: "SleepTool",
		templateUrl: "partials/sleepTool.html"
	})

    .when("/panicTool", {
		controller: "PanicTool",
		templateUrl: "partials/panicTool.html"
	})
	
	.when("/dietTool", {
		controller: "DietTool",
		templateUrl: "partials/dietTool.html"
	})
	.when("/depressionTool", {
		controller: "DepressionTool",
		templateUrl: "partials/depressionTool.html"
	})
	
=======
	
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
    
>>>>>>> b28b272102c713731103449c22383463a0fad93b
    // Whenever none of the above .when method calls occur, run this .otherwise method instead (This should always be the application's initial landing page)
	.otherwise({redirectTo: "/home"});



	function entryListResolve($rootScope, queryService){
		
		if(localStorage.getItem("user") != "undefined") {
			var whereClause = "userID = '" + localStorage.getItem("user") + "' ORDER BY dateEntered DESC";
			return queryService.selectQuery("*", "wellnessTrackerEntries", whereClause).then(function(response) {
				$rootScope.entries = response.data;

				// Calculating the total scores (This SHOULD be done in the DB - Justin)
				for(var i = 0; i < $rootScope.entries.length; i++) {
					var entry = $rootScope.entries[i];
					entry.entryScore = ((parseInt(entry.moodScore) + parseInt(entry.sleepScore) + parseInt(entry.dietScore) + parseInt(entry.stressScore)) * 2.5).toFixed(0); //change by JW -comment by TJ- Adjusted to change face on total score for day with 2 new questions.
					entry.date = new Date(entry.dateEntered);
				}

				return $rootScope.entries;
			});
		}
	}
}]);
