// This file contains all functionality that goes along with a page. The controller that goes along with a page is defined in app.js

var app = angular.module("zenApp.controllers", ['ngRoute', 'ngMaterial']);

//------------------ Home Controller --------------------
app.controller('HomeCtrl', ['$scope', function($scope){
	/* Placeholder Controller */
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
	/	4. Develop proper REST API functionality (Pending research into Android/IOS file systems) 
	*/
	
	// Storage options for Select Queries
	$scope.selectQueryValues = {
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
		
		// Given the select, from, and where statements, returns a promise, also sets $scope.response to the data returned from the query
		$scope.selectQuery(inputSelectStatement, inputFromStatement, inputWhereStatement).then(function() {
			
			// Storing the response's data (I.E the query results) (Example)
			$scope.query = $scope.response.data;
			
			// Storing the keys from the query statement (Example)
			$scope.keys = Object.keys($scope.query[0]);		
		});
	};
	
	// Function that is called via update query button on sqlTester.html
	$scope.runUpdateQuery = function(inputUpdateStatement, inputSetStatement, inputWhereStatement) {
		
		// Given the update, set, and where statement: runs the supplied query and returns a promise, also sets $scope.response to true/false depending on success/failure
		$scope.updateQuery(inputUpdateStatement, inputSetStatement, inputWhereStatement).then(function() {
		});
	};
	
	// Function that is called via insert query button on sqlTester.html
	$scope.runInsertQuery = function(inputInsertStatement, inputColumnStatement, inputValueStatement) {
		
		// Given the table name, columns, and values to be inserted: runs the supplied query and returns a promise, also sets $scope.response to true/false depending on success/failure
		$scope.insertQuery(inputInsertStatement, inputColumnStatement, inputValueStatement).then(function() {
		});
	};
	
	// Function that is called via delete query button on sqlTester.html
	$scope.runDeleteQuery = function(inputTableStatement, inputWhereStatement) {
		
		// Given the table name, columns, and values to be inserted: runs the supplied query and returns a promise, also sets $scope.response to true/false depending on success/failure
		$scope.deleteQuery(inputTableStatement, inputWhereStatement).then(function() {
		});
	};
}]);

//------------------ toolStore Controller (Place holder/Demo) --------------------
app.controller('ToolStoreCtrl', ['$scope', '$window', function($scope, $window){
	
	/* Things to do: 
	// 1. Add "Add to toolbelt" Button
	// 2. Add picture functionality for tools
	// 3. Hide Tools if they're already a part of the user's toolbelt
	*/
	
	// Fetch all the Tools
	$scope.selectQuery("*", "tools", "").then(function() {
		$scope.tools = $scope.response.data;
	})
	
	// Place holder for addTool to toolBelt function
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
		
		// Calculating the total scores (This SHOULD be done in the DB - Justin)
		for(var i = 0; i < $scope.entries.length; i++) {
			$scope.entries[i].entryScore = (parseInt($scope.entries[i].happinessScore) + parseInt($scope.entries[i].sleepScore)) * 5;
		}
	});
	
	// Redirect method for checkinLog.html -> checkinLogInfo.html, also stores the selected tool ID in localStorage
	$scope.redirectMoreDetails = function(entryID) {
		localStorage.setItem("selectedEntryID", entryID);
		$window.location.href = "#/checkinLogInfo";
	}
	// To analyticDashboard function
	$scope.redirectToDashboard = function() {
		$window.location.href = "#/analyticDashboard";
	}
}]);

