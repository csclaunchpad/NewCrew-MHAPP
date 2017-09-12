"use strict";

// This file contains all functionality that goes along with a page. The controller that goes along with a page is defined in app.js

var app = angular.module("zenApp.controllers", ['ngRoute', 'ngMaterial']);

//------------------ Home Controller --------------------
app.controller('HomeCtrl', ['$scope', function($scope){
}]);

//------------------ SideNav Controller --------------------
app.controller('SideNav', function ($scope, $timeout, $mdSidenav, $log) {
	
	// When called, the sideNav's sliding will be toggled
	$scope.toggleLeft = buildDelayedToggler('left');
    
	// Returns whether the sideNav is open or not
	$scope.isOpenLeft = function(){
    	return $mdSidenav('left').isOpen();
    };
	
    // When given a function, the function will continue to operate until the time is up
	function debounce(func, wait, context) {
		var timer;

		return function debounced() {
			var context = $scope, args = Array.prototype.slice.call(arguments);
			$timeout.cancel(timer);
			timer = $timeout(function() {
					timer = undefined;
					func.apply(context, args);
			}, wait || 10);
		};
	}
	
	// Responsible for sideNav's slide via Angular's $mdSidenav(id).toggle() method
	function buildDelayedToggler(navID) {
		return debounce(function() {
			$mdSidenav(navID).toggle().then(function () {
				$log.debug("toggle " + navID + " is done");
			});
		}, 200);
	}
	
	// Closes the sideNav by using Angular's $mdSidenav(id).close() method
	$scope.closeLeft = function () {
		$mdSidenav('left').close().then(function () {
			$log.debug("close LEFT is done");
        });
    };
});

//------------------ sqlTester Controller --------------------
app.controller('SqlTesterCtrl', ['$scope', function($scope){
	
	/* To-do List
	/	1. Error Handling
	/	2. Clean up how data is retrieved
	/	3. Handle Success/Failed cases better
	*/
	
	//Storage options for Select Queries
	$scope.selectQueryValues = {
		selectStatement: '',
		fromStatement: '',
		whereStatement: ''
	};
	
	//Storage options for Update Queries
	$scope.updateQueryValues = {
		updateStatement: '',
		setStatement: '',
		whereStatement: ''
	};
	
	//Storage options for Insert Queries
	$scope.insertQueryValues = {
		insertStatement: '',
		columnStatement: '',
		valueStatement: ''
	};
	
	//Storage options for Delete Queries
	$scope.deleteQueryValues = {
		tableStatement: '',
		whereStatement: ''
	};
	
	//Drop down options
	$scope.options = ['Select', 'Update', 'Insert', 'Delete'];
	
	// Function that is called via button on sqlTester.html
	$scope.runSelectQuery = function(inputSelectStatement, inputFromStatement, inputWhereStatement) {
		
		//Given the select, from, and where statements, returns a promise, also sets $scope.response to the data returned from the query
		$scope.selectQuery(inputSelectStatement, inputFromStatement, inputWhereStatement).then(function() {
			
			//Storing the response's data (I.E the query results)
			$scope.query = $scope.response.data;
			
			//Storing the keys from the query statement
			$scope.keys = Object.keys($scope.query[0]);		
		});
	};
	
	// Function that is called via button on sqlTester.html
	$scope.runUpdateQuery = function(inputUpdateStatement, inputSetStatement, inputWhereStatement) {
		
		// Given the update, set, and where statement: runs the supplied query and returns a promise, also sets $scope.response to true/false depending on success/failure
		$scope.updateQuery(inputUpdateStatement, inputSetStatement, inputWhereStatement).then(function() {
		});
	};
	
	// Function that is called via button on sqlTester.html
	$scope.runInsertQuery = function(inputInsertStatement, inputColumnStatement, inputValueStatement) {
		
		// Given the table name, columns, and values to be inserted: runs the supplied query and returns a promise, also sets $scope.response to true/false depending on success/failure
		$scope.insertQuery(inputInsertStatement, inputColumnStatement, inputValueStatement).then(function() {
			console.log($scope.response);
		})
	}
	
	// Function that is called via button on sqlTester.html
	$scope.runDeleteQuery = function(inputTableStatement, inputWhereStatement) {
		
		// Given the table name, columns, and values to be inserted: runs the supplied query and returns a promise, also sets $scope.response to true/false depending on success/failure
		$scope.deleteQuery(inputTableStatement, inputWhereStatement).then(function() {
			console.log($scope.response);
		})
	}
}]);

