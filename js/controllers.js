"use strict";

// This file contains all functionality that goes along with a page. The controller that goes along with a page is defined in app.js

var app = angular.module("zenApp.controllers", ['ngRoute', 'ngMaterial', 'angular-carousel']);

//------------------ Home Controller --------------------
app.controller('HomeCtrl', ['$scope', '$window', "translationService", function($scope, $window, translationService){
	$scope.setLanguage = function(language) {
		localStorage.setItem("languageFlag", language);
		$window.location.href = "#/login";
	}
}]);

//------------------ Landing Page Controller --------------------
app.controller('LandingPageCtrl', ['$scope', "translationService", function($scope, $window, translationService){ // Added by JW 2017/11/10
	
}]);

//------------------ newUser Controller --------------------
app.controller('NewUserCtrl', ['$scope', '$window', "queryService", "translationService", function($scope, $window, queryService, translationService){
	
	// Any input the user can provide is stored in here
	$scope.userInput = {
		firstName: "",
		pin: "",
		gender: "",
		question: "",
		answer: ""
	}
	
	// Anything affecting the front-end is stored here
	$scope.pageElements = translationService.translate("newUser.html")
	
	// Method that is called the user clicks the "Submit" button
	$scope.submitUser = function() {
		
		// If the user has filled in the required information, continue..
		if($scope.userInput.firstName != "" && $scope.userInput.pin != "" && $scope.userInput.pin.length >= 3 && $scope.userInput.gender != "" && $scope.userInput.question != "" && $scope.userInput.answer != "") {
			
			// Check to see if the username or pin is already taken, if so, display the appropriate text, otherwise, continue
			var whereClause = "passcode = '" + $scope.userInput.pin + "' OR firstName = '" + $scope.userInput.firstName + "'";
			queryService.selectQuery("*", "users", whereClause).then( function(response) {
				if(response.data.length == 0) {
				
					// Gender variable that'll be entered in the DB, since our DB supports "M", "F, or "O"
					var genderBackend = "";
				
					if($scope.userInput.gender === "Male") {
						genderBackend = "M";
					} else if($scope.userInput.gender === "Female") {
						genderBackend = "F";
					} else {
						genderBackend = "O";
					}
					
					// Enter the user into our users table
					var valueStatement = "(SELECT IFNULL(MAX(userID), 0) + 1 FROM users), lower('" + $scope.userInput.firstName + "'), '" + $scope.userInput.pin + "', lower('" + genderBackend + "'), lower('" + $scope.userInput.question + "'), lower('" + $scope.userInput.answer + "')";
					queryService.insertQuery("users", "userID, firstName, passcode, gender, question, answer", valueStatement).then( function(response) {
						$window.location.href = "#/checkinLog";
					});
				} else {
					$scope.pageElements.invalidPin = true;
				}
			});
		}
	}
	
}]);

//------------------ ForgotPin Controller --------------------
app.controller('ForgotPinCtrl', ['$scope', '$window', "queryService", "translationService", function($scope, $window, queryService, translationService){
	
	// Any input the user can provide is stored in here
	$scope.userInput = {
		firstName: "",
		answer: "",
		pin: "",
		input: ""
	}
	
	// Anything affecting the front-end is stored here
	$scope.pageElements = translationService.translate("forgotMyPin.html");
	
	// Method that is called when the user clicks the "Submit" Button
	$scope.submitInput = function() {
		
		// Reset all of our page elements
		$scope.pageElements.invalidName = false;
		$scope.pageElements.invalidAnswer = false;
		$scope.pageElements.invalidPin = false;
		
		// Check the phase, and continue to the appropriate loop
		if($scope.pageElements.phase1) {
			
			/* Phase 1 - Find the name
				1. Analyze the name the user gave
				2. Check to see if there is a user with that name
				3. If found, store all that user's info so we can use it in the future
				4. Initilize Phase 2
			*/
			
			// Check to see if there is a user with the provided name
			var whereClause = "lower(firstName) = lower('" + $scope.userInput.firstName + "')";
			queryService.selectQuery("*", "users", whereClause).then( function(response) {
				
				// If no, display the appropriate text
				if(response.data.length === 0) {
					$scope.pageElements.invalidName = true;
				
				// If yes, store all the user's info, and continue to phase 2
				} else {
					$scope.userID = response.data[0].userID;
					$scope.firstName = response.data[0].firstName;
					$scope.question = response.data[0].question;
					$scope.answer = response.data[0].answer;
					$scope.pageElements.phase1 = false;
					$scope.pageElements.phase2 = true;
				}
			});
		} else if($scope.pageElements.phase2) {
			
			/* Phase 2 - Answer the security question
				1. Since $scope.pageElements.phase2 was set to false, display the question and answer textbox
				2. Take in answer
				3. Compare the answer to the actual answer
			*/
			
			// If the answer is correct, initilize phase 3
			if($scope.userInput.answer.toLowerCase() == $scope.answer) {
				$scope.pageElements.phase2 = false;
				$scope.pageElements.phase3 = true;
				
			// If the answer isn't corrct, display the appropriate text
			} else {
				$scope.pageElements.invalidAnswer = true;
			}
		
		} else if($scope.pageElements.phase3) {
			
			/* Phase 3 - Enter the new pin for the user
				1. Take in the pin, the length is handled by the input element itself
				2. Submit the update query to our users table
			*/
			
			if($scope.userInput.pin.length >= 4) {
				var setClause = "passcode = '" + $scope.userInput.pin + "'";
				var whereClause = "userID = '" + $scope.userID + "'";
				queryService.updateQuery("users", setClause, whereClause).then( function() {
					$window.location.href = "#/login";
				});
			} else {
				$scope.pageElements.invalidPin = true;
			}
		}
	}
	
	// Add the number given to the pin field if the length is under 6
	$scope.addNumbers = function(number) {
		if($scope.userInput.pin.length < 6) {
			$scope.userInput.pin+=number;
		}
	}
	
	// Remove the last number added to pin
	$scope.removeNumbers = function() {
		if($scope.userInput.pin.length != "") {
			$scope.userInput.pin = $scope.userInput.pin.substring(0, $scope.userInput.pin.length-1);
		}
	}
}]);

