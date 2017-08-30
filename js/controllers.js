"use strict";

// This file contains all functionality that goes along with a page. The controller that goes along with a page is defined in app.js

var app = angular.module("zenApp.controllers", ['ngRoute', 'ngMaterial']);

//------------------ Page 1 Controller --------------------
app.controller('Page1Ctrl', ['$scope', function($scope){
}]);

//------------------ Page 2 Controller --------------------
app.controller('Page2Ctrl', ['$scope', function($scope){
}]);

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
	};
	
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