//------------------ toolStore Controller --------------------
app.controller('ToolStoreCtrl', ['$scope', '$window', function($scope, $window){
	
	/* Things to do: 
	// 1. Add "Add to toolbelt" Button
	// 2. Add picture ability for tools
	// 3. Hide Tools if they're already a part of the user's toolbelt
	*/
	
	// Fetch all the Tools
	$scope.selectQuery("*", "tools", "").then(function() {
		$scope.tools = $scope.response.data;
		console.log($scope.tools);
	})
	
	// Place holder addTool to toolBelt function
	$scope.addTool = function(toolID) {
		console.log(toolID);
	}
	
	// Caches the selected tool's ID, and redirects to our autofilled moreDetails page
	$scope.moreDetails = function(toolID) {
		localStorage.setItem("selectedToolID", toolID);
		$window.location.href= "#/moreDetails";
	}
	
}]);

//------------------ checkinLog Controller --------------------
app.controller('CheckinLogCtrl', ['$scope', '$window', function($scope, $window){
	
	// Fetch all wellnessTrackerEntries
	$scope.selectQuery("*", "wellnessTrackerEntries", "").then(function() {
		$scope.entries = $scope.response.data;
		console.log($scope.entries);
		
		// Calculating the total scores (This SHOULD be done in the DB - Justin)
		for(var i = 0; i < $scope.entries.length; i++) {
			console.log($scope.entries[i].happinessScore);
			console.log(parseInt($scope.entries[i].happinessScore));
			$scope.entries[i].entryScore = (parseInt($scope.entries[i].happinessScore) + parseInt($scope.entries[i].sleepScore)) * 5;
		}
	});
	
	// Redirect method for checkinLog.html -> checkinLogInfo.html, also stores the selected tool ID in localstorage
	$scope.redirectMoreDetails = function(entryID) {
		localStorage.setItem("selectedEntryID", entryID);
		$window.location.href= "#/checkinLogInfo";
	}
}]);