//------------------ Login Controller --------------------
app.controller('LoginCtrl', ['$scope', '$rootScope', '$window', "queryService", "translationService", function($scope, $rootScope, $window, queryService, translationService){
	
	// Check to see if a user is already logged in, if so, redirect them to the landing page.
	if(localStorage.getItem("user") != null) $window.location.href = "#/checkinLog";
	
	// Anything affecting the front-end is stored here
	$scope.pageElements = translationService.translate("login.html");

	// Any input the user can provide is stored in here
	$scope.userInput = {
		pin: ""
	}
	
	// Add the number given to the pin field if the length is under 6
	$scope.addNumbers = function(number) {
		if($scope.userInput.pin.length < 6) {
			$scope.userInput.pin+=number;
		}
	}
	
	// Remove the last number added to pin
	$scope.removeNumbers = function() {
		if($scope.userInput.pin.length != "") {
			$scope.userInput.pin = $scope.userInput.pin.substring(0, $scope.userInput.pin.length-1);
		}
	}
	
	// Queries the database for the pin provided, if successful, redirect to the app, otherwise, set invalidLoginPin to true, and display it to the user
	$scope.login = function() {
		
		$scope.pageElements.invalidLoginPin = false;
		
		var whereClause = "passcode = '" + $scope.userInput.pin + "'";
		queryService.selectQuery("userID, passcode", "users", whereClause).then( function(response) {
			
			// If passcode is incorrect, display the proper text
			if(response.data.length === 0) {
				$scope.pageElements.invalidLoginPin = true;
				
			// If the passcode is correct, set the user's ID in localstorage and redirect to checkinLog
			} else {
				localStorage.setItem("user", response.data[0].userID);
				console.log("HIT");
				$window.location.href = "#/checkinLog";
			}
		});
	}
	
	// Redirects the user to the forgotton pin screen
	$scope.forgotPin = function() {
		$window.location.href = "#/forgotPin";
	}
	
	// Redirects the user to the new user screen
	$scope.newUser = function() {
		$window.location.href = "#/newUser";
	}
}]);

