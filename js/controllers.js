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
	// To analyticDashboard function
	$scope.redirectToDashboard = function() {
		$window.location.href = "#/analyticDashboard";
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

	setEntry();

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
app.controller('analyticDashboardCtrl', ['$scope', "queryService", function($scope, queryService){
	
	// Form values
	$scope.data = {
		happinessCheckbox: false,
		anxietyCheckbox: false,
		depressionCheckbox: false,
		stressCheckbox: false,
		angerCheckbox: false,
		sleepQualityCheckbox: false,
		fromDate: new Date(),
		toDate: new Date()
	}
	
	// Page elements
	$scope.pageElements = {
		maximizeButton: true,
		showOutput: false,
		hideAllElements: false,
		happinessValues: false,
		anxietyValues: false,
		depressionValues: false,
		stressValues: false,
		angerValues: false,
		sleepValues: false,
		loadComplete: false,
		loadStarted: false
	}
	
	// Happiness = 0, Anxiety = 1, Depression = 2, Stress = 3, Anger = 4, Sleep Quality = 5
	$scope.graphColours = ["#ff9933", "#cc66ff", "#3366ff", "#669999", "#ff0000", "#000066"];
	
	// Called when "Generate" button is clicked
	$scope.generateChart = function(happinessCheckbox, anxietyCheckbox, depressionCheckbox, stressCheckbox, angerCheckbox, sleepQualityCheckbox, fromDate, toDate) {
		
		// Check if a checkbox is selected, else, don't do anything (If we didn't check, we'd generate a blank chart)
		if(happinessCheckbox || anxietyCheckbox || depressionCheckbox || stressCheckbox || angerCheckbox || sleepQualityCheckbox) {
			
			// Tell our loading bar that the back-end has started
			$scope.pageElements.loadStarted = true;
			
			// Reset our counters
			$scope.totalAverage = 0;
			$scope.totalCheckins = 0;
			$scope.happinessScoreAverage = 0;
			$scope.anxietyScoreAverage = 0;
			$scope.depressionScoreAverage = 0;
			$scope.stressScoreAverage = 0;
			$scope.angerScoreAverage = 0;
			$scope.sleepScoreAverage = 0;
			
			$scope.pageElements.maximizeButton = !$scope.pageElements.maximizeButton;
			$scope.pageElements.showOutput = true;
			
			// Display the appropriate elements if their checkbox was selected
			if($scope.data.happinessCheckbox) {
				$scope.pageElements.happinessValues = true;
			} else {
				$scope.pageElements.happinessValues = false;
			}
			
			if($scope.data.anxietyCheckbox) {
				$scope.pageElements.anxietyValues = true;
			} else {
				$scope.pageElements.anxietyValues = false;
			}
			
			if($scope.data.depressionCheckbox) {
				$scope.pageElements.depressionValues = true;
			} else {
				$scope.pageElements.depressionValues = false;
			}
			
			if($scope.data.stressCheckbox) {
				$scope.pageElements.stressValues = true;
			} else {
				$scope.pageElements.stressValues = false;
			}
			
			if($scope.data.angerCheckbox) {
				$scope.pageElements.angerValues = true;
			} else {
				$scope.pageElements.angerValues = false;
			}
			
			if($scope.data.sleepQualityCheckbox) {
				$scope.pageElements.sleepValues = true;
			} else {
				$scope.pageElements.sleepValues = false;
			}
			
			var selectStatement = "";
			var whereClause = "";
			
			// We need to fill variables depending on whether they were selected or not (We avoid string building doing it this way)
			var happinessScore = "";
			var anxietyScore = "";
			var depressionScore = "";
			var stressScore = "";
			var angerScore = "";
			var sleepQualityScore = "";
			
			if(happinessCheckbox) {
				happinessScore = "happinessScore, ";
			}
			
			if(anxietyCheckbox) {
				anxietyScore = "anxietyScore, ";
			}
			
			if(depressionCheckbox) {
				depressionScore = "depressionScore, ";
			}
			
			if(stressCheckbox) {
				stressScore = "stressScore, ";
			}
			
			if(angerCheckbox) {
				angerScore = "angerScore, ";
			}
			
			if(sleepQualityCheckbox) {
				sleepQualityScore = "sleepScore, ";
			}
			
			// Parse the angular dates into formats we can use using the moment time library (SQLite3 Standard)
			fromDate = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
			toDate = moment(toDate).format('YYYY-MM-DD HH:mm:ss');
			
			// Set the times to their min or max hour accordingly
			var finalFromDate = new String(fromDate.slice(0, 10) + ' 00' + fromDate.slice(13, fromDate.length));
			var finalToDate = new String(fromDate.slice(0, 10) + ' 23' + fromDate.slice(13, fromDate.length));

			// Turn them into a string object so we can use them in our queries
			finalFromDate = finalFromDate.toString();
			finalToDate = finalToDate.toString();

			// Generating the select and where clause
			selectStatement = happinessScore + anxietyScore + depressionScore + stressScore + angerScore + sleepQualityScore + "dateEntered";		
			whereClause = "(dateEntered >= DATETIME('" + fromDate + "') AND dateEntered <= DATETIME('" + toDate + "')) ORDER BY dateEntered";
			
			// Query the actual line graph data
			queryService.selectQuery(selectStatement, "wellnessTrackerEntries", whereClause).then(function(response) {
				$scope.entries = response.data;
				
				var labelsArray = [];
				
				var happinessScoreArray = [];
				var anxietyScoreArray = [];
				var depressionScoreArray = [];
				var stressScoreArray = [];
				var angerScoreArray = [];
				var sleepScoreArray = [];				
				
				var happinessScoreTotal = 0;
				var anxietyScoreTotal = 0;
				var depressionScoreTotal = 0;
				var stressScoreTotal = 0;
				var angerScoreTotal = 0;
				var sleepScoreTotal = 0;
				
				$scope.totalCheckins = 0;
				
				// Each array is aligned, apply the actual values from our query
				for(var i = 0; i < $scope.entries.length; i++) {
					
					$scope.totalCheckins++;
					
					labelsArray[i] = $scope.entries[i].dateEntered;
					
					if(happinessCheckbox) {
						happinessScoreArray[i] = $scope.entries[i].happinessScore;
						happinessScoreTotal = happinessScoreTotal + parseInt($scope.entries[i].happinessScore);
					}
					
					if(anxietyCheckbox) {
						anxietyScoreArray[i] = $scope.entries[i].anxietyScore;
						anxietyScoreTotal = anxietyScoreTotal + parseInt($scope.entries[i].anxietyScore);
					}
					
					if(depressionCheckbox) {
						depressionScoreArray[i] = $scope.entries[i].depressionScore;
						depressionScoreTotal = depressionScoreTotal + parseInt($scope.entries[i].depressionScore);
					}
					
					if(stressCheckbox) {
						stressScoreArray[i] = $scope.entries[i].stressScore;
						stressScoreTotal = stressScoreTotal + parseInt($scope.entries[i].stressScore);
					}
					
					if(angerCheckbox) {
						angerScoreArray[i] = $scope.entries[i].angerScore;
						angerScoreTotal = angerScoreTotal + parseInt($scope.entries[i].angerScore);
					}
					
					if(sleepQualityCheckbox) {
						sleepScoreArray[i] = $scope.entries[i].sleepScore;
						sleepScoreTotal = sleepScoreTotal + parseInt($scope.entries[i].sleepScore);
					}
				}
				
				// Loops through all the checkins, and counts the number of duplicate days to determine the average number of checkins per day
				var currentComparedDate = labelsArray[1];
				$scope.duplicateDatesFound = 0;
				
				for(var i= 0; i < labelsArray.length; i++) {
					if(moment(labelsArray[i]).isSame(currentComparedDate, 'day')) {
						$scope.duplicateDatesFound++;
					} else {
						currentComparedDate = labelsArray[i];
					}
				}
				
				$scope.duplicateDatesFound = ($scope.duplicateDatesFound / labelsArray.length).toFixed(2);
				
				// If their appropriate checkbox is selected, calculate the average score
				if(happinessCheckbox) $scope.happinessScoreAverage = (happinessScoreTotal / $scope.totalCheckins).toFixed(2);
				if(anxietyCheckbox) $scope.anxietyScoreAverage = (anxietyScoreTotal / $scope.totalCheckins).toFixed(2);
				if(depressionCheckbox) $scope.depressionScoreAverage = (depressionScoreTotal / $scope.totalCheckins).toFixed(2);
				if(stressCheckbox) $scope.stressScoreAverage = (stressScoreTotal / $scope.totalCheckins).toFixed(2);
				if(angerCheckbox) $scope.angerScoreAverage = (angerScoreTotal / $scope.totalCheckins).toFixed(2);
				if(sleepQualityCheckbox) $scope.sleepScoreAverage = (sleepScoreTotal / $scope.totalCheckins).toFixed(2);
				
				// Build our graph object
				var graphDataSets = [];
				
				// If happinessCheckbox was selected, build our happiness line
				if(happinessCheckbox) {
					
					var happinessCheckboxIndex = graphDataSets.length;
					
					graphDataSets[graphDataSets.length] = { 
						data: happinessScoreArray,
						label: "Happiness Score",
						borderColor: $scope.graphColours[0],
						fill: false
					}
				}
				
				// If anxietyCheckbox was selected, build our anxiety line
				if(anxietyCheckbox) {
					
					var anxietyCheckboxIndex = graphDataSets.length;
					
					graphDataSets[graphDataSets.length] = { 
						data: anxietyScoreArray,
						label: "Anxiety Score",
						borderColor: $scope.graphColours[1],
						fill: false
					}
				}
				
				// If depressionCheckbox was selected, build our depression line
				if(depressionCheckbox) {
					
					var depressionCheckboxIndex = graphDataSets.length;
					
					graphDataSets[graphDataSets.length] = { 
						data: depressionScoreArray,
						label: "Depression Score",
						borderColor: $scope.graphColours[2],
						fill: false
					}
				}
				
				// If stressCheckbox was selected, build our stress line
				if(stressCheckbox) {
					
					var stressCheckboxIndex = graphDataSets.length;
					
					graphDataSets[graphDataSets.length] = { 
						data: stressScoreArray,
						label: "Stress Score",
						borderColor: $scope.graphColours[3],
						fill: false
					}
				}
				
				// If angerCheckbox was selected, build our anger line
				if(angerCheckbox) {
					
					var angerCheckboxIndex = graphDataSets.length;
					
					graphDataSets[graphDataSets.length] = { 
						data: angerScoreArray,
						label: "Anger Score",
						borderColor: $scope.graphColours[4],
						fill: false
					}
				}
				
				// If sleepQualityCheckbox was selected, build our sleep quality line
				if(sleepQualityCheckbox) {
					
					var sleepQualityCheckboxIndex = graphDataSets.length;
					
					graphDataSets[graphDataSets.length] = { 
						data: sleepScoreArray,
						label: "Sleep Quality Score",
						borderColor: $scope.graphColours[5],
						fill: false
					}
				}
				
				var datasetsObject = [];
				
				if(happinessCheckbox) {
					datasetsObject[datasetsObject.length] = {label: graphDataSets[happinessCheckboxIndex].label, data: graphDataSets[happinessCheckboxIndex].data, borderColor: graphDataSets[happinessCheckboxIndex].borderColor, fill: graphDataSets[happinessCheckboxIndex].fill};
				}
				
				if(anxietyCheckbox) {
					datasetsObject[datasetsObject.length] = {label: graphDataSets[anxietyCheckboxIndex].label, data: graphDataSets[anxietyCheckboxIndex].data, borderColor: graphDataSets[anxietyCheckboxIndex].borderColor, fill: graphDataSets[anxietyCheckboxIndex].fill};
				}
				
				if(depressionCheckbox) {
					datasetsObject[datasetsObject.length] = {label: graphDataSets[depressionCheckboxIndex].label, data: graphDataSets[depressionCheckboxIndex].data, borderColor: graphDataSets[depressionCheckboxIndex].borderColor, fill: graphDataSets[depressionCheckboxIndex].fill};
				}
				
				if(stressCheckbox) {
					datasetsObject[datasetsObject.length] = {label: graphDataSets[stressCheckboxIndex].label, data: graphDataSets[stressCheckboxIndex].data, borderColor: graphDataSets[stressCheckboxIndex].borderColor, fill: graphDataSets[stressCheckboxIndex].fill};
				}
				
				if(angerCheckbox) {
					datasetsObject[datasetsObject.length] = {label: graphDataSets[angerCheckboxIndex].label, data: graphDataSets[angerCheckboxIndex].data, borderColor: graphDataSets[angerCheckboxIndex].borderColor, fill: graphDataSets[angerCheckboxIndex].fill};
				}
				
				if(sleepQualityCheckbox) {
					datasetsObject[datasetsObject.length] = {label: graphDataSets[sleepQualityCheckboxIndex].label, data: graphDataSets[sleepQualityCheckboxIndex].data, borderColor: graphDataSets[sleepQualityCheckboxIndex].borderColor, fill: graphDataSets[sleepQualityCheckboxIndex].fill};
				}
				
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
				
				// Calculating last week's percentage change
				
				var weekDay = moment().isoWeekday();
				var today = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
				
				// Fetching this weeks data
				whereClause = "dateEntered BETWEEN DATETIME('" + today + "', '-" + weekDay + " day') AND DATETIME('" + today + "') ORDER BY dateEntered;";
				
				queryService.selectQuery(selectStatement, "wellnessTrackerEntries", whereClause).then( function(response) {
					
					var averageHappinessTotal = 0;
					var currentWeekHappinessAverage = 0;
					var averageAnxietyTotal = 0;
					var currentWeekAnxietyAverage = 0;
					var averageDepressionTotal = 0;
					var currentWeekDepressionAverage = 0;
					var averageStressTotal = 0;
					var currentWeekStressAverage = 0;
					var averageAngerTotal = 0;
					var currentWeekAngerAverage = 0;
					var averageSleepTotal = 0;
					var currentWeekSleepAverage = 0;
					
					var checkinCounter = 0;
					
					// Grab the averages for this week, so we can compare it to last week
					for(var i = 0; i < response.data.length; i++) {
						
						if(happinessCheckbox) averageHappinessTotal = averageHappinessTotal + parseInt(response.data[i].happinessScore);
						if(anxietyCheckbox) averageAnxietyTotal = averageAnxietyTotal + parseInt(response.data[i].anxietyScore);
						if(depressionCheckbox) averageDepressionTotal = averageDepressionTotal + parseInt(response.data[i].depressionScore);
						if(stressCheckbox) averageStressTotal = averageStressTotal + parseInt(response.data[i].stressScore);
						if(angerCheckbox) averageAngerTotal = averageAngerTotal + parseInt(response.data[i].angerScore);
						if(sleepQualityCheckbox) averageSleepTotal = averageSleepTotal + parseInt(response.data[i].sleepScore);
						checkinCounter++;
					}
					
					if(happinessCheckbox) currentWeekHappinessAverage = (averageHappinessTotal / checkinCounter).toFixed(2);
					if(anxietyCheckbox) currentWeekAnxietyAverage = (averageAnxietyTotal / checkinCounter).toFixed(2);
					if(depressionCheckbox) currentWeekDepressionAverage = (averageDepressionTotal / checkinCounter).toFixed(2);
					if(stressCheckbox) currentWeekStressAverage = (averageStressTotal / checkinCounter).toFixed(2);
					if(angerCheckbox) currentWeekAngerAverage = (averageAngerTotal / checkinCounter).toFixed(2);
					if(sleepQualityCheckbox) currentWeekSleepAverage = (averageSleepTotal / checkinCounter).toFixed(2);
					
					// Fetching last week's data
					
					var beginningOfWeekMinusAnotherWeek = weekDay + 6;
					
					whereClause = "dateEntered BETWEEN DATETIME('" + today + "', '-" + beginningOfWeekMinusAnotherWeek + " days') AND DATETIME('" + today + "', '-" + weekDay + " days') ORDER BY dateEntered";
					
					queryService.selectQuery(selectStatement, "wellnessTrackerEntries", whereClause).then( function(response) {				
						
						var lastWeekHappinessAverage = 0;
						var lastWeekAnxietyAverage = 0;
						var lastWeekDepressionAverage = 0;
						var lastWeekStressAverage = 0;
						var lastWeekAngerAverage = 0;
						var lastWeekSleepAverage = 0;
						
						averageHappinessTotal = 0;
						averageAnxietyTotal = 0;
						averageDepressionTotal = 0;
						averageStressTotal = 0;
						averageAngerTotal = 0;
						averageSleepTotal = 0;
						
						var checkinCounter = 0;
						
						// Grab the averages from last week
						for(var i = 0; i < response.data.length; i++) {
							if(happinessCheckbox) averageHappinessTotal = averageHappinessTotal + parseInt(response.data[i].happinessScore);
							if(anxietyCheckbox) averageAnxietyTotal = averageAnxietyTotal + parseInt(response.data[i].anxietyScore);
							if(depressionCheckbox) averageDepressionTotal = averageDepressionTotal + parseInt(response.data[i].depressionScore);
							if(stressCheckbox) averageStressTotal = averageStressTotal + parseInt(response.data[i].stressScore);
							if(angerCheckbox) averageAngerTotal = averageAngerTotal + parseInt(response.data[i].angerScore);
							if(sleepQualityCheckbox) averageSleepTotal = averageSleepTotal + parseInt(response.data[i].sleepScore);
							checkinCounter++;
						}
						
						if(happinessCheckbox) lastWeekHappinessAverage = (averageHappinessTotal / checkinCounter).toFixed(2);
						if(anxietyCheckbox) lastWeekAnxietyAverage = (averageAnxietyTotal / checkinCounter).toFixed(2);
						if(depressionCheckbox) lastWeekDepressionAverage = (averageDepressionTotal / checkinCounter).toFixed(2);
						if(stressCheckbox) lastWeekStressAverage = (averageStressTotal / checkinCounter).toFixed(2);
						if(angerCheckbox) lastWeekAngerAverage = (averageAngerTotal / checkinCounter).toFixed(2);
						if(sleepQualityCheckbox) lastWeekSleepAverage = (averageSleepTotal / checkinCounter).toFixed(2);
						
						// Calculate Percentage difference
						if(happinessCheckbox) {
							$scope.happinessWeeklyPercentage = lastWeekHappinessAverage - currentWeekHappinessAverage;
							$scope.happinessWeeklyPercentage = (($scope.happinessWeeklyPercentage / lastWeekHappinessAverage) * 100).toFixed(0);
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
						
						if(angerCheckbox) {
							$scope.angerWeeklyPercentage = lastWeekAngerAverage - currentWeekAngerAverage;
							$scope.angerWeeklyPercentage = (($scope.angerWeeklyPercentage / lastWeekAngerAverage) * 100).toFixed(0);
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
					
					var currentMonthHappinessAverage = 0;
					var currentMonthAnxietyAverage = 0;
					var currentMonthDepressionAverage = 0;
					var currentMonthStressAverage = 0;
					var currentMonthAngerAverage = 0;
					var currentMonthSleepAverage = 0;
					
					var averageHappinessTotal = 0;
					var averageAnxietyTotal = 0;
					var averageDepressionTotal = 0;
					var averageStressTotal = 0;
					var averageAngerTotal = 0;
					var averageSleepTotal = 0;
				
					var checkinCounter = 0;
					
					// Calculate the averages for this month, so we can compare it to last month
					for(var i = 0; i < response.data.length; i++) {
						
						if(happinessCheckbox) averageHappinessTotal = averageHappinessTotal + parseInt(response.data[i].happinessScore);
						if(anxietyCheckbox) averageAnxietyTotal = averageAnxietyTotal + parseInt(response.data[i].anxietyScore);
						if(depressionCheckbox) averageDepressionTotal = averageDepressionTotal + parseInt(response.data[i].depressionScore);
						if(stressCheckbox) averageStressTotal = averageStressTotal + parseInt(response.data[i].stressScore);
						if(angerCheckbox) averageAngerTotal = averageAngerTotal + parseInt(response.data[i].angerScore);
						if(sleepQualityCheckbox) averageSleepTotal = averageSleepTotal + parseInt(response.data[i].sleepScore);
						checkinCounter++;
					}
					
					if(happinessCheckbox) currentMonthHappinessAverage = (averageHappinessTotal / checkinCounter).toFixed(2);
					if(anxietyCheckbox) currentMonthAnxietyAverage = (averageAnxietyTotal / checkinCounter).toFixed(2);
					if(depressionCheckbox) currentMonthDepressionAverage = (averageDepressionTotal / checkinCounter).toFixed(2);
					if(stressCheckbox) currentMonthStressAverage = (averageStressTotal / checkinCounter).toFixed(2);
					if(angerCheckbox) currentMonthAngerAverage = (averageAngerTotal / checkinCounter).toFixed(2);
					if(sleepQualityCheckbox) currentMonthSleepAverage = (averageSleepTotal / checkinCounter).toFixed(2);
					
					// Fetching last month's data
					
					var beginningOfMonthMinusAnotherMonth = weekDay + 30;
					
					whereClause = "dateEntered BETWEEN DATETIME('" + today + "', '-" + beginningOfMonthMinusAnotherMonth + " days') AND DATETIME('" + today + "', '-" + monthDay + " days') ORDER BY dateEntered";
					
					queryService.selectQuery(selectStatement, "wellnessTrackerEntries", whereClause).then( function(response) {				
						
						var lastMonthHappinessAverage = 0;
						var lastMonthAnxietyAverage = 0;
						var lastMonthDepressionAverage = 0;
						var lastMonthStressAverage = 0;
						var lastMonthAngerAverage = 0;
						var lastMonthSleepAverage = 0;
						
						var averageHappinessTotal = 0;
						var averageAnxietyTotal = 0;
						var averageDepressionTotal = 0;
						var averageStressTotal = 0;
						var averageAngerTotal = 0;
						var averageSleepTotal = 0;
						
						var checkinCounter = 0;
						
						// Calculate last months averages
						for(var i = 0; i < response.data.length; i++) {
							if(happinessCheckbox) averageHappinessTotal = averageHappinessTotal + parseInt(response.data[i].happinessScore);
							if(anxietyCheckbox) averageAnxietyTotal = averageAnxietyTotal + parseInt(response.data[i].anxietyScore);
							if(depressionCheckbox) averageDepressionTotal = averageDepressionTotal + parseInt(response.data[i].depressionScore);
							if(stressCheckbox) averageStressTotal = averageStressTotal + parseInt(response.data[i].stressScore);
							if(angerCheckbox) averageAngerTotal = averageAngerTotal + parseInt(response.data[i].angerScore);
							if(sleepQualityCheckbox) averageSleepTotal = averageSleepTotal + parseInt(response.data[i].sleepScore);
							checkinCounter++;
						}
						
						if(happinessCheckbox) lastMonthHappinessAverage = (averageHappinessTotal / checkinCounter).toFixed(2);
						if(anxietyCheckbox) lastMonthAnxietyAverage = (averageAnxietyTotal / checkinCounter).toFixed(2);
						if(depressionCheckbox) lastMonthDepressionAverage = (averageDepressionTotal / checkinCounter).toFixed(2);
						if(stressCheckbox) lastMonthStressAverage = (averageStressTotal / checkinCounter).toFixed(2);
						if(angerCheckbox) lastMonthAngerAverage = (averageAngerTotal / checkinCounter).toFixed(2);
						if(sleepQualityCheckbox) lastMonthSleepAverage = (averageSleepTotal / checkinCounter).toFixed(2);
						
						// Calculate Percentage difference
						if(happinessCheckbox) {
							$scope.happinessMonthlyPercentage = lastMonthHappinessAverage - currentMonthHappinessAverage;
							$scope.happinessMonthlyPercentage = (($scope.happinessMonthlyPercentage / lastMonthHappinessAverage) * 100).toFixed(0);
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
						
						if(angerCheckbox) {
							$scope.angerMonthlyPercentage = lastMonthAngerAverage - currentMonthAngerAverage;
							$scope.angerMonthlyPercentage = (($scope.angerMonthlyPercentage / lastMonthAngerAverage) * 100).toFixed(0);
						}
						
						if(sleepQualityCheckbox) {
							$scope.sleepMonthlyPercentage = lastMonthSleepAverage - currentMonthSleepAverage;
							$scope.sleepMonthlyPercentage = (($scope.sleepMonthlyPercentage / lastMonthSleepAverage) * 100).toFixed(0);
						}
					})
				})
				
				// Fetching total score numbers
				
				queryService.selectQuery("*", "wellnessTrackerEntries", "").then( function(response) {
					
					var checkinCounter = 0;
					
					var averageHappinessTotal = 0;
					var averageAnxietyTotal = 0;
					var averageDepressionTotal = 0;
					var averageStressTotal = 0;
					var averageAngerTotal = 0;
					var averageSleepTotal = 0;
					
					for(var i = 0; i < response.data.length; i++) {
						averageHappinessTotal = averageHappinessTotal + parseInt(response.data[i].happinessScore);
						averageAnxietyTotal = averageAnxietyTotal + parseInt(response.data[i].anxietyScore);
						averageDepressionTotal = averageDepressionTotal + parseInt(response.data[i].depressionScore);
						averageStressTotal = averageStressTotal + parseInt(response.data[i].stressScore);
						averageAngerTotal = averageAngerTotal + parseInt(response.data[i].angerScore);
						averageSleepTotal = averageSleepTotal + parseInt(response.data[i].sleepScore);
						checkinCounter++;
					}
					
					$scope.happinessGrandAverage = (averageHappinessTotal / checkinCounter).toFixed(2);
					$scope.anxietyGrandAverage = (averageAnxietyTotal / checkinCounter).toFixed(2);
					$scope.depressionGrandAverage = (averageDepressionTotal / checkinCounter).toFixed(2);
					$scope.stressGrandAverage = (averageStressTotal / checkinCounter).toFixed(2);
					$scope.angerGrandAverage = (averageAngerTotal / checkinCounter).toFixed(2);
					$scope.sleepGrandAverage = (averageSleepTotal / checkinCounter).toFixed(2);
					
					$scope.grandTotalScore = ((parseInt($scope.happinessGrandAverage) + parseInt($scope.anxietyGrandAverage) + parseInt($scope.depressionGrandAverage) + parseInt($scope.stressGrandAverage) + parseInt($scope.angerGrandAverage) + parseInt($scope.sleepGrandAverage)) * 1.666666666666667).toFixed(2);
				
					$scope.pageElements.loadComplete = true;
		
					if(parseInt($scope.grandTotalScore)) {
						$scope.pageElements.hideAllElements = false;
					} else {
						$scope.pageElements.hideAllElements = true;
					}
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

app.controller('MoreDetailsCtrl', ['$scope', 'Carousel', function($scope, Carousel){
	$scope.Carousel = Carousel;
}]);

app.controller("DailyEntry", ["$scope", "queryService", function ($scope, queryService) {


	$scope.feelingScore = 3;
	$scope.sleepScore = 3;
	$scope.description = "";
	$scope.saveEntry = saveEntry;

	function saveEntry(){

		var valueStatement = "(SELECT IFNULL(MAX(entryID), 0) + 1 FROM wellnessTrackerEntries), 1, " + $scope.feelingScore + ", '" + $scope.description + "', " + $scope.sleepScore + ", datetime('now')";

        queryService.insertQuery("wellnessTrackerEntries", "entryID,userID,happinessScore,happinessNote,sleepScore,dateEntered", valueStatement).then(function (result) {
			console.log("This is result:", result);
        });

	}


}]);

app.controller("ResourcesCtrl", ["$scope", function ($scope) {



}]);