//------------------ checkinLogInfo Controller --------------------
app.controller('CheckinLogInfoCtrl', ['$scope', '$window', '$document', function($scope, $window, $document){

	// Check if the user is coming from checkinLog.html, if not, redirect to home
	if(localStorage.getItem("selectedEntryID") == null) {
		$window.location.href= "#/home";
	} 
	
	// --- Weekly Linegraphs --- //
	
	// Grab the individual entry that the user selected on checkinLog.html
	var whereClause = "entryID = '" + localStorage.getItem("selectedEntryID") + "'";
	
	$scope.selectQuery("*", "wellnessTrackerEntries", whereClause).then(function() {
		
		$scope.selectedEntry = $scope.response.data[0];
		
		// Generating the selected log's score (This should be a field in the DB - Justin)
		$scope.selectedEntry.entryScore = (parseInt($scope.selectedEntry.happinessScore) + parseInt($scope.selectedEntry.sleepScore)) * 5;
		
		// Apply the date restriction to our where clause (Within 7 days)
		whereClause = "(dateEntered >= DATETIME('" + $scope.selectedEntry.dateEntered + "', '-6 days') AND dateEntered <= DATETIME('" + $scope.selectedEntry.dateEntered + "')) ORDER BY dateEntered";
		
		// Select all wellnessTrackerEntries that are between the given dates above
		$scope.selectQuery("*", "wellnessTrackerEntries", whereClause).then(function() {
			$scope.weeklyEntries = $scope.response.data;
			
			// Weekly Date Labels, for example, YYYY-MM-DD HH:MM:SS
			var weeklyLabels = []
			
			// Weekly HappinessScore Labels, for example, 1-10
			var happinessScoreWeekly = [];
			
			// Weekly SleepScore Labels, for example, 1-10
			var sleepScoreWeekly = [];
			
			// For each entry involved in the provided week, attach its appropriate label
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
			}, options: {
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
			}, options: {
					title: {
						display: true,
						text: 'Wellness Trend'
					}
				}
			});
			
			// Setup weekly average values
			
			// Weekly Happiness Average
			$scope.weeklyHappinessAverage = 0;
			
			// Add each happinessScore entry, then divide them by the total of entries to produce the average
			for(var i = 0; i < happinessScoreWeekly.length; i++) {
				$scope.weeklyHappinessAverage = $scope.weeklyHappinessAverage + parseInt(happinessScoreWeekly[i]);
			}
			
			$scope.weeklyHappinessAverage = $scope.weeklyHappinessAverage/happinessScoreWeekly.length;
			$scope.weeklyHappinessAverage = $scope.weeklyHappinessAverage.toFixed(1);
			
			// Weekly Sleep Average
			$scope.weeklySleepAverage = 0;
			
			// Add each sleepScore entry, then divide them by the total of entries to produce the average
			for(var i = 0; i < sleepScoreWeekly.length; i++) {
				$scope.weeklySleepAverage = $scope.weeklySleepAverage + parseInt(sleepScoreWeekly[i]);
			}
			
			$scope.weeklySleepAverage = $scope.weeklySleepAverage/sleepScoreWeekly.length;
			$scope.weeklySleepAverage = $scope.weeklySleepAverage.toFixed(1);
		});
		
		// --- Monthly Linegraphs --- //
		
		// Apply the date restriction to our where clause (Within 30 days)
		whereClause = "(dateEntered >= DATETIME('" + $scope.selectedEntry.dateEntered + "', '-30 days') AND dateEntered <= DATETIME('" + $scope.selectedEntry.dateEntered + "')) ORDER BY dateEntered";
		
		// Select all wellnessTrackerEntries that are between the given dates above
		$scope.selectQuery("*", "wellnessTrackerEntries", whereClause).then(function() {
			$scope.monthlyEntries = $scope.response.data;
			
			// Monthly Date Labels, for example, YYYY-MM-DD HH:MM:SS
			var monthlyLabels = [];
			
			// Monthly HappinessScore Labels, for example, 1-10
			var happinessScoreMonthly = [];
			
			// Monthly SleepScore Labels, for example, 1-10
			var sleepScoreMonthly = [];
			
			// For each entry involved in the provided month, attach its appropriate label
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
			}, options: {
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
			}, options: {
					title: {
						display: true,
						text: 'Wellness Trend'
					}
				}
			});
			
			// Setup Monthly Average values
			
			// Monthly Happiness Average
			$scope.monthlyHappinessAverage = 0;
			
			// Add each happinessScore entry, then divide them by the total of entries to produce the average.
			for(var i = 0; i < happinessScoreMonthly.length; i++) {
				$scope.monthlyHappinessAverage = $scope.monthlyHappinessAverage + parseInt(happinessScoreMonthly[i]);
			}
			
			$scope.monthlyHappinessAverage = $scope.monthlyHappinessAverage/happinessScoreMonthly.length;
			$scope.monthlyHappinessAverage = $scope.monthlyHappinessAverage.toFixed(1);
			
			// Monthly Sleep Average
			$scope.monthlySleepAverage = 0;
			
			// Add each sleepScore entry, then divide them by the total of entries to produce the average.
			for(var i = 0; i < sleepScoreMonthly.length; i++) {
				$scope.monthlySleepAverage = $scope.monthlySleepAverage + parseInt(sleepScoreMonthly[i]);
			}
			
			$scope.monthlySleepAverage = $scope.monthlySleepAverage/sleepScoreMonthly.length;
			$scope.monthlySleepAverage = $scope.monthlySleepAverage.toFixed(1);
			
		});
		
		// --- Quarterly Linegraphs --- //
		
		// Select all wellnessTrackerEntries that are between the given dates above
		whereClause = "(dateEntered >= DATETIME('" + $scope.selectedEntry.dateEntered + "', '-90 days') AND dateEntered <= DATETIME('" + $scope.selectedEntry.dateEntered + "')) ORDER BY dateEntered";

		$scope.selectQuery("*", "wellnessTrackerEntries", whereClause).then(function() {
			$scope.quarterlyEntries = $scope.response.data;
		
			
			// Quarterly Date Labels, for example, YYYY-MM-DD HH:MM:SS
			var quarterlyLabels = [];
			
			// Quarterly HappinessScore Labels, for example, 1-10
			var happinessScoreQuarterly = [];
			
			// Quarterly SleepScore Labels, for example, 1-10
			var sleepScoreQuarterly = [];
			
			// For each entry involved in the provided quarter, attach its appropriate label
			for(var i = 0; i < $scope.quarterlyEntries.length; i++) {
				quarterlyLabels[i] = $scope.quarterlyEntries[i].dateEntered;
				happinessScoreQuarterly[i] = $scope.quarterlyEntries[i].happinessScore;
				sleepScoreQuarterly[i] = $scope.quarterlyEntries[i].sleepScore;
			}		
			
			// Set up Quarterly Happiness Graph
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
			}, options: {
					title: {
						display: true,
						text: 'Wellness Trend'
					}
				}
			});
			
			// Set up Quarterly Sleep Graph
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
			}, options: {
					title: {
						display: true,
						text: 'Wellness Trend'
					}
				}
			});
			
			// Setup Quarterly Average values
			
			// Quarterly Happiness Average
			$scope.quarterlyHappinessAverage = 0;
			
			// Add each happinessScore entry, then divide them by the total of entries to produce the average
			for(var i = 0; i < happinessScoreQuarterly.length; i++) {
				$scope.quarterlyHappinessAverage = $scope.quarterlyHappinessAverage + parseInt(happinessScoreQuarterly[i]);
			}
			
			$scope.quarterlyHappinessAverage = $scope.quarterlyHappinessAverage/happinessScoreQuarterly.length;
			$scope.quarterlyHappinessAverage = $scope.quarterlyHappinessAverage.toFixed(1);
			
			// Quarterly Sleep Average
			$scope.quarterlySleepAverage = 0;
			
			// Add each sleepScore entry, then divide them by the total of entries to produce the average
			for(var i = 0; i < sleepScoreQuarterly.length; i++) {
				$scope.quarterlySleepAverage = $scope.quarterlySleepAverage + parseInt(sleepScoreQuarterly[i]);
			}
			
			$scope.quarterlySleepAverage = $scope.quarterlySleepAverage/sleepScoreQuarterly.length;
			$scope.quarterlySleepAverage = $scope.quarterlySleepAverage.toFixed(1);
			
		});		
	});
}]);