//------------------ sqlTester Controller --------------------
app.controller('SqlTesterCtrl', ['$scope', "queryService", function($scope, queryService){
	
	/* To-do List
	/	1. Error Handling
	/	2. Clean up how data is retrieved
	/	3. Handle Success/Failed cases better
	/	4. Develop proper REST API functionality (Pending research into Android/IOS file systems) 
	*/
	
	// Storage options for Select Queries
	queryServiceValues = {
		selectStatement: '',
		fromStatement: '',
		whereStatement: ''
	};
	
	// Storage options for Update Queries
	$scope.updateQueryValues = {
		updateStatement: '',
		setStatement: '',
		whereStatement: ''
	};
	
	// Storage options for Insert Queries
	$scope.insertQueryValues = {
		insertStatement: '',
		columnStatement: '',
		valueStatement: ''
	};
	
	// Storage options for Delete Queries
	$scope.deleteQueryValues = {
		tableStatement: '',
		whereStatement: ''
	};
	
	// Initial Drop down options
	$scope.options = ['Select', 'Update', 'Insert', 'Delete'];
	
	// Function that is called via select query button on sqlTester.html
	$scope.runSelectQuery = function(inputSelectStatement, inputFromStatement, inputWhereStatement) {
		
		// Given the select, from, and where statements, returns a promise, also sets response to the data returned from the query
        queryService.selectQuery(inputSelectStatement, inputFromStatement, inputWhereStatement).then(function(response) {
			
			// Storing the response's data (I.E the query results) (Example)
			$scope.query = response.data;
			
			// Storing the keys from the query statement (Example)
			$scope.keys = Object.keys($scope.query[0]);		
		});
	};
	
	// Function that is called via update query button on sqlTester.html
	$scope.runUpdateQuery = function(inputUpdateStatement, inputSetStatement, inputWhereStatement) {
		
		// Given the update, set, and where statement: runs the supplied query and returns a promise, also sets response to true/false depending on success/failure
        queryService.updateQuery(inputUpdateStatement, inputSetStatement, inputWhereStatement).then(function() {
		});
	};
	
	// Function that is called via insert query button on sqlTester.html
	$scope.runInsertQuery = function(inputInsertStatement, inputColumnStatement, inputValueStatement) {
		
		// Given the table name, columns, and values to be inserted: runs the supplied query and returns a promise, also sets response to true/false depending on success/failure
        queryService.insertQuery(inputInsertStatement, inputColumnStatement, inputValueStatement).then(function() {
		});
	};
	
	// Function that is called via delete query button on sqlTester.html
	$scope.runDeleteQuery = function(inputTableStatement, inputWhereStatement) {
		
		// Given the table name, columns, and values to be inserted: runs the supplied query and returns a promise, also sets response to true/false depending on success/failure
        queryService.deleteQuery(inputTableStatement, inputWhereStatement).then(function() {
		});
	};
}]);

//------------------ toolStore Controller (Place holder/Demo) --------------------
app.controller('ToolStoreCtrl', ['$scope', '$window', "queryService", '$route', function($scope, $window, queryService, $route){
	
	// Needs translation service (Requires DB rewrite)
	
	// Check to see if a user is logged in, if not, redirect to login screen
	if(localStorage.getItem("user") != null) {		
		// Fetch all the Tools
		queryService.selectQuery("*", "tools", "").then(function(response) {
			$scope.tools = response.data;
			
			// Our array that we'll build which will contain all the user's favourited tools
			$scope.favouritedTools = [];
			
			// Now fetch the ones the user has favourited
			var whereClause = "userID = '" + localStorage.getItem("user") + "'";
			queryService.selectQuery("*", "favouriteTools", whereClause).then( function(response) {
				$scope.favouritedToolsArray = response.data;
				
				// Walk through each favourited tool, and find it's ID in our total tool list
				for(var x = 0; x < $scope.favouritedToolsArray.length; x++) {
					
					// When found, remove it from our tools list and move it to the favourited array so we can display them in different sections
					for(var i = 0; i < $scope.tools.length; i++) {
						if($scope.tools[i].toolID == $scope.favouritedToolsArray[x].favouriteToolID) {
							$scope.favouritedTools.push($scope.tools[i]);
							$scope.tools.splice(i, 1);
						}
					}
				}
			});			
		});
		
		// Adds tool to table favouriteTools
		$scope.addToolToFavourites = function(toolID) {
			var valueStatement = localStorage.getItem("user") + ", " + toolID;
			queryService.insertQuery("favouriteTools", "userID, favouriteToolID", valueStatement).then( function() {
				$route.reload();
			});
		};
		
		// Removes tool from favouriteTools
		$scope.removeToolFromFavourites = function(toolID) {
			var whereClause = "userID = '" + localStorage.getItem("user") + "' AND favouriteToolID = '" + toolID + "'";
			queryService.deleteQuery("favouriteTools", whereClause).then( function() {
				$route.reload();
			});
		}
		
		// Caches the selected tool's ID, and redirects to our autofilled moreDetails page
		$scope.moreDetails = function(toolID) {
			localStorage.setItem("selectedToolID", toolID);
			$window.location.href= "#/moreDetails";
		};
	} else {
		$window.location.href = "#/home";
	}
}]);

//------------------ checkinLog Controller --------------------
app.controller('CheckinLogCtrl', ['$scope', '$window', "entryList", "translationService", function($scope, $window, entryList, translationService){
	
	// Check to see if a user is logged in, if not, redirect to login screen
	if(localStorage.getItem("user") != null) {
		
		$scope.pageElements = translationService.translate("checkinLog.html");
		
		// Fetch all wellnessTrackerEntries
		$scope.entries = entryList;
		
		// Redirect method for checkinLog.html -> checkinLogInfo.html, also stores the selected tool ID in localStorage
		$scope.redirectMoreDetails = function(entryID) {
			localStorage.setItem("selectedEntryID", entryID);
			$window.location.href = "#/checkinLogInfo";
		};
	} else {
		$window.location.href = "#/home";
	}
}]);