//------------------ checkinLogInfo Controller (Unfinished)--------------------
app.controller('CheckinLogInfoCtrl', ['$scope', '$window', '$document', function($scope, $window, $document){

	// Check if the user is coming from checkinLog.html, if not, redirect to home
	if(localStorage.getItem("selectedEntryID") == null) {
		$window.location.href= "#/home";
	} 
	
	// Grabbing the individual entry that the user selected on checkinLog.html
	var whereClause = "entryID = '" + localStorage.getItem("selectedEntryID") + "'";
	
	$scope.selectQuery("*", "wellnessTrackerEntries", whereClause).then(function() {
		
		$scope.selectedEntry = $scope.response.data[0];
		
		// Generating the selected log's score
		$scope.selectedEntry.entryScore = (parseInt($scope.selectedEntry.happinessScore) + parseInt($scope.selectedEntry.sleepScore)) * 5;
		
		// Grabbing the values from the past week (Starting date being the date of the log that was selected)
		whereClause = "(dateEntered >= DATETIME('" + $scope.selectedEntry.dateEntered + "', '-6 days') AND dateEntered <= DATETIME('" + $scope.selectedEntry.dateEntered + "')) ORDER BY dateEntered";
		
		// Weekly Linegraphs
		$scope.selectQuery("*", "wellnessTrackerEntries", whereClause).then(function() {
			$scope.weeklyEntries = $scope.response.data;
			console.log($scope.weeklyEntries);
			
			// Setting up the objects
			
			// Labels for graph
			var weeklyLabels = []
			var happinessScoreWeekly = [];
			var sleepScoreWeekly = [];
			
			for(var i = 0; i < $scope.weeklyEntries.length; i++) {
				weeklyLabels[i] = $scope.weeklyEntries[i].dateEntered;
				happinessScoreWeekly[i] = $scope.weeklyEntries[i].happinessScore;
				sleepScoreWeekly[i] = $scope.weeklyEntries[i].sleepScore;
			}		
			
			// Happiness Chart Weekly
			var chartHappinessWeekly = new Chart(document.getElementById("line-chartHappinessWeekly").getContext('2d'), {
			
			type: 'line',
			data: {
				labels: weeklyLabels,
				datasets: [{ 
						data: happinessScoreWeekly,
						label: "Happiness Score",
						borderColor: "#3e95cd",
						fill: false
				}]
			},
				options: {
					title: {
						display: true,
						text: 'Wellness Trend'
					}
				}
			});
			
			// Sleep Chart Weekly
			var chartSleepWeekly = new Chart(document.getElementById("line-chartSleepWeekly").getContext('2d'), {
			
			type: 'line',
			data: {
				labels: weeklyLabels,
				datasets: [{ 
						data: sleepScoreWeekly,
						label: "Sleep Score",
						borderColor: "#3e95cd",
						fill: false
				}]
			},
				options: {
					title: {
						display: true,
						text: 'Wellness Trend'
					}
				}
			});
			
			// Setup Weekly Average values
			
			// Weekly Happiness
			$scope.weeklyHappinessAverage = 0;
			
			for(var i = 0; i < happinessScoreWeekly.length; i++) {
				$scope.weeklyHappinessAverage = $scope.weeklyHappinessAverage + parseInt(happinessScoreWeekly[i]);
			}
			
			$scope.weeklyHappinessAverage = $scope.weeklyHappinessAverage/happinessScoreWeekly.length;
			$scope.weeklyHappinessAverage = $scope.weeklyHappinessAverage.toFixed(1);
			
			// Weekly Sleep
			$scope.weeklySleepAverage = 0;
			
			for(var i = 0; i < sleepScoreWeekly.length; i++) {
				$scope.weeklySleepAverage = $scope.weeklySleepAverage + parseInt(sleepScoreWeekly[i]);
			}
			
			$scope.weeklySleepAverage = $scope.weeklySleepAverage/sleepScoreWeekly.length;
			$scope.weeklySleepAverage = $scope.weeklySleepAverage.toFixed(1);
		});
		
		whereClause = "(dateEntered >= DATETIME('" + $scope.selectedEntry.dateEntered + "', '-30 days') AND dateEntered <= DATETIME('" + $scope.selectedEntry.dateEntered + "')) ORDER BY dateEntered";
		
		// Monthly Graphs
		$scope.selectQuery("*", "wellnessTrackerEntries", whereClause).then(function() {
			$scope.monthlyEntries = $scope.response.data;
			console.log($scope.entries);
			
			// Setting up the objects
			
			// Labels for graph
			var monthlyLabels = []
			var happinessScoreMonthly = [];
			var sleepScoreMonthly = [];
			
			for(var i = 0; i < $scope.monthlyEntries.length; i++) {
				monthlyLabels[i] = $scope.monthlyEntries[i].dateEntered;
				happinessScoreMonthly[i] = $scope.monthlyEntries[i].happinessScore;
				sleepScoreMonthly[i] = $scope.monthlyEntries[i].sleepScore;
			}		
			
			// Set up Monthly Happiness Graph
			var chartHappinessMonthly = new Chart(document.getElementById("line-chartHappinessMonthly").getContext('2d'), {
			
			type: 'line',
			data: {
				labels: monthlyLabels,
				datasets: [{ 
						data: happinessScoreMonthly,
						label: "Happiness Score",
						borderColor: "#3e95cd",
						fill: false
				}]
			},
				options: {
					title: {
						display: true,
						text: 'Wellness Trend'
					}
				}
			});
			
			// Set up Monthly Sleep Graph
			var chartSleepMonthly = new Chart(document.getElementById("line-chartSleepMonthly").getContext('2d'), {
			
			type: 'line',
			data: {
				labels: monthlyLabels,
				datasets: [{ 
						data: sleepScoreMonthly,
						label: "Sleep Score",
						borderColor: "#3e95cd",
						fill: false
				}]
			},
				options: {
					title: {
						display: true,
						text: 'Wellness Trend'
					}
				}
			});
			
			// Setup Monthly Average values
			
			// Monthly Happiness
			$scope.monthlyHappinessAverage = 0;
			
			for(var i = 0; i < happinessScoreMonthly.length; i++) {
				$scope.monthlyHappinessAverage = $scope.monthlyHappinessAverage + parseInt(happinessScoreMonthly[i]);
			}
			
			$scope.monthlyHappinessAverage = $scope.monthlyHappinessAverage/happinessScoreMonthly.length;
			$scope.monthlyHappinessAverage = $scope.monthlyHappinessAverage.toFixed(1);
			
			// Monthly Sleep
			$scope.monthlySleepAverage = 0;
			
			for(var i = 0; i < sleepScoreMonthly.length; i++) {
				$scope.monthlySleepAverage = $scope.monthlySleepAverage + parseInt(sleepScoreMonthly[i]);
			}
			
			$scope.monthlySleepAverage = $scope.monthlySleepAverage/sleepScoreMonthly.length;
			$scope.monthlySleepAverage = $scope.monthlySleepAverage.toFixed(1);
			
		});
		
		whereClause = "(dateEntered >= DATETIME('" + $scope.selectedEntry.dateEntered + "', '-90 days') AND dateEntered <= DATETIME('" + $scope.selectedEntry.dateEntered + "')) ORDER BY dateEntered";
		
		// Quarterly Graphs
		$scope.selectQuery("*", "wellnessTrackerEntries", whereClause).then(function() {
			$scope.quarterlyEntries = $scope.response.data;
			console.log($scope.entries);
			
			// Setting up the objects
			
			// Labels for graph
			var quarterlyLabels = []
			var happinessScoreQuarterly = [];
			var sleepScoreQuarterly = [];
			
			for(var i = 0; i < $scope.quarterlyEntries.length; i++) {
				quarterlyLabels[i] = $scope.quarterlyEntries[i].dateEntered;
				happinessScoreQuarterly[i] = $scope.quarterlyEntries[i].happinessScore;
				sleepScoreQuarterly[i] = $scope.quarterlyEntries[i].sleepScore;
			}		
			
			// Set up Weekly Happiness Graph
			var chartHappinessQuarterly = new Chart(document.getElementById("line-chartHappinessQuarterly").getContext('2d'), {
			
			type: 'line',
			data: {
				labels: quarterlyLabels,
				datasets: [{ 
						data: happinessScoreQuarterly,
						label: "Happiness Score",
						borderColor: "#3e95cd",
						fill: false
				}]
			},
				options: {
					title: {
						display: true,
						text: 'Wellness Trend'
					}
				}
			});
			
			// Set up Weekly Sleep Graph
			var chartSleepQuarterly = new Chart(document.getElementById("line-chartSleepQuarterly").getContext('2d'), {
			
			type: 'line',
			data: {
				labels: quarterlyLabels,
				datasets: [{ 
						data: sleepScoreQuarterly,
						label: "Sleep Score",
						borderColor: "#3e95cd",
						fill: false
				}]
			},
				options: {
					title: {
						display: true,
						text: 'Wellness Trend'
					}
				}
			});
			
			// Setup Quarterly Average values
			
			// Quarterly Happiness
			$scope.quarterlyHappinessAverage = 0;
			
			for(var i = 0; i < happinessScoreQuarterly.length; i++) {
				$scope.quarterlyHappinessAverage = $scope.quarterlyHappinessAverage + parseInt(happinessScoreQuarterly[i]);
			}
			
			$scope.quarterlyHappinessAverage = $scope.quarterlyHappinessAverage/happinessScoreQuarterly.length;
			$scope.quarterlyHappinessAverage = $scope.quarterlyHappinessAverage.toFixed(1);
			
			// Quarterly Sleep
			$scope.quarterlySleepAverage = 0;
			
			for(var i = 0; i < sleepScoreQuarterly.length; i++) {
				$scope.quarterlySleepAverage = $scope.quarterlySleepAverage + parseInt(sleepScoreQuarterly[i]);
			}
			
			$scope.quarterlySleepAverage = $scope.quarterlySleepAverage/sleepScoreQuarterly.length;
			$scope.quarterlySleepAverage = $scope.quarterlySleepAverage.toFixed(1);
			
		});		
	});
}]);