//------------------ Analytic Dashboard Controller --------------------
app.controller('analyticDashboardCtrl', ['$scope', function($scope){
	
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
			$scope.selectQuery(selectStatement, "wellnessTrackerEntries", whereClause).then(function() {
				$scope.entries = $scope.response.data;
				
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
				today = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
				
				// Fetching this weeks data
				whereClause = "dateEntered BETWEEN DATETIME('" + today + "', '-" + weekDay + " day') AND DATETIME('" + today + "') ORDER BY dateEntered;";
				
				$scope.selectQuery(selectStatement, "wellnessTrackerEntries", whereClause).then( function() {
					
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
					for(var i = 0; i < $scope.response.data.length; i++) {
						
						if(happinessCheckbox) averageHappinessTotal = averageHappinessTotal + parseInt($scope.response.data[i].happinessScore);
						if(anxietyCheckbox) averageAnxietyTotal = averageAnxietyTotal + parseInt($scope.response.data[i].anxietyScore);
						if(depressionCheckbox) averageDepressionTotal = averageDepressionTotal + parseInt($scope.response.data[i].depressionScore);
						if(stressCheckbox) averageStressTotal = averageStressTotal + parseInt($scope.response.data[i].stressScore);
						if(angerCheckbox) averageAngerTotal = averageAngerTotal + parseInt($scope.response.data[i].angerScore);
						if(sleepQualityCheckbox) averageSleepTotal = averageSleepTotal + parseInt($scope.response.data[i].sleepScore);
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
					
					$scope.selectQuery(selectStatement, "wellnessTrackerEntries", whereClause).then( function() {				
						
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
						for(var i = 0; i < $scope.response.data.length; i++) {
							if(happinessCheckbox) averageHappinessTotal = averageHappinessTotal + parseInt($scope.response.data[i].happinessScore);
							if(anxietyCheckbox) averageAnxietyTotal = averageAnxietyTotal + parseInt($scope.response.data[i].anxietyScore);
							if(depressionCheckbox) averageDepressionTotal = averageDepressionTotal + parseInt($scope.response.data[i].depressionScore);
							if(stressCheckbox) averageStressTotal = averageStressTotal + parseInt($scope.response.data[i].stressScore);
							if(angerCheckbox) averageAngerTotal = averageAngerTotal + parseInt($scope.response.data[i].angerScore);
							if(sleepQualityCheckbox) averageSleepTotal = averageSleepTotal + parseInt($scope.response.data[i].sleepScore);
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
				
				$scope.selectQuery(selectStatement, "wellnessTrackerEntries", whereClause).then( function() {
					
					var currentMonthHappinessAverage = 0;
					var currentMonthAnxietyAverage = 0;
					var currentMonthDepressionAverage = 0;
					var currentMonthStressAverage = 0;
					var currentMonthAngerAverage = 0;
					var currentMonthSleepAverage = 0;
					
					averageHappinessTotal = 0;
					averageAnxietyTotal = 0;
					averageDepressionTotal = 0;
					averageStressTotal = 0;
					averageAngerTotal = 0;
					averageSleepTotal = 0;
				
					var checkinCounter = 0;
					
					// Calculate the averages for this month, so we can compare it to last month
					for(var i = 0; i < $scope.response.data.length; i++) {
						
						if(happinessCheckbox) averageHappinessTotal = averageHappinessTotal + parseInt($scope.response.data[i].happinessScore);
						if(anxietyCheckbox) averageAnxietyTotal = averageAnxietyTotal + parseInt($scope.response.data[i].anxietyScore);
						if(depressionCheckbox) averageDepressionTotal = averageDepressionTotal + parseInt($scope.response.data[i].depressionScore);
						if(stressCheckbox) averageStressTotal = averageStressTotal + parseInt($scope.response.data[i].stressScore);
						if(angerCheckbox) averageAngerTotal = averageAngerTotal + parseInt($scope.response.data[i].angerScore);
						if(sleepQualityCheckbox) averageSleepTotal = averageSleepTotal + parseInt($scope.response.data[i].sleepScore);
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
					
					$scope.selectQuery(selectStatement, "wellnessTrackerEntries", whereClause).then( function() {				
						
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
						for(var i = 0; i < $scope.response.data.length; i++) {
							if(happinessCheckbox) averageHappinessTotal = averageHappinessTotal + parseInt($scope.response.data[i].happinessScore);
							if(anxietyCheckbox) averageAnxietyTotal = averageAnxietyTotal + parseInt($scope.response.data[i].anxietyScore);
							if(depressionCheckbox) averageDepressionTotal = averageDepressionTotal + parseInt($scope.response.data[i].depressionScore);
							if(stressCheckbox) averageStressTotal = averageStressTotal + parseInt($scope.response.data[i].stressScore);
							if(angerCheckbox) averageAngerTotal = averageAngerTotal + parseInt($scope.response.data[i].angerScore);
							if(sleepQualityCheckbox) averageSleepTotal = averageSleepTotal + parseInt($scope.response.data[i].sleepScore);
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
				
				$scope.selectQuery("*", "wellnessTrackerEntries", "").then( function() {
					
					var checkinCounter = 0;
					
					var averageHappinessTotal = 0;
					var averageAnxietyTotal = 0;
					var averageDepressionTotal = 0;
					var averageStressTotal = 0;
					var averageAngerTotal = 0;
					var averageSleepTotal = 0;
					
					for(var i = 0; i < $scope.response.data.length; i++) {
						averageHappinessTotal = averageHappinessTotal + parseInt($scope.response.data[i].happinessScore);
						averageAnxietyTotal = averageAnxietyTotal + parseInt($scope.response.data[i].anxietyScore);
						averageDepressionTotal = averageDepressionTotal + parseInt($scope.response.data[i].depressionScore);
						averageStressTotal = averageStressTotal + parseInt($scope.response.data[i].stressScore);
						averageAngerTotal = averageAngerTotal + parseInt($scope.response.data[i].angerScore);
						averageSleepTotal = averageSleepTotal + parseInt($scope.response.data[i].sleepScore);
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
				})
			});
		}
	}
}]);

//------------------ Diary Controller --------------------
app.controller('DiaryCtrl', ['$scope', '$window', function($scope, $window){
	
	// Resets DiaryManager's function
	localStorage.setItem("diaryFunction", "");
	
	// Fetch all diary entries (1=1 is a temporary fix to an issue discovered in selectQuery.php's where clause, please ignore)
	$scope.selectQuery("*", "diaryEntries", "1=1 ORDER BY dateCreated").then(function() {
		$scope.diaryEntries = $scope.response.data;
	});
	
	// Indicates to our diaryManager that upon loading, that the user has requested a "New" entry, redirect to the diaryManager
	$scope.addDiaryEntry = function() {
		localStorage.setItem("diaryFunction", "new");
		$window.location.href = "#/diaryManager";
	}
	
	// Indicates to our diaryManager that upon loading, that the user has requested to view an entry, redirect to the diaryManager with the selected entryID
	$scope.viewDiaryEntry = function(selectedDiaryEntry) {
		localStorage.setItem("diaryFunction", "viewing");
		localStorage.setItem("selectedDiaryEntry", selectedDiaryEntry);
		$window.location.href = "#/diaryManager";
	}
	
	// Indicates to our diaryManager that upon loading, that the user has requested to edit an entry, redirect to the diaryManager with the selected entryID
	$scope.editDiaryEntry = function(selectedDiaryEntry) {
		localStorage.setItem("diaryFunction", "editing");
		localStorage.setItem("selectedDiaryEntry", selectedDiaryEntry);
		$window.location.href = "#/diaryManager";
	}
	
	// Create the query to delete the diary entry, then "reload" the page (Is the reload needed? - Justin)
	$scope.deleteDiaryEntry = function(selectedDiaryEntry) {
		var whereClause = "entryID = " + selectedDiaryEntry;
		$scope.deleteQuery("diaryEntries", whereClause).then(function() {
			$window.location.href = "#/diary";
		});
	};
}]);

//------------------ Diary Manager Controller --------------------
app.controller('DiaryManagerCtrl', ['$scope', '$window', function($scope, $window){
	
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
		$scope.selectQuery("*", "diaryEntries", whereClause).then(function() {
			$scope.selectedEntry = $scope.response.data[0];
		});
		
	// If editing, retrieve the entry, separate from "viewing" for future functionality.
	} else if($scope.flag == "editing") {
		var whereClause = "entryID = " + $scope.selectedDiaryEntryID;
		$scope.selectQuery("*", "diaryEntries", whereClause).then(function() {
			$scope.selectedEntry = $scope.response.data[0];
		});
	}
	
	// Run the insert query
	$scope.addDiaryEntry = function() {
		
		// Design values clause, note that "(SELECT IFNULL(MAX(entryID), 0) + 1 FROM diaryEntries)" is to mimic an auto-incrementing primary key as SQLite3 doesn't support an auto-incrementing compound key - This should be a trigger in the DB granted overhead isn't large - Justin
		var valuesClause = "(SELECT IFNULL(MAX(entryID), 0) + 1 FROM diaryEntries), 1, '" + $scope.newEntry.title + "', '" + $scope.newEntry.subtitle + "', '" + $scope.newEntry.content + "', datetime('now'), datetime('now')";
		$scope.addingEntry = true;
		
		$scope.insertQuery("diaryEntries", "entryID, userID, title, subtitle, content, dateCreated, dateLastEdited", valuesClause).then(function() {
			$window.location.href = "#/diary";
		});
	}
	
	// Update the diary entry in the DB
	$scope.updateDiaryEntry = function() {
		var setQuery = "title = '" + $scope.selectedEntry.title + "', subtitle = '" + $scope.selectedEntry.subtitle + "', content = '" + $scope.selectedEntry.content + "', dateLastEdited = datetime('now')";
		var whereClause = "entryID = " + $scope.selectedEntry.entryID;
		$scope.updateQuery("diaryEntries", setQuery, whereClause).then(function() {
			$window.location.href = "#/diary";
		});
	}
	
	// Redirects to diary.html
	$scope.diaryReturn = function() {
		$window.location.href = "#/diary";
	}
	
	// Changes diaryManager to edit mode
	$scope.editDiaryEntry = function(selectedDiaryEntry) {
		localStorage.setItem("diaryFunction", "editing");
		localStorage.setItem("selectedDiaryEntry", selectedDiaryEntry);
		$scope.flag = localStorage.getItem("diaryFunction");
	}
	
	// Deletes the entry, then redirects to diary.html
	$scope.deleteDiaryEntry = function(selectedDiaryEntry) {
		var whereClause = "entryID = " + selectedDiaryEntry;
		$scope.deleteQuery("diaryEntries", whereClause).then(function() {
			$window.location.href = "#/diary";
		});
	};
}]);

//------------------ AnalyticDashboard 2 Controller --------------------
app.controller('analyticDashboard2Ctrl', ['$scope', '$mdDialog', function($scope, $mdDialog){
	$scope.showAdvanced = function(ev) {
		$mdDialog.show({
			controller: DialogController,
			templateUrl: "C:\Users\justi\Documents\zen\WebContent\partials\modals\analyticDashboardQuery.html",
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true
		}).then(function() {
			$scope.status = 'You said the information was';
		}, function() {
			$scope.status = 'You cancelled the dialog.';
		});
	};
	
	function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function() {
      $mdDialog.hide(answer);
    };
  }
}]);

//------------------ modals/analyticDashboardQuery Controller --------------------
app.controller('analyticDashboardQueryCtrl', ['$scope', '$mdDialog', function($scope, $mdDialog){
	
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

app.controller("WellnessTracker", ["$scope", function ($scope) {


	$scope.entryList = [];

	//DUMMY DATA
	$scope.entryList.push({id: 1, date: 1508363261880, feelingRating:1, sleepRating: 1, description: "This is a new description1"});
	$scope.entryList.push({id: 2, date: 1508363261880, feelingRating:2, sleepRating: 2, description: "This is a new description2"});
	$scope.entryList.push({id: 3, date: 1508363261880, feelingRating:3, sleepRating: 3, description: "This is a new description3"});
	$scope.entryList.push({id: 4, date: 1508363261880, feelingRating:4, sleepRating: 4, description: "This is a new description4"});
	$scope.entryList.push({id: 5, date: 1508363261880, feelingRating:5, sleepRating: 5, description: "This is a new description5"});




}]);


app.controller("EntryCtrl", ["$scope", "$routeParams", function ($scope, $routeParams) {


    $scope.currentIndex = findEntryIndexById($routeParams.id);
    // $scope.entry = $scope.entryList[$scope.currentIndex];

    // $scope.nextEnabled = hasMoreEntries();
    // $scope.prevEnabled = hasLessEntries();

    $scope.nextEntry = nextEntry;
    $scope.prevEntry = prevEntry;

    function nextEntry(){
        if (hasMoreEntries()){
            $scope.currentIndex++;
            $scope.entry = $scope.entryList[$scope.currentIndex];
            $scope.nextEnabled = hasMoreEntries();
            $scope.prevEnabled = hasLessEntries();
        }
    }

    function prevEntry(){
        if (hasLessEntries()){
            $scope.currentIndex--;
            $scope.entry = $scope.entryList[$scope.currentIndex];
            $scope.nextEnabled = hasMoreEntries();
            $scope.prevEnabled = hasLessEntries();
        }
    }

    function hasMoreEntries(){
        return $scope.currentIndex != $scope.entryList.length-1;
    }

    function hasLessEntries() {
        return $scope.currentIndex > 0;
    }

    function findEntryIndexById(id){
       /* for (var i=0, len = $scope.entryList.length; i < len; i++){
            var entry = $scope.entryList[i];

            if(entry.id === id)
                return i;
        }*/

        return 0;
    }
}]);