//------------------ Checkin Log Controller Controller --------------------
app.controller('CheckinLogInfoCtrl', ['$scope', "$routeParams", "$location", "$window", "entryList", "scoreManager", "translationService", function($scope, $routeParams, $location, $window, entryList, scoreManager, translationService){

	// Check to see if a user is logged in, if not, redirect to login screen
	if(localStorage.getItem("user") != null) {
		
		$scope.pageElements = translationService.translate("checkinLogInfo.html");
		
		var id = $routeParams.id, currentIndex;

		$scope.entry = null;
		$scope.hasNext = true;
		$scope.hasPrev = true;
		$scope.nextEntry = nextEntry;
		$scope.prevEntry = prevEntry;
		
		$scope.notesProvided = true;

		setEntry();
		
		// Calculate the total score of the checkin, and then use it to display the appropriate images
		$scope.checkinTotal = ((parseInt($scope.entry.moodScore) + parseInt($scope.entry.sleepScore) + scoreManager.reverseScore(parseInt($scope.entry.stressScore)) + parseInt($scope.entry.dietScore)) / 4).toFixed(0);
		
		// Check if the note is blank, if so, enable our "No notes were entered" element.
		if($scope.entry.entryNote === null) {
			$scope.notesProvided = false;
		}
		
		function setEntry() {

			for(var i = 0, len = entryList.length; i < len; i++){
				var entry = entryList[i];

				if (entry.entryID === id){
					$scope.entry = entry;
					currentIndex = i;
					setHasNext();
					setHasPrev();
					break;
				}
			}
		}

		function nextEntry(){
			if ($scope.hasNext) {
				currentIndex++;
				updateUrl();
			}
		}

		function prevEntry(){
			if($scope.hasPrev) {
				currentIndex--;
				updateUrl();
			}
		}

		function updateUrl(){
			if (currentIndex <= entryList.length - 1 && currentIndex >= 0) {
				var entryId = entryList[currentIndex].entryID;
				$location.path("checkinLogInfo/" + entryId);
			}
		}

		function setHasNext(){
			$scope.hasNext = currentIndex < entryList.length - 1;
		}

		function setHasPrev(){
			$scope.hasPrev = currentIndex !== 0;
		}
	} else {
		$window.location.href = "#/home";
	}
}]);

