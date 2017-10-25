"use strict";

// This file contains all functionality that goes along with a page. The controller that goes along with a page is defined in app.js

var app = angular.module("zenApp.controllers", ['ngRoute', 'ngMaterial']);

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
        queryService.selectQuery(inputSelectStatement, inputFromStatement, inputWhereStatement).then(function(response) {
			
			// Storing the response's data (I.E the query results) (Example)
			$scope.query = response.data;
			
			// Storing the keys from the query statement (Example)
			$scope.keys = Object.keys($scope.query[0]);		
		});
	};
	
	// Function that is called via update query button on sqlTester.html
	$scope.runUpdateQuery = function(inputUpdateStatement, inputSetStatement, inputWhereStatement) {
		
		// Given the update, set, and where statement: runs the supplied query and returns a promise, also sets $scope.response to true/false depending on success/failure
        queryService.updateQuery(inputUpdateStatement, inputSetStatement, inputWhereStatement).then(function() {
		});
	};
	
	// Function that is called via insert query button on sqlTester.html
	$scope.runInsertQuery = function(inputInsertStatement, inputColumnStatement, inputValueStatement) {
		
		// Given the table name, columns, and values to be inserted: runs the supplied query and returns a promise, also sets $scope.response to true/false depending on success/failure
        queryService.insertQuery(inputInsertStatement, inputColumnStatement, inputValueStatement).then(function() {
		});
	};
	
	// Function that is called via delete query button on sqlTester.html
	$scope.runDeleteQuery = function(inputTableStatement, inputWhereStatement) {
		
		// Given the table name, columns, and values to be inserted: runs the supplied query and returns a promise, also sets $scope.response to true/false depending on success/failure
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
	}
	
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
		sleepQualityCheckbox: false,
		fromDate: new Date(),
		toDate: new Date()
	};
	
	// Happiness = 0, Sleep Quality = 1
	$scope.graphColours = ["#3E95CD", "#00FFE4"];
	
	// Called when "Generate" button is clicked
	$scope.generateChart = function(happinessCheckbox, sleepQualityCheckbox, fromDate, toDate) {
		
		// Check if a checkbox is selected, else, don't do anything (If we didn't check, we'd generate a blank chart)
		if(happinessCheckbox || sleepQualityCheckbox) {
		
			var selectStatement = "";
			var whereClause = "";
			
			// We need to fill variables depending on whether they were selected or not (We avoid string building doing it this way)
			var happinessScore = "";
			var sleepQualityScore = "";
			
			// Filling the variables enables them to be called in our SQL call, otherwise they'd just be "" which SQL ignores
			if(happinessCheckbox) { 
				happinessScore = "happinessScore, ";
			}
			
			if(sleepQualityCheckbox) {
				sleepQualityScore = "sleepScore, ";
			}
			
			// Parse the angular dates into formats we can use using the moment time library (SQLite3 Standard)
			fromDate = moment(fromDate).format('YYYY-MM-DD HH:mm:ss');
			toDate = moment(toDate).format('YYYY-MM-DD HH:mm:ss');
			
			// Generating the select and where clause
			selectStatement = happinessScore + sleepQualityScore + "dateEntered";		
			whereClause = "(dateEntered >= DATETIME('" + fromDate + "') AND dateEntered <= DATETIME('" + toDate + "')) ORDER BY dateEntered";
			
			// Query the actual line graph data
            queryService.selectQuery(selectStatement, "wellnessTrackerEntries", whereClause).then(function(response) {
				$scope.entries = response.data;
				
				// Setting up the objects
				
				// Labels for graph
				var labelsArray = [];
				
				// Each happiness checkin score
				var happinessScoreArray = [];
				
				// Each sleep quality checkin score
				var sleepScoreArray = [];
				
				// Each array is aligned, apply the actual values from our query
				for(var i = 0; i < $scope.entries.length; i++) {
					labelsArray[i] = $scope.entries[i].dateEntered;
					
					if(happinessCheckbox) {
						happinessScoreArray[i] = $scope.entries[i].happinessScore;
					}
					
					if(sleepQualityCheckbox) {
						sleepScoreArray[i] = $scope.entries[i].sleepScore;
					}
				}

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
				
				// If sleepQualityCheckbox was selected, build our sleep quality line
				if(sleepQualityCheckbox) {
					
					var sleepQualityCheckboxIndex = graphDataSets.length;
					
					graphDataSets[graphDataSets.length] = { 
						data: sleepScoreArray,
						label: "Sleep Quality Score",
						borderColor: $scope.graphColours[1],
						fill: false
					}
				}
				
				var datasetsObject = [];
				
				if(happinessCheckbox) {
					datasetsObject[datasetsObject.length] = {label: graphDataSets[happinessCheckboxIndex].label, data: graphDataSets[happinessCheckboxIndex].data, borderColor: graphDataSets[happinessCheckboxIndex].borderColor, fill: graphDataSets[happinessCheckboxIndex].fill};
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
			
			})
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

        queryService.insertQuery("diaryEntries", "entryID, userID, title, subtitle, content, dateCreated, dateLastEdited", valuesClause).then(function() {
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