//------------------ App Controller --------------------
app.controller('ZenAppCtrl', ['$scope', '$http', function($scope, $http) {

	// Does an HTTP GET request to our DB and runs the supplied SELECT statement, then returns a promise
	$scope.selectQuery = function(inputSelectStatement, inputFromStatement, inputWhereStatement) {
		return $http({
			method: 'GET',
			url: '../php/selectQuery.php',
			params: {selectStatement: inputSelectStatement, fromStatement: inputFromStatement, whereStatement: inputWhereStatement}
		}).then(function(response) {
			// Storing the response
			$scope.response = angular.fromJson(response);
		});
	}
	
	// Does an HTTP GET request to our DB and runs the supplied UPDATE statement, then returns a promise
	$scope.updateQuery = function(inputUpdateStatement, inputSetStatement, inputWhereStatement) {
		return $http({
			method: 'GET',
			url: '../php/updateQuery.php',
			params: {updateStatement: inputUpdateStatement, setStatement: inputSetStatement, whereStatement: inputWhereStatement}
		}).then(function(response) {
			
			// Checks for an array in the data, if there is, the update request was a success
			if (Array.isArray(angular.fromJson(response).data)) {
				$scope.response = true;
			} else {
				$scope.response = false;
			}
		})
	}
	
	// Does an HTTP GET request to our DB and runs the supplied INSERT statement, then returns a promise
	$scope.insertQuery = function(inputInsertStatement, inputColumnStatement, inputValueStatement) {
		return $http({
			method: 'GET',
			url: '../php/insertQuery.php',
			params: {insertStatement: inputInsertStatement, columnStatement: inputColumnStatement, valueStatement: inputValueStatement}
		}).then(function(response) {
			
			// Checks for an array in the data, if there is, the update request was a success
			if (Array.isArray(angular.fromJson(response).data)) {
				$scope.response = true;
			} else {
				$scope.response = false;
			}
		})
	}
	
	// Does an HTTP GET request to our DB and runs the supplied INSERT statement, then returns a promise
	$scope.deleteQuery = function(inputTableStatement, inputWhereStatement) {
		return $http({
			method: 'GET',
			url: '../php/deleteQuery.php',
			params: {tableStatement: inputTableStatement, whereStatement: inputWhereStatement}
		}).then(function(response) {
			
			// Checks for an array in the data, if there is, the update request was a success
			if (Array.isArray(angular.fromJson(response).data)) {
				$scope.response = true;
			} else {
				$scope.response = false;
			}
		})
	}
}]);