//------------------ Analytic Dashboard Controller --------------------
app.controller('analyticDashboardCtrl', ['$scope', "queryService", "translationService", "$window", function($scope, queryService, translationService, $window){
	
	// Check to see if a user is logged in, if not, redirect to login screen
	if(localStorage.getItem("user") != null) {
		
		// Mood = 0, sleep = 1, stress = 2, diet = 3 
		$scope.graphColours = ["#FF9800", "#01579B", "#D32F2F", "#4CAF50"];
		
		// Form values
		$scope.userInput = {
			moodCheckbox: false,
			sleepCheckbox: false,
			stressCheckbox: false,
			dietCheckbox: false,
			fromDate: new Date(),
			toDate: new Date()
		}
		
		// Page elements
		$scope.pageElements = translationService.translate("analyticDashboard.html");

		$scope.redirectToCheckinLog = function() {
			$window.location.href= "#/checkinLog";
		}
		
		// Launch function
		$scope.pageLoad = function() {
			// Tell our loading bar that the back-end has started
			$scope.pageElements.loadStarted = true;
			
			// Set up our dates for last month
			
			// Grab both our dates
			var today = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
			var todayMinusAMonth = moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss');
				
			// Set the times to their min or max hour accordingly
			var finalTodayDate = new String(today.slice(0, 10) + ' 23' + today.slice(13, today.length));
			var finalTodayMinusAMonth = new String(todayMinusAMonth.slice(0, 10) + ' 00' + todayMinusAMonth.slice(13, todayMinusAMonth.length));

			// Turn them into a string object so we can use them in our queries
			finalTodayDate = finalTodayDate.toString();
			finalTodayMinusAMonth = finalTodayMinusAMonth.toString();
			
			// Call the method to generate the chart
			$scope.generateChart(finalTodayMinusAMonth, finalTodayDate, true);
		}
		
		// Called when "Generate" button is clicked, creates a chart
		$scope.generateChart = function(fromDate, toDate, pageLaunchFlag) {
			
			if(pageLaunchFlag === null) pageLaunchFlag = false;
			
			// Tell our loading bar that the back-end has started
			$scope.pageElements.loadStarted = true;
			
			// Reset our counters
			$scope.totalAverage = 0;
			$scope.totalCheckins = 0;
			$scope.moodScoreAverage = 0;
			$scope.stressScoreAverage = 0;
			$scope.dietScoreAverage = 0;
			$scope.sleepScoreAverage = 0;
			
			$scope.pageElements.maximizeButton = !$scope.pageElements.maximizeButton;
			$scope.pageElements.showOutput = true;
			
			// Display the appropriate elements if their checkbox was selected
			if($scope.userInput.moodCheckbox || pageLaunchFlag) {
				$scope.pageElements.moodValues = true;
			} else {
				$scope.pageElements.moodValues = false;
			}
			
			if($scope.userInput.stressCheckbox || pageLaunchFlag) {
				$scope.pageElements.stressValues = true;
			} else {
				$scope.pageElements.stressValues = false;
			}
			
			if($scope.userInput.dietCheckbox || pageLaunchFlag) {
				$scope.pageElements.dietValues = true;
			} else {
				$scope.pageElements.dietValues = false;
			}
			
			if($scope.userInput.sleepCheckbox || pageLaunchFlag) {
				$scope.pageElements.sleepValues = true;
			} else {
				$scope.pageElements.sleepValues = false;
			}
			
			var selectStatement = "";
			var whereClause = "";
			
			// We need to fill variables depending on whether they were selected or not (We avoid string building doing it this way)
			var moodScore = "";
			var stressScore = "";
			var dietScore = "";
			var sleepScore = "";
			
			if($scope.userInput.moodCheckbox || pageLaunchFlag) {
				moodScore = "moodScore, ";
			}
			
			if($scope.userInput.stressCheckbox || pageLaunchFlag) {
				stressScore = "stressScore, ";
			}
			
			if($scope.userInput.dietCheckbox || pageLaunchFlag) {
				dietScore = "dietScore, ";
			}
			
			if($scope.userInput.sleepCheckbox || pageLaunchFlag) {
				sleepScore = "sleepScore, ";
			}
			
			if(!pageLaunchFlag) {
			
				// Format our dates
				var fromDate = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
				var toDate = moment(toDate).format('YYYY-MM-DD HH:mm:ss');
					
				// Set the times to their min or max hour accordingly
				var finalFromDate = new String(fromDate.slice(0, 10) + ' 00' + fromDate.slice(13, fromDate.length));
				var finalToDate = new String(toDate.slice(0, 10) + ' 23' + toDate.slice(13, toDate.length));

				// Turn them into a string object so we can use them in our queries
				fromDate = finalFromDate.toString();
				toDate = finalToDate.toString();
			}
			
			// Generating the select and where clause
			selectStatement = moodScore + stressScore + dietScore + sleepScore + "dateEntered";		
			whereClause = "userID = '" + localStorage.getItem("user") + "' AND dateEntered BETWEEN DATETIME('" + fromDate + "') AND DATETIME('" + toDate + "') ORDER BY dateEntered DESC";

			// Query the actual line graph data
			queryService.selectQuery(selectStatement, "wellnessTrackerEntries", whereClause).then(function(response) {
				$scope.entries = response.data;
			
				var labelsArray = [];
				
				var moodScoreArray = [];
				var stressScoreArray = [];
				var dietScoreArray = [];
				var sleepScoreArray = [];				
				
				var moodScoreTotal = 0;
				var stressScoreTotal = 0;
				var dietScoreTotal = 0;
				var sleepScoreTotal = 0;
				
				$scope.totalCheckins = 0;
				
				// Each array is aligned, apply the actual values from our query
				for(var i = 0; i < $scope.entries.length; i++) {
					
					$scope.totalCheckins++;
					
					labelsArray[i] = $scope.entries[i].dateEntered;
					
					if($scope.userInput.moodCheckbox || pageLaunchFlag) {
						moodScoreArray[i] = $scope.entries[i].moodScore;
						moodScoreTotal = moodScoreTotal + parseInt($scope.entries[i].moodScore);
					}
					
					if($scope.userInput.stressCheckbox || pageLaunchFlag) {
						stressScoreArray[i] = $scope.entries[i].stressScore;
						stressScoreTotal = stressScoreTotal + parseInt($scope.entries[i].stressScore);
					}
					
					if($scope.userInput.dietCheckbox || pageLaunchFlag) {
						dietScoreArray[i] = $scope.entries[i].dietScore;
						dietScoreTotal = dietScoreTotal + parseInt($scope.entries[i].dietScore);
					}
					
					if($scope.userInput.sleepCheckbox || pageLaunchFlag) {
						sleepScoreArray[i] = $scope.entries[i].sleepScore;
						sleepScoreTotal = sleepScoreTotal + parseInt($scope.entries[i].sleepScore);
					}
				}
				
				// If their appropriate checkbox is selected, calculate the average score
				if($scope.userInput.moodCheckbox || pageLaunchFlag) $scope.moodScoreAverage = (moodScoreTotal / $scope.totalCheckins).toFixed(2);
				if($scope.userInput.stressCheckbox || pageLaunchFlag) $scope.stressScoreAverage = (stressScoreTotal / $scope.totalCheckins).toFixed(2);
				if($scope.userInput.dietCheckbox || pageLaunchFlag) $scope.dietScoreAverage = (dietScoreTotal / $scope.totalCheckins).toFixed(2);
				if($scope.userInput.sleepCheckbox || pageLaunchFlag) $scope.sleepScoreAverage = (sleepScoreTotal / $scope.totalCheckins).toFixed(2);
				
				// Build our graph object
				var graphDataSets = [];
				
				// If moodCheckbox was selected, build our mood line
				if($scope.userInput.moodCheckbox || pageLaunchFlag) {
					
					var moodCheckboxIndex = graphDataSets.length;
					
					graphDataSets[graphDataSets.length] = { 
						data: moodScoreArray,
						label: $scope.pageElements.moodText,
						borderColor: $scope.graphColours[0],
						fill: false
					}
				}
				
				// If stressCheckbox was selected, build our stress line
				if($scope.userInput.stressCheckbox || pageLaunchFlag) {
					
					var stressCheckboxIndex = graphDataSets.length;
					
					graphDataSets[graphDataSets.length] = { 
						data: stressScoreArray,
						label: $scope.pageElements.stressText,
						borderColor: $scope.graphColours[2],
						fill: false
					}
				}
				
				// If dietCheckbox was selected, build our diet line
				if($scope.userInput.dietCheckbox || pageLaunchFlag) {
					
					var dietCheckboxIndex = graphDataSets.length;
					
					graphDataSets[graphDataSets.length] = { 
						data: dietScoreArray,
						label: $scope.pageElements.dietText,
						borderColor: $scope.graphColours[3],
						fill: false
					}
				}
				
				// If sleepCheckbox was selected, build our sleep quality line
				if($scope.userInput.sleepCheckbox || pageLaunchFlag) {
					
					var sleepCheckboxIndex = graphDataSets.length;
					
					graphDataSets[graphDataSets.length] = { 
						data: sleepScoreArray,
						label: $scope.pageElements.sleepText,
						borderColor: $scope.graphColours[1],
						fill: false
					}
				}
				
				var datasetsObject = [];
				
				
				
				if($scope.userInput.moodCheckbox || pageLaunchFlag) {
					datasetsObject[datasetsObject.length] = {label: graphDataSets[moodCheckboxIndex].label, data: graphDataSets[moodCheckboxIndex].data, borderColor: graphDataSets[moodCheckboxIndex].borderColor, fill: graphDataSets[moodCheckboxIndex].fill};
				}
				
				if($scope.userInput.stressCheckbox || pageLaunchFlag) {
					datasetsObject[datasetsObject.length] = {label: graphDataSets[stressCheckboxIndex].label, data: graphDataSets[stressCheckboxIndex].data, borderColor: graphDataSets[stressCheckboxIndex].borderColor, fill: graphDataSets[stressCheckboxIndex].fill};
				}
				
				if($scope.userInput.dietCheckbox || pageLaunchFlag) {
					datasetsObject[datasetsObject.length] = {label: graphDataSets[dietCheckboxIndex].label, data: graphDataSets[dietCheckboxIndex].data, borderColor: graphDataSets[dietCheckboxIndex].borderColor, fill: graphDataSets[dietCheckboxIndex].fill};
				}
				
				if($scope.userInput.sleepCheckbox || pageLaunchFlag) {
					datasetsObject[datasetsObject.length] = {label: graphDataSets[sleepCheckboxIndex].label, data: graphDataSets[sleepCheckboxIndex].data, borderColor: graphDataSets[sleepCheckboxIndex].borderColor, fill: graphDataSets[sleepCheckboxIndex].fill};
				}
				
				var chartDiv = document.getElementById("chartDiv");
				chartDiv.innerHTML = '<canvas id="mainChart"></canvas>';
				
				// Generate Chart
				var mainChart = new Chart(document.getElementById("mainChart").getContext('2d'), {
					
					type: 'line',
					data: {
						labels: labelsArray,
						datasets: datasetsObject
					},
					options: {					
						scales: {
							xAxes: [{
								type: 'time',
								time: {
									displayFormats: {
										quarter: 'MMM D'
									}
								}
							}] 
						}
					}
				});
				
				$scope.pageElements.loadComplete = true;
			});
		}
		
		$scope.pageLoad();
	} else {
		$window.location.href = "#/home";
	}
	
}]);

