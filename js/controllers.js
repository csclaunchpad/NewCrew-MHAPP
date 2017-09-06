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
			console.log($scope.response);
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

//------------------ moreDetails Controller --------------------
app.controller('HomeCtrl', ['$scope', function($scope){
}]);

//------------------ checkinLog Controller --------------------
app.controller('CheckinLogCtrl', ['$scope', '$window', function($scope, $window){
	
	// Fetch all wellnessTrackerEntries
	$scope.selectQuery("*", "wellnessTrackerEntries", "").then(function() {
		$scope.entries = $scope.response.data;
		console.log($scope.entries);
		
		// Calculating the total scores (This SHOULD be done in the DB - Justin)
		for(var i = 0; i < $scope.entries.length; i++) {
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

	/* To-do List
	/	1. Check viability of caching wellnessTrackerEntry
	/
	/
	*/

	// Check if the user is coming from checkinLog.html, if not, redirect to home
	if(localStorage.getItem("selectedEntryID") == null) {
		$window.location.href= "#/home";
	} 
	
	// Creates our where clause so we only grab the wellnessTrackerEntry that was selected
	var whereClause = "entryID = '" + localStorage.getItem("selectedEntryID") + "'";
	
	// Fetch the entry (Can this be done via localStorage? - Justin)
	$scope.selectQuery("*", "wellnessTrackerEntries", whereClause).then(function() {
		$scope.entry = $scope.response.data[0];
		
		// Calculating the total score (This SHOULD be done in the DB - Justin)
		$scope.entry.entryScore = (parseInt($scope.entry.happinessScore) + parseInt($scope.entry.sleepScore)) * 5;
	});
	
	// Happiness Chart
	angular.element(document).ready(function() {		
		var chartHappiness = new Chart(document.getElementById("line-chartHappiness").getContext('2d'), {
		
		type: 'line',
		data: {
			labels: ["Jul 1, 2017","Jul 1, 2017","Jul 2, 2017","Jul 3, 2017","Jul 4, 2017","Jul 5, 2017","Jul 6, 2017","Jul 7, 2017","Jul 8, 2017","Jul 9, 2017"],
			datasets: [{ 
					data: [6,6,8,7,10,9,7,5,3,7],
					label: "Mood",
					borderColor: "#3e95cd",
					fill: false
			}, { 
				data: [5,5,8,7,8,6,5,4,4,8],
				label: "Sleep",
				borderColor: "#8e5ea2",
				fill: false
			}, { 
				data: [4,4,5,6,8,2,6,1,2,3],
					label: "Diet",
					borderColor: "#3cba9f",
					fill: false
				}, 
				]
			},
			options: {
				title: {
					display: true,
					text: 'Wellness Trend'
				}
			}
		});
		
		var chartSleep = new Chart(document.getElementById("line-chartSleep").getContext('2d'), {
		
		type: 'line',
		data: {
			labels: ["Jul 1, 2017","Jul 1, 2017","Jul 2, 2017","Jul 3, 2017","Jul 4, 2017","Jul 5, 2017","Jul 6, 2017","Jul 7, 2017","Jul 8, 2017","Jul 9, 2017"],
			datasets: [{ 
					data: [6,5,7,7,10,9,7,5,3,7],
					label: "Mood",
					borderColor: "#3e95cd",
					fill: false
			}, { 
				data: [5,7,8,7,8,5,4,4,7,8],
				label: "Sleep",
				borderColor: "#8e5ea2",
				fill: false
			}, { 
				data: [4,4,5,6,8,2,6,1,2,3],
					label: "Diet",
					borderColor: "#3cba9f",
					fill: false
				}, 
				]
			},
			options: {
				title: {
					display: true,
					text: 'Wellness Trend'
				}
			}
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
