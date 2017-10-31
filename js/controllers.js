"use strict";

// This file contains all functionality that goes along with a page. The controller that goes along with a page is defined in app.js

var app = angular.module("zenApp.controllers", ['ngRoute', 'ngMaterial', 'angular-carousel']);

//------------------ Home Controller --------------------
app.controller('HomeCtrl', ['$scope', function($scope){
	/* Placeholder Controller */
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
app.controller('ToolStoreCtrl', ['$scope', '$window', "queryService", function($scope, $window, queryService){
	
	/* Things to do: 
	// 1. Add "Add to toolbelt" Button
	// 2. Add picture functionality for tools
	// 3. Hide Tools if they're already a part of the user's toolbelt
	*/
	
	// Fetch all the Tools
    queryService.selectQuery("*", "tools", "").then(function(response) {
		$scope.tools = response.data;
	});
	
	// Place holder for addTool to toolBelt function
	$scope.addTool = function(toolID) {
		console.log(toolID);
	};
	
	// Caches the selected tool's ID, and redirects to our autofilled moreDetails page
	$scope.moreDetails = function(toolID) {
		localStorage.setItem("selectedToolID", toolID);
		$window.location.href= "#/moreDetails";
	};
	
}]);

//------------------ checkinLog Controller --------------------
app.controller('CheckinLogCtrl', ['$scope', '$window', "entryList", function($scope, $window, entryList){
	
	// Fetch all wellnessTrackerEntries
	$scope.entries = entryList;
	
	// Redirect method for checkinLog.html -> checkinLogInfo.html, also stores the selected tool ID in localStorage
	$scope.redirectMoreDetails = function(entryID) {
		localStorage.setItem("selectedEntryID", entryID);
		$window.location.href = "#/checkinLogInfo";
	};

}]);

//------------------ checkinLogInfo Controller --------------------
app.controller('CheckinLogInfoCtrl', ['$scope', "$routeParams", "$location", "entryList", function($scope, $routeParams, $location, entryList){

	var id = $routeParams.id,
        currentIndex;

	$scope.entry = null;
	$scope.hasNext = true;
	$scope.hasPrev = true;
	$scope.nextEntry = nextEntry;
	$scope.prevEntry = prevEntry;
	
	$scope.notesProvided = true;

	setEntry();
	
	// Calculate the total score of the checkin, and then use it to display the appropriate images
	$scope.checkinTotal = ((parseInt($scope.entry.moodScore) + parseInt($scope.entry.sleepScore) + parseInt($scope.entry.sleepScore) + parseInt($scope.entry.dietScore)) / 4).toFixed(0);
	
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


}]);

//------------------ Analytic Dashboard Controller --------------------
app.controller('analyticDashboardCtrl', ['$scope', "queryService", "$window", function($scope, queryService, $window){
	
	// Form values
	$scope.data = {
		moodCheckbox: false,
		sleepCheckbox: false,
		stressCheckbox: false,
		dietCheckbox: false,
		fromDate: new Date(),
		toDate: new Date()
	}
	
	// Page elements

	$scope.pageElements = {
		maximizeButton: true,
		showOutput: false,
		hideAllElements: false,
		moodValues: true,
		stressValues: true,
		dietValues: true,
		sleepValues: true,
		loadComplete: false,
		loadStarted: false
	}

	$scope.redirectToCheckinLog = function() {
		$window.location.href= "#/checkinLog";
	}
	
	// Mood = 0, sleep = 1, stress = 2, diet = 3 
	$scope.graphColours = ["#FF9800", "#01579B", "#D32F2F", "#4CAF50"];
	
	$scope.generateGraph = function() {
		
		var today = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
		var todayMinusAMonth = moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss');

		var whereClause = "dateEntered BETWEEN DATETIME('" + todayMinusAMonth + "') AND DATETIME('" + today + "')";
		
		queryService.selectQuery("moodScore, stressScore, dietScore, sleepScore, dateEntered", "wellnessTrackerEntries", whereClause).then( function(response) {
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
			
			var totalCheckins = 0;
			
			// Each array is aligned, apply the actual values from our query
			for(var i = 0; i < $scope.entries.length; i++) {
				
				totalCheckins++;
				
				labelsArray[i] = $scope.entries[i].dateEntered;
				
				moodScoreArray[i] = $scope.entries[i].moodScore;
				moodScoreTotal = moodScoreTotal + parseInt($scope.entries[i].moodScore);
			
				stressScoreArray[i] = $scope.entries[i].stressScore;
				stressScoreTotal = stressScoreTotal + parseInt($scope.entries[i].stressScore);
			
				dietScoreArray[i] = $scope.entries[i].dietScore;
				dietScoreTotal = dietScoreTotal + parseInt($scope.entries[i].dietScore);
							
				sleepScoreArray[i] = $scope.entries[i].sleepScore;
				sleepScoreTotal = sleepScoreTotal + parseInt($scope.entries[i].sleepScore);
			}
			
			$scope.moodScoreAverage = (moodScoreTotal / totalCheckins).toFixed(2);
			$scope.stressScoreAverage = (stressScoreTotal / totalCheckins).toFixed(2);
			$scope.dietScoreAverage = (dietScoreTotal / totalCheckins).toFixed(2);
			$scope.sleepScoreAverage = (sleepScoreTotal / totalCheckins).toFixed(2);
			
			// Build our graph object
			var graphDataSets = [];
			
			// Build our mood line
			
			var moodCheckboxIndex = graphDataSets.length;
			
			graphDataSets[graphDataSets.length] = { 
				data: moodScoreArray,
				label: "Mood",
				borderColor: $scope.graphColours[0],
				fill: false
			}
			
			// Build our stress line
				
			var stressCheckboxIndex = graphDataSets.length;
			
			graphDataSets[graphDataSets.length] = { 
				data: stressScoreArray,
				label: "Stress",
				borderColor: $scope.graphColours[2],
				fill: false
			}
			
			// Build our diet line
				
			var dietCheckboxIndex = graphDataSets.length;
			
			graphDataSets[graphDataSets.length] = { 
				data: dietScoreArray,
				label: "Diet",
				borderColor: $scope.graphColours[3],
				fill: false
			}
			
			// Build our sleep quality line
				
			var sleepCheckboxIndex = graphDataSets.length;
			
			graphDataSets[graphDataSets.length] = { 
				data: sleepScoreArray,
				label: "Sleep",
				borderColor: $scope.graphColours[1],
				fill: false
			}
			
			var datasetsObject = [];

			datasetsObject[datasetsObject.length] = {label: graphDataSets[moodCheckboxIndex].label, data: graphDataSets[moodCheckboxIndex].data, borderColor: graphDataSets[moodCheckboxIndex].borderColor, fill: graphDataSets[moodCheckboxIndex].fill};
			datasetsObject[datasetsObject.length] = {label: graphDataSets[stressCheckboxIndex].label, data: graphDataSets[stressCheckboxIndex].data, borderColor: graphDataSets[stressCheckboxIndex].borderColor, fill: graphDataSets[stressCheckboxIndex].fill};
			datasetsObject[datasetsObject.length] = {label: graphDataSets[dietCheckboxIndex].label, data: graphDataSets[dietCheckboxIndex].data, borderColor: graphDataSets[dietCheckboxIndex].borderColor, fill: graphDataSets[dietCheckboxIndex].fill};
			datasetsObject[datasetsObject.length] = {label: graphDataSets[sleepCheckboxIndex].label, data: graphDataSets[sleepCheckboxIndex].data, borderColor: graphDataSets[sleepCheckboxIndex].borderColor, fill: graphDataSets[sleepCheckboxIndex].fill};
			
			// Generate Chart
			var mainChart = new Chart(document.getElementById("mainChart").getContext('2d'), {
				
				type: 'line',
				data: {
					labels: labelsArray,
					datasets: datasetsObject
				},
				options: {
					title: {
						display: true,
						text: 'Wellness Trend',
						responsive: true,
						maintainAspectRatio: false
					}
				}
			});
			
		});
		$scope.pageElements.loadStarted = false;
	}
	
	// Launch function
	$scope.pageLoad = function() {
		// Tell our loading bar that the back-end has started
		$scope.pageElements.loadStarted = true;
		$scope.generateGraph();
	}
	
	$scope.pageLoad();
	
	// Called when "Generate" button is clicked
	$scope.generateChart = function(moodCheckbox, stressCheckbox, dietCheckbox, sleepCheckbox, fromDate, toDate) {
		
		// Check if a checkbox is selected, else, don't do anything (If we didn't check, we'd generate a blank chart)
		if(moodCheckbox || stressCheckbox || dietCheckbox || sleepCheckbox) {
			
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
			if($scope.data.moodCheckbox) {
				$scope.pageElements.moodValues = true;
			} else {
				$scope.pageElements.moodValues = false;
			}
			
			if($scope.data.stressCheckbox) {
				$scope.pageElements.stressValues = true;
			} else {
				$scope.pageElements.stressValues = false;
			}
			
			if($scope.data.dietCheckbox) {
				$scope.pageElements.dietValues = true;
			} else {
				$scope.pageElements.dietValues = false;
			}
			
			if($scope.data.sleepCheckbox) {
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
			
			if(moodCheckbox) {
				moodScore = "moodScore, ";
			}
			
			if(stressCheckbox) {
				stressScore = "stressScore, ";
			}
			
			if(dietCheckbox) {
				dietScore = "dietScore, ";
			}
			
			if(sleepCheckbox) {
				sleepScore = "sleepScore, ";
			}
			
			// Parse the angular dates into formats we can use using the moment time library (SQLite3 Standard)
			var fromDate = moment($scope.data.fromDate).format('YYYY-MM-DD HH:mm:ss');
			var toDate = moment($scope.data.toDate).format('YYYY-MM-DD HH:mm:ss');
			
			// Set the times to their min or max hour accordingly
			var finalFromDate = new String(fromDate.slice(0, 10) + ' 00' + fromDate.slice(13, fromDate.length));
			var finalToDate = new String(toDate.slice(0, 10) + ' 23' + toDate.slice(13, toDate.length));

			// Turn them into a string object so we can use them in our queries
			finalFromDate = finalFromDate.toString();
			finalToDate = finalToDate.toString();
			
			// Generating the select and where clause
			selectStatement = moodScore + stressScore + dietScore + sleepScore + "dateEntered";		
			whereClause = "dateEntered BETWEEN DATETIME('" + fromDate + "') AND DATETIME('" + toDate + "') ORDER BY dateEntered";

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
					
					if(moodCheckbox) {
						moodScoreArray[i] = $scope.entries[i].moodScore;
						moodScoreTotal = moodScoreTotal + parseInt($scope.entries[i].moodScore);
					}
					
					if(stressCheckbox) {
						stressScoreArray[i] = $scope.entries[i].stressScore;
						stressScoreTotal = stressScoreTotal + parseInt($scope.entries[i].stressScore);
					}
					
					if(dietCheckbox) {
						dietScoreArray[i] = $scope.entries[i].dietScore;
						dietScoreTotal = dietScoreTotal + parseInt($scope.entries[i].dietScore);
					}
					
					if(sleepCheckbox) {
						sleepScoreArray[i] = $scope.entries[i].sleepScore;
						sleepScoreTotal = sleepScoreTotal + parseInt($scope.entries[i].sleepScore);
					}
				}
				
				// Loops through all the checkins, and counts the number of duplicate days to determine the average number of checkins per day
				/*var currentComparedDate = labelsArray[1];
				$scope.duplicateDatesFound = 0;
				
				for(var i= 0; i < labelsArray.length; i++) {
					if(moment(labelsArray[i]).isSame(currentComparedDate, 'day')) {
						$scope.duplicateDatesFound++;
					} else {
						currentComparedDate = labelsArray[i];
					}
				}
				
				$scope.duplicateDatesFound = ($scope.duplicateDatesFound / labelsArray.length).toFixed(2);*/
				
				// If their appropriate checkbox is selected, calculate the average score
				if(moodCheckbox) $scope.moodScoreAverage = (moodScoreTotal / $scope.totalCheckins).toFixed(2);
				if(stressCheckbox) $scope.stressScoreAverage = (stressScoreTotal / $scope.totalCheckins).toFixed(2);
				if(dietCheckbox) $scope.dietScoreAverage = (dietScoreTotal / $scope.totalCheckins).toFixed(2);
				if(sleepCheckbox) $scope.sleepScoreAverage = (sleepScoreTotal / $scope.totalCheckins).toFixed(2);
				
				// Build our graph object
				var graphDataSets = [];
				
				// If moodCheckbox was selected, build our mood line
				if(moodCheckbox) {
					
					var moodCheckboxIndex = graphDataSets.length;
					
					graphDataSets[graphDataSets.length] = { 
						data: moodScoreArray,
						label: "Mood",
						borderColor: $scope.graphColours[0],
						fill: false
					}
				}
				
				// If stressCheckbox was selected, build our stress line
				if(stressCheckbox) {
					
					var stressCheckboxIndex = graphDataSets.length;
					
					graphDataSets[graphDataSets.length] = { 
						data: stressScoreArray,
						label: "Stress",
						borderColor: $scope.graphColours[2],
						fill: false
					}
				}
				
				// If dietCheckbox was selected, build our diet line
				if(dietCheckbox) {
					
					var dietCheckboxIndex = graphDataSets.length;
					
					graphDataSets[graphDataSets.length] = { 
						data: dietScoreArray,
						label: "Diet",
						borderColor: $scope.graphColours[3],
						fill: false
					}
				}
				
				// If sleepCheckbox was selected, build our sleep quality line
				if(sleepCheckbox) {
					
					var sleepCheckboxIndex = graphDataSets.length;
					
					graphDataSets[graphDataSets.length] = { 
						data: sleepScoreArray,
						label: "Sleep",
						borderColor: $scope.graphColours[1],
						fill: false
					}
				}
				
				var datasetsObject = [];
				
				if(moodCheckbox) {
					datasetsObject[datasetsObject.length] = {label: graphDataSets[moodCheckboxIndex].label, data: graphDataSets[moodCheckboxIndex].data, borderColor: graphDataSets[moodCheckboxIndex].borderColor, fill: graphDataSets[moodCheckboxIndex].fill};
				}
				
				if(stressCheckbox) {
					datasetsObject[datasetsObject.length] = {label: graphDataSets[stressCheckboxIndex].label, data: graphDataSets[stressCheckboxIndex].data, borderColor: graphDataSets[stressCheckboxIndex].borderColor, fill: graphDataSets[stressCheckboxIndex].fill};
				}
				
				if(dietCheckbox) {
					datasetsObject[datasetsObject.length] = {label: graphDataSets[dietCheckboxIndex].label, data: graphDataSets[dietCheckboxIndex].data, borderColor: graphDataSets[dietCheckboxIndex].borderColor, fill: graphDataSets[dietCheckboxIndex].fill};
				}
				
				if(sleepCheckbox) {
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
/*						title: {
							display: true,
							text: 'Wellness Trend',
							responsive: true,
							maintainAspectRatio: false
						}
*/						
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
				
				// Calculating last week's percentage change
				/*
				var weekDay = moment().isoWeekday();
				var today = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
				
				// Fetching this weeks data
				whereClause = "dateEntered BETWEEN DATETIME('" + today + "', '-" + weekDay + " day') AND DATETIME('" + today + "') ORDER BY dateEntered;";
				
				queryService.selectQuery(selectStatement, "wellnessTrackerEntries", whereClause).then( function(response) {
					
					//var averageMoodTotal = 0;
					var currentWeekMoodAverage = 0;
					var averageStressTotal = 0;
					var currentWeekStressAverage = 0;
					var averageDietTotal = 0;
					var currentWeekDietAverage = 0;
					var averageSleepTotal = 0;
					var currentWeekSleepAverage = 0;
					
					var checkinCounter = 0;
					
					// Grab the averages for this week, so we can compare it to last week
					for(var i = 0; i < response.data.length; i++) {
						
						if(moodCheckbox) averageMoodTotal = averageMoodTotal + parseInt(response.data[i].moodScore);
						if(stressCheckbox) averageStressTotal = averageStressTotal + parseInt(response.data[i].stressScore);
						if(dietCheckbox) averageDietTotal = averageDietTotal + parseInt(response.data[i].dietScore);
						if(sleepQualityCheckbox) averageSleepTotal = averageSleepTotal + parseInt(response.data[i].sleepScore);
						checkinCounter++;
					}
					
					if(moodCheckbox) currentWeekMoodAverage = (averageMoodTotal / checkinCounter).toFixed(2);
					if(stressCheckbox) currentWeekStressAverage = (averageStressTotal / checkinCounter).toFixed(2);
					if(dietCheckbox) currentWeekDietAverage = (averageDietTotal / checkinCounter).toFixed(2);
					if(sleepQualityCheckbox) currentWeekSleepAverage = (averageSleepTotal / checkinCounter).toFixed(2);
					
					// Fetching last week's data
					var beginningOfWeekMinusAnotherWeek = weekDay + 6;
					
					whereClause = "dateEntered BETWEEN DATETIME('" + today + "', '-" + beginningOfWeekMinusAnotherWeek + " days') AND DATETIME('" + today + "', '-" + weekDay + " days') ORDER BY dateEntered";
					
					queryService.selectQuery(selectStatement, "wellnessTrackerEntries", whereClause).then( function(response) {				
						
						var lastWeekMoodAverage = 0;
						var lastWeekAnxietyAverage = 0;
						var lastWeekDepressionAverage = 0;
						var lastWeekStressAverage = 0;
						var lastWeekDietAverage = 0;
						var lastWeekSleepAverage = 0;
						
						averageMoodTotal = 0;
						averageAnxietyTotal = 0;
						averageDepressionTotal = 0;
						averageStressTotal = 0;
						averageDietTotal = 0;
						averageSleepTotal = 0;
						
						var checkinCounter = 0;
						
						// Grab the averages from last week
						for(var i = 0; i < response.data.length; i++) {
							if(moodCheckbox) averageMoodTotal = averageMoodTotal + parseInt(response.data[i].moodScore);
							if(anxietyCheckbox) averageAnxietyTotal = averageAnxietyTotal + parseInt(response.data[i].anxietyScore);
							if(depressionCheckbox) averageDepressionTotal = averageDepressionTotal + parseInt(response.data[i].depressionScore);
							if(stressCheckbox) averageStressTotal = averageStressTotal + parseInt(response.data[i].stressScore);
							if(dietCheckbox) averageDietTotal = averageDietTotal + parseInt(response.data[i].dietScore);
							if(sleepQualityCheckbox) averageSleepTotal = averageSleepTotal + parseInt(response.data[i].sleepScore);
							checkinCounter++;
						}
						
						if(moodCheckbox) lastWeekMoodAverage = (averageMoodTotal / checkinCounter).toFixed(2);
						if(anxietyCheckbox) lastWeekAnxietyAverage = (averageAnxietyTotal / checkinCounter).toFixed(2);
						if(depressionCheckbox) lastWeekDepressionAverage = (averageDepressionTotal / checkinCounter).toFixed(2);
						if(stressCheckbox) lastWeekStressAverage = (averageStressTotal / checkinCounter).toFixed(2);
						if(dietCheckbox) lastWeekDietAverage = (averageDietTotal / checkinCounter).toFixed(2);
						if(sleepQualityCheckbox) lastWeekSleepAverage = (averageSleepTotal / checkinCounter).toFixed(2);
						
						// Calculate Percentage difference
						if(moodCheckbox) {
							$scope.moodWeeklyPercentage = lastWeekMoodAverage - currentWeekMoodAverage;
							$scope.moodWeeklyPercentage = (($scope.moodWeeklyPercentage / lastWeekMoodAverage) * 100).toFixed(0);
						}
						
						if(anxietyCheckbox) {
							$scope.anxietyWeeklyPercentage = lastWeekAnxietyAverage - currentWeekAnxietyAverage;
							$scope.anxietyWeeklyPercentage = (($scope.anxietyWeeklyPercentage / lastWeekAnxietyAverage) * 100).toFixed(0);
						}
						
						if(depressionCheckbox) {
							$scope.depressionWeeklyPercentage = lastWeekDepressionAverage - currentWeekDepressionAverage;
							$scope.depressionWeeklyPercentage = (($scope.depressionWeeklyPercentage / lastWeekDepressionAverage) * 100).toFixed(0);
						}
						
						if(stressCheckbox) {
							$scope.stressWeeklyPercentage = lastWeekStressAverage - currentWeekStressAverage;
							$scope.stressWeeklyPercentage = (($scope.stressWeeklyPercentage / lastWeekStressAverage) * 100).toFixed(0);
						}
						
						if(dietCheckbox) {
							$scope.dietWeeklyPercentage = lastWeekDietAverage - currentWeekDietAverage;
							$scope.dietWeeklyPercentage = (($scope.dietWeeklyPercentage / lastWeekDietAverage) * 100).toFixed(0);
						}
						
						if(sleepQualityCheckbox) {
							$scope.sleepWeeklyPercentage = lastWeekSleepAverage - currentWeekSleepAverage;
							$scope.sleepWeeklyPercentage = (($scope.sleepWeeklyPercentage / lastWeekSleepAverage) * 100).toFixed(0);
						}
					})
				})
				
				var monthDay = moment(new Date()).date();
				
				// Fetching this months data
				whereClause = "dateEntered BETWEEN DATETIME('" + today + "', '-" + monthDay + " day') AND DATETIME('" + today + "') ORDER BY dateEntered;";
				
				queryService.selectQuery(selectStatement, "wellnessTrackerEntries", whereClause).then( function(response) {
					
					var currentMonthMoodAverage = 0;
					var currentMonthAnxietyAverage = 0;
					var currentMonthDepressionAverage = 0;
					var currentMonthStressAverage = 0;
					var currentMonthDietAverage = 0;
					var currentMonthSleepAverage = 0;
					
					var averageMoodTotal = 0;
					var averageAnxietyTotal = 0;
					var averageDepressionTotal = 0;
					var averageStressTotal = 0;
					var averageDietTotal = 0;
					var averageSleepTotal = 0;
				
					var checkinCounter = 0;
					
					// Calculate the averages for this month, so we can compare it to last month
					for(var i = 0; i < response.data.length; i++) {
						
						if(moodCheckbox) averageMoodTotal = averageMoodTotal + parseInt(response.data[i].moodScore);
						if(anxietyCheckbox) averageAnxietyTotal = averageAnxietyTotal + parseInt(response.data[i].anxietyScore);
						if(depressionCheckbox) averageDepressionTotal = averageDepressionTotal + parseInt(response.data[i].depressionScore);
						if(stressCheckbox) averageStressTotal = averageStressTotal + parseInt(response.data[i].stressScore);
						if(dietCheckbox) averageDietTotal = averageDietTotal + parseInt(response.data[i].dietScore);
						if(sleepQualityCheckbox) averageSleepTotal = averageSleepTotal + parseInt(response.data[i].sleepScore);
						checkinCounter++;
					}
					
					if(moodCheckbox) currentMonthMoodAverage = (averageMoodTotal / checkinCounter).toFixed(2);
					if(anxietyCheckbox) currentMonthAnxietyAverage = (averageAnxietyTotal / checkinCounter).toFixed(2);
					if(depressionCheckbox) currentMonthDepressionAverage = (averageDepressionTotal / checkinCounter).toFixed(2);
					if(stressCheckbox) currentMonthStressAverage = (averageStressTotal / checkinCounter).toFixed(2);
					if(dietCheckbox) currentMonthDietAverage = (averageDietTotal / checkinCounter).toFixed(2);
					if(sleepQualityCheckbox) currentMonthSleepAverage = (averageSleepTotal / checkinCounter).toFixed(2);
					
					// Fetching last month's data
					
					var beginningOfMonthMinusAnotherMonth = weekDay + 30;
					
					whereClause = "dateEntered BETWEEN DATETIME('" + today + "', '-" + beginningOfMonthMinusAnotherMonth + " days') AND DATETIME('" + today + "', '-" + monthDay + " days') ORDER BY dateEntered";
					
					queryService.selectQuery(selectStatement, "wellnessTrackerEntries", whereClause).then( function(response) {				
						
						var lastMonthMoodAverage = 0;
						var lastMonthAnxietyAverage = 0;
						var lastMonthDepressionAverage = 0;
						var lastMonthStressAverage = 0;
						var lastMonthDietAverage = 0;
						var lastMonthSleepAverage = 0;
						
						var averageMoodTotal = 0;
						var averageAnxietyTotal = 0;
						var averageDepressionTotal = 0;
						var averageStressTotal = 0;
						var averageDietTotal = 0;
						var averageSleepTotal = 0;
						
						var checkinCounter = 0;
						
						// Calculate last months averages
						for(var i = 0; i < response.data.length; i++) {
							if(moodCheckbox) averageMoodTotal = averageMoodTotal + parseInt(response.data[i].moodScore);
							if(anxietyCheckbox) averageAnxietyTotal = averageAnxietyTotal + parseInt(response.data[i].anxietyScore);
							if(depressionCheckbox) averageDepressionTotal = averageDepressionTotal + parseInt(response.data[i].depressionScore);
							if(stressCheckbox) averageStressTotal = averageStressTotal + parseInt(response.data[i].stressScore);
							if(dietCheckbox) averageDietTotal = averageDietTotal + parseInt(response.data[i].dietScore);
							if(sleepQualityCheckbox) averageSleepTotal = averageSleepTotal + parseInt(response.data[i].sleepScore);
							checkinCounter++;
						}
						
						if(moodCheckbox) lastMonthMoodAverage = (averageMoodTotal / checkinCounter).toFixed(2);
						if(anxietyCheckbox) lastMonthAnxietyAverage = (averageAnxietyTotal / checkinCounter).toFixed(2);
						if(depressionCheckbox) lastMonthDepressionAverage = (averageDepressionTotal / checkinCounter).toFixed(2);
						if(stressCheckbox) lastMonthStressAverage = (averageStressTotal / checkinCounter).toFixed(2);
						if(dietCheckbox) lastMonthDietAverage = (averageDietTotal / checkinCounter).toFixed(2);
						if(sleepQualityCheckbox) lastMonthSleepAverage = (averageSleepTotal / checkinCounter).toFixed(2);
						
						// Calculate Percentage difference
						if(moodCheckbox) {
							$scope.moodMonthlyPercentage = lastMonthMoodAverage - currentMonthMoodAverage;
							$scope.moodMonthlyPercentage = (($scope.moodMonthlyPercentage / lastMonthMoodAverage) * 100).toFixed(0);
						}
						
						if(anxietyCheckbox) {
							$scope.anxietyMonthlyPercentage = lastMonthAnxietyAverage - currentMonthAnxietyAverage;
							$scope.anxietyMonthlyPercentage = (($scope.anxietyMonthlyPercentage / lastMonthAnxietyAverage) * 100).toFixed(0);
						}
						
						if(depressionCheckbox) {
							$scope.depressionMonthlyPercentage = lastMonthDepressionAverage - currentMonthDepressionAverage;
							$scope.depressionMonthlyPercentage = (($scope.depressionMonthlyPercentage / lastMonthDepressionAverage) * 100).toFixed(0);
						}
						
						if(stressCheckbox) {
							$scope.stressMonthlyPercentage = lastMonthStressAverage - currentMonthStressAverage;
							$scope.stressMonthlyPercentage = (($scope.stressMonthlyPercentage / lastMonthStressAverage) * 100).toFixed(0);
						}
						
						if(dietCheckbox) {
							$scope.dietMonthlyPercentage = lastMonthDietAverage - currentMonthDietAverage;
							$scope.dietMonthlyPercentage = (($scope.dietMonthlyPercentage / lastMonthDietAverage) * 100).toFixed(0);
						}
						
						if(sleepQualityCheckbox) {
							$scope.sleepMonthlyPercentage = lastMonthSleepAverage - currentMonthSleepAverage;
							$scope.sleepMonthlyPercentage = (($scope.sleepMonthlyPercentage / lastMonthSleepAverage) * 100).toFixed(0);
						}
					})
				})
				*/
				// Fetching total score numbers
				
				queryService.selectQuery("*", "wellnessTrackerEntries", "").then( function(response) {
					
					var checkinCounter = 0;
					
					var averageMoodTotal = 0;
					var averageStressTotal = 0;
					var averageDietTotal = 0;
					var averageSleepTotal = 0;
					
					for(var i = 0; i < response.data.length; i++) {
						averageMoodTotal = averageMoodTotal + parseInt(response.data[i].moodScore);
						averageStressTotal = averageStressTotal + parseInt(response.data[i].stressScore);
						averageDietTotal = averageDietTotal + parseInt(response.data[i].dietScore);
						averageSleepTotal = averageSleepTotal + parseInt(response.data[i].sleepScore);
						checkinCounter++;
					}
					
					$scope.moodGrandAverage = (averageMoodTotal / checkinCounter).toFixed(2);
					$scope.stressGrandAverage = (averageStressTotal / checkinCounter).toFixed(2);
					$scope.dietGrandAverage = (averageDietTotal / checkinCounter).toFixed(2);
					$scope.sleepGrandAverage = (averageSleepTotal / checkinCounter).toFixed(2);
					
					//$scope.grandTotalScore = ((parseInt($scope.moodGrandAverage) + parseInt($scope.anxietyGrandAverage) + parseInt($scope.depressionGrandAverage) + parseInt($scope.stressGrandAverage) + parseInt($scope.dietGrandAverage) + parseInt($scope.sleepGrandAverage)) * 1.666666666666667).toFixed(2);
				
					$scope.pageElements.loadComplete = true;
		
					/*if(parseInt($scope.grandTotalScore)) {
						$scope.pageElements.hideAllElements = false;
					} else {
						$scope.pageElements.hideAllElements = true;
					}*/
				})
			});
		}
	}
}]);

//------------------ Diary Controller --------------------
app.controller('DiaryCtrl', ['$scope', '$window', "queryService", function($scope, $window, queryService){
	
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
}]);

//------------------ Diary Manager Controller --------------------
app.controller('DiaryManagerCtrl', ['$scope', '$window', "queryService", function($scope, $window, queryService){
	
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
}]);

app.controller('MoreDetailsCtrl', ['$scope', 'Carousel', '$window', 'queryService', function($scope, Carousel, $window, queryService){
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
	
	
}]);

app.controller("DailyEntry", ["$scope", "queryService", function ($scope, queryService) {

	$scope.feelingScore = 7;
	$scope.sleepScore = 7;
	$scope.dietScore = 7;
	$scope.stressScore = 7;
	$scope.description = "";
	$scope.saveEntry = saveEntry;

	function saveEntry(){

		var valueStatement = "(SELECT IFNULL(MAX(entryID), 0) + 1 FROM wellnessTrackerEntries), 1, " + $scope.feelingScore + ", '" + $scope.description + "', " + $scope.sleepScore + ", datetime('now')";

        queryService.insertQuery("wellnessTrackerEntries", "entryID,userID,Score,happinessNote,sleepScore,dateEntered", valueStatement).then(function (result) {
			console.log("This is result:", result);
/*
		var valueStatement = "(SELECT IFNULL(MAX(entryID), 0) + 1 FROM wellnessTrackerEntries), 1, " + $scope.moodScore + ", " + $scope.sleepScore + ", " + $scope.dietScore + ", " + $scope.stressScore + ", " + $scope.entryNote + ",  datetime('now')";

        queryService.insertQuery("wellnessTrackerEntries", "entryID,userID,moodScore,sleepScore,dietScore,stressScore,entryNote,dateEntered", valueStatement).then(function (result) {
			console.log("This is result:", result);
*/




			});
	}
}]);

app.controller("ResourcesCtrl", ["$scope", function ($scope) {



}]);