//------------------ Diary Controller --------------------
app.controller('DiaryCtrl', ['$scope', '$window', "queryService", "translationService", function($scope, $window, queryService, translationService){
	
	// Check to see if a user is logged in, if not, redirect to login screen
	if(localStorage.getItem("user") != null) {
		
		$scope.pageElements = translationService.translate("diary.html");
		
		// Resets DiaryManager's function
		localStorage.setItem("diaryFunction", "");
		
		// Fetch all diary entries (1=1 is a temporary fix to an issue discovered in selectQuery.php's where clause, please ignore)
		queryService.selectQuery("*", "diaryEntries", "1=1 ORDER BY dateCreated").then(function(response) {
			$scope.diaryEntries = response.data;
		});
		
		// Indicates to our diaryManager that upon loading, that the user has requested a "New" entry, redirect to the diaryManager
		$scope.addDiaryEntry = function() {
			localStorage.setItem("diaryFunction", "new");
			$window.location.href = "#/diaryManager";
		};
		
		// Indicates to our diaryManager that upon loading, that the user has requested to view an entry, redirect to the diaryManager with the selected entryID
		$scope.viewDiaryEntry = function(selectedDiaryEntry) {
			localStorage.setItem("diaryFunction", "viewing");
			localStorage.setItem("selectedDiaryEntry", selectedDiaryEntry);
			$window.location.href = "#/diaryManager";
		};
		
		// Indicates to our diaryManager that upon loading, that the user has requested to edit an entry, redirect to the diaryManager with the selected entryID
		$scope.editDiaryEntry = function(selectedDiaryEntry) {
			localStorage.setItem("diaryFunction", "editing");
			localStorage.setItem("selectedDiaryEntry", selectedDiaryEntry);
			$window.location.href = "#/diaryManager";
		};
		
		// Create the query to delete the diary entry, then "reload" the page (Is the reload needed? - Justin)
		$scope.deleteDiaryEntry = function(selectedDiaryEntry) {
			var whereClause = "entryID = " + selectedDiaryEntry;
			queryService.deleteQuery("diaryEntries", whereClause).then(function() {
				$window.location.href = "#/diary";
			});
		};
	} else {
		$window.location.href = "#/home";
	}
}]);

//------------------ Diary Manager Controller --------------------
app.controller('DiaryManagerCtrl', ['$scope', '$window', "queryService", "translationService", function($scope, $window, queryService, translationService){
	
	// Check to see if a user is logged in, if not, redirect to login screen
	if(localStorage.getItem("user") != null) {
		
		$scope.pageElements = translationService.translate("diaryManager.html");
		
		// Retrieve the function flag from localStorage, this flag tells diaryManager which feature the user requested
		$scope.flag = localStorage.getItem("diaryFunction");
		
		// Grab the selected entry's ID if one was given
		$scope.selectedDiaryEntryID = localStorage.getItem("selectedDiaryEntry");
		
		// Used to change the "Add Entry" button to "Adding Entry..." once selected
		$scope.addingEntry = false;
		
		// Check which feature the user has requested, and then handle it accordingly
		
		// If new, set our models to blank
		if($scope.flag == "new") {
			$scope.newEntry = {
				title: "",
				subtitle: "",
				content: ""
			}
			
		// If viewing, retrieve the entry
		} else if($scope.flag == "viewing") {
			var whereClause = "entryID = " + $scope.selectedDiaryEntryID;
			queryService.selectQuery("*", "diaryEntries", whereClause).then(function(response) {
				$scope.selectedEntry = response.data[0];
			});
			
		// If editing, retrieve the entry, separate from "viewing" for future functionality.
		} else if($scope.flag == "editing") {
			var whereClause = "entryID = " + $scope.selectedDiaryEntryID;
			queryService.selectQuery("*", "diaryEntries", whereClause).then(function(response) {
				$scope.selectedEntry = response.data[0];
			});
		}
		
		// Run the insert query
		$scope.addDiaryEntry = function() {
			
			// Design values clause, note that "(SELECT IFNULL(MAX(entryID), 0) + 1 FROM diaryEntries)" is to mimic an auto-incrementing primary key as SQLite3 doesn't support an auto-incrementing compound key - This should be a trigger in the DB granted overhead isn't large - Justin
			var valuesClause = "(SELECT IFNULL(MAX(entryID), 0) + 1 FROM diaryEntries), 1, '" + $scope.newEntry.title + "', '" + $scope.newEntry.subtitle + "', '" + $scope.newEntry.content + "', datetime('now'), datetime('now')";
			$scope.addingEntry = true;

			queryService.insertQuery("diaryEntries", "entryID, userID, title, subtitle, content, dateCreated, dateLastEdited", valuesClause).then(function(response) {
				$window.location.href = "#/diary";
			});
		};
		
		// Update the diary entry in the DB
		$scope.updateDiaryEntry = function() {
			var setQuery = "title = '" + $scope.selectedEntry.title + "', subtitle = '" + $scope.selectedEntry.subtitle + "', content = '" + $scope.selectedEntry.content + "', dateLastEdited = datetime('now')";
			var whereClause = "entryID = " + $scope.selectedEntry.entryID;
			queryService.updateQuery("diaryEntries", setQuery, whereClause).then(function() {
				$window.location.href = "#/diary";
			});
		};
		
		// Redirects to diary.html
		$scope.diaryReturn = function() {
			$window.location.href = "#/diary";
		};
		
		// Changes diaryManager to edit mode
		$scope.editDiaryEntry = function(selectedDiaryEntry) {
			localStorage.setItem("diaryFunction", "editing");
			localStorage.setItem("selectedDiaryEntry", selectedDiaryEntry);
			$scope.flag = localStorage.getItem("diaryFunction");
		};
		
		// Deletes the entry, then redirects to diary.html
		$scope.deleteDiaryEntry = function(selectedDiaryEntry) {
			var whereClause = "entryID = " + selectedDiaryEntry;
			queryService.deleteQuery("diaryEntries", whereClause).then(function() {
				$window.location.href = "#/diary";
			});
		};
	} else {
		$window.location.href = "#/home";
	}
}]);

//------------------ More Details Controller --------------------
app.controller('MoreDetailsCtrl', ['$scope', 'Carousel', '$window', 'queryService', function($scope, Carousel, $window, queryService){
	
	// Check to see if a user is logged in, if not, redirect to login screen
	if(localStorage.getItem("user") != null) {
		$scope.Carousel = Carousel;
	
		if(localStorage.getItem("selectedToolID") == null) {
			$window.location.href= "#/toolStore";
		} else {	
			var selectedToolID = localStorage.getItem("selectedToolID");
		}
		
		var whereClause = "toolID = " + selectedToolID;
		queryService.selectQuery("*", "tools", whereClause).then( function(response) {
			$scope.tool = response.data[0];
		});
	} else {
		$window.location.href = "#/home";
	}	
}]);

//------------------ Daily Entry Controller --------------------
app.controller("DailyEntry", ["$scope", "queryService", '$window', 'scoreManager', "translationService", function ($scope, queryService, $window, scoreManager, translationService) {

	// Check to see if a user is logged in, if not, redirect to login screen
	if(localStorage.getItem("user") != null) {
		$scope.moodScore = 7;
		$scope.sleepScore = 7;
		$scope.dietScore = 7;
		$scope.stressScore = 7;
		$scope.description = "";
		$scope.saveEntry = saveEntry;

		$scope.pageElements = translationService.translate("dailyEntry.html");
		
		$scope.updatePicture = function() {
			$scope.totalScore = ((parseInt($scope.moodScore) + parseInt($scope.sleepScore) + parseInt($scope.dietScore) + scoreManager.reverseScore(parseInt($scope.stressScore))) / 4).toFixed(0); //Added by JW
		}
		
		$scope.$watch(function(scope) { return $scope.moodScore },
			function() {
				$scope.totalScore = ((parseInt($scope.moodScore) + parseInt($scope.sleepScore) + parseInt($scope.dietScore) + scoreManager.reverseScore(parseInt($scope.stressScore))) / 4).toFixed(0); //Added by JW

			}
		);
		
		$scope.$watch(function(scope) { return $scope.sleepScore },
			function() {
				$scope.totalScore = ((parseInt($scope.moodScore) + parseInt($scope.sleepScore) + parseInt($scope.dietScore) + scoreManager.reverseScore(parseInt($scope.stressScore))) / 4).toFixed(0); //Added by JW

			}
		);
		
		$scope.$watch(function(scope) { return $scope.stressScore },
			function() {
				$scope.totalScore = ((parseInt($scope.moodScore) + parseInt($scope.sleepScore) + parseInt($scope.dietScore) + scoreManager.reverseScore(parseInt($scope.stressScore))) / 4).toFixed(0); //Added by JW

			}
		);
		
		$scope.$watch(function(scope) { return $scope.dietScore },
			function() {
				$scope.totalScore = ((parseInt($scope.moodScore) + parseInt($scope.sleepScore) + parseInt($scope.dietScore) + scoreManager.reverseScore(parseInt($scope.stressScore))) / 4).toFixed(0); //Added by JW

			}
		);
		
		function saveEntry(){

			var valueStatement = "(SELECT IFNULL(MAX(entryID), 0) + 1 FROM wellnessTrackerEntries), '" + localStorage.getItem("user") + "', '" + $scope.moodScore + "', '" + $scope.stressScore + "', '" + $scope.sleepScore + "', '" + $scope.dietScore + "', '" + $scope.entryNote + "', datetime('now')";

			queryService.insertQuery("wellnessTrackerEntries", "entryID, userID, moodScore, stressScore, sleepScore, dietScore, entryNote, dateEntered", valueStatement).then(function (result) {
				console.log("This is result:", result);
			});
		}
	} else {
		$window.location.href = "#/home";	
	}
}]);

app.controller("ResourcesCtrl", ["$scope", '$window', function ($scope, $window) {
	// Check to see if a user is logged in, if not, redirect to login screen
	if(localStorage.getItem("user") != null) {
		
	} else {
		$window.location.href = "#/home";
	}

}]);