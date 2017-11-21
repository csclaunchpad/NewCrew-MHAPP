app.factory("scoreManager", function() {
	return { reverseScore: reverseScore }
	
	// Given a number, this method will reverse it. 10 = 1, 9 = 2, 8 = 3, 7 = 4, 6 = 5, 5 = 6, 4 = 7, 3 = 8, 2 = 9, 1 = 10
	function reverseScore(score) { return ((10 - score) + 1); }
});

app.factory("toastService", ["$mdToast", function ($mdToast) {
	
	return { showToast: showToast };
	
	function showToast(inputText) {
		var toast = $mdToast.simple()
			.textContent(inputText)
			.highlightAction(true)
			.highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
			.position("bottom right");
		$mdToast.show(toast).then( function() {
			localStorage.removeItem("toastFlag");
		});
		
	}
}]);

app.factory('translationService', function() {  
    return { translate: translate };
	
	function translate(page) {
		
		var languageFlag = "";
		
		if(localStorage.getItem("languageFlag") === "fr") {
			languageFlag = "fr";
		} else {
			languageFlag = "en";
		}
		
		if(languageFlag === "en") {
			
			switch(page) {
				
				case "login.html":
					return {
						loginText: "Login",
						forgotMyPinText: "Forgot my Pin",
						createNewUserText: "Create New User",
						backText: "Back",
						invalidPinText: "The pin you have entered is invalid!",
						invalidLoginPin: false,
						one: "One",
						two: "Two",
						three: "Three",
						four: "Four",
						five: "Five",
						six: "Six",
						seven: "Seven",
						eight: "Eight",
						nine: "Nine",
						zero: "Zero"
					}
					
				case "forgotMyPin.html":
					return {
						phase1: true,
						phase2: false,
						phase3: false,
						invalidName: false,
						invalidAnswer: false,
						invalidPin: false,
						phase1Text: "Please enter the first name that is asscioated with the account you are trying to find.",
						questionText: "Question",
						answerText: "Answer",
						setYourNewPinText: "Set your new pin!",
						submitText: "Submit",
						invalidNameText: "The name you have entered doesn't exist!",
						invalidAnswerText: "The answer you have provided isn't right!",
						invalidNewPinText: "The pin you have entered is invalid",
						backText: "Back",
						firstNameAL: "First Name",
						one: "One",
						two: "Two",
						three: "Three",
						four: "Four",
						five: "Five",
						six: "Six",
						seven: "Seven",
						eight: "Eight",
						nine: "Nine",
						zero: "Zero"
					}
					
				case "newUser.html":
					return {
						invalidPin: false,
						pinAlreadyInUse: "That pin or name is already in use!",
						firstName: "First Name",
						pin: "Pin (4-6 numbers)",
						gender: "Gender",
						male: "Male",
						female: "Female",
						other: "Other",
						securityQuestion: "Security Question",
						answer: "Answer",
						createUser: "Create User"
					}
					
				case "analyticDashboard.html":
					return {
						maximizeButtons: true,
						showOutput: false,
						hideAllElements: false,
						moodValues: true,
						stressValues: true,
						dietValues: true,
						sleepValues: true,
						loadComplete: false,
						loadStarted: false,
						moodText: "Mood",
						sleepText: "Sleep",
						stressText: "Stress",
						dietText: "Diet",
						noCheckinsFound: "No Check-Ins Found",
						generateText: "Generate",
						checkinLogText: "Check-In Log",
						moodCheckboxAL: "Mood Checkbox",
						stressCheckboxAL: "Stress Checkbox",
						sleepCheckboxAL: "Sleep Checkbox",
						dietCheckboxAL: "Diet Checkbox",
						noCheckinsFoundAL: "No Check-Ins Found",
						moodScoreAverageAL: "Mood Score Average",
						stressScoreAverageAL: "Stress Score Average",
						dietScoreAverageAL: "Diet Score Average",
						sleepScoreAverageAL: "Sleep Score Average",
						toDateAL: "To Date",
						fromDateAL: "From Date"
					}
					
				case "diary.html":
				
					return {
						addDiaryEntry: "Add Diary Entry",
						editText: "Edit",
						deleteText: "Delete",
						noDiaryEntries: "You have no diary entries yet!",
						titleAL: "Title",
						subtitleAL: "Sub-Title",
						dateEnteredAL: "Date Entered",
						editDiaryEntryAL: "Edit diary entry with title",
						deleteDiaryEntryAL: "Delete diary entry with title"
					}
					
				case "diaryManager.html":
				
					return {
						titleText: "Title",
						subtitleText: "Sub-Title",
						contentText: "Content",
						addDiaryEntryText: "Add Diary Entry",
						addingDiaryEntryText: "Adding Entry...",
						backText: "Back",
						editEntryText: "Edit Entry",
						deleteText: "Delete",
						updateEntryText: "Update Entry"
					}
					
				case "dailyEntry.html": 
				
					return {
						sliderHeaderText: "Tell us about your day from 1-10?",
						moodSentenceText: "How are you feeling?",
						sleepSentenceText: "How was your sleep?",
						dietSentenceText: "How healthy did you eat today?",
						stressSentenceText: "How is your current stress level?",
						whatsOnYourMindText: "What's on your mind?",
						doneText: "Done",
						whatsOnYourMindAL: "What's on your mind?"
					}
					
				case "checkinLog.html":
				
					return {
						addNewEntryText: "+ Add New Entry",
						dateText: "Date:",
						dietText: "Diet:",
						moodText: "Mood:",
						stressText: "Stress:",
						sleepText: "Sleep:",
						veryLowText: "Very Low",
						lowText: "Low",
						roughText: "Rough",
						decentText: "Decent",
						goodText: "Good",
						veryGoodText: "Very Good",
						amazingText: "Amazing",
						loadingText: "Loading...",
						addNewEntryAL: "Add New Entry",
						dateEnteredAL: "Date Entered",
						dietScoreAL: "Diet Score",
						moodScoreAL: "Mood Score",
						stressScoreAL: "Stress Score",
						sleepScoreAL: "Sleep Score"
					}
					
				case "checkinLogInfo.html":
				
					return {
						onText: "On",
						youWereFeelingText: "You were feeling:",
						dietText: "Diet:",
						moodText: "Mood:",
						stressText: "Stress:",
						sleepText: "Sleep:",
						noNotesText: "No notes were provided for this check-in!",
						previousAL: "Previous",
						nextAL: "Next",
					}
				case "anxiety101.html":
				
					return {
						fact: "",
						factText: "Fact:",
						anxietyFactText: "Anxiety Fact",
						nextFactText: "Next Fact!",
					}
				case "stress101.html":
				
					return {
						fact: "",
						factText: "Fact:",
						anxietyFactText: "Stress Fact",
						nextFactText: "Next Fact!",
					}
					
				case "depression101.html":
			
					return {
						fact: "",
						factText: "Fact:",
						anxietyFactText: "Depression Fact",
						nextFactText: "Next Fact!",
					}
				default:
					break;
			}
		}
	}
});

app.factory("queryService", ["$http", function ($http) {


    return {
        selectQuery: selectQuery,
        updateQuery: updateQuery,
        insertQuery: insertQuery,
        deleteQuery: deleteQuery
    };


    // Does an HTTP GET request to our DB and runs the supplied SELECT statement, then returns a promise
    function selectQuery(inputSelectStatement, inputFromStatement, inputWhereStatement) {
        return $http({
            method: 'GET',
            url: '../php/selectQuery.php',
            params: {selectStatement: inputSelectStatement, fromStatement: inputFromStatement, whereStatement: inputWhereStatement}
        }).then(function(response) {
            // Storing the response
            return angular.fromJson(response);
        });
    }

    // Does an HTTP GET request to our DB and runs the supplied UPDATE statement, then returns a promise
    function updateQuery(inputUpdateStatement, inputSetStatement, inputWhereStatement) {
        return $http({
            method: 'GET',
            url: '../php/updateQuery.php',
            params: {updateStatement: inputUpdateStatement, setStatement: inputSetStatement, whereStatement: inputWhereStatement}
        }).then(function(response) {
            // Checks for an array in the data, if there is, the update request was a success
            return Array.isArray(angular.fromJson(response).data);
        });
    }

    // Does an HTTP GET request to our DB and runs the supplied INSERT statement, then returns a promise
    function insertQuery(inputInsertStatement, inputColumnStatement, inputValueStatement) {
        return $http({
            method: 'POST',
            url: '../php/insertQuery.php',
            params: {insertStatement: inputInsertStatement, columnStatement: inputColumnStatement, valueStatement: inputValueStatement}
        }).then(function(response) {

            // Checks for an array in the data, if there is, the update request was a success
            return Array.isArray(angular.fromJson(response).data);
        });
    }

    // Does an HTTP GET request to our DB and runs the supplied INSERT statement, then returns a promise
    function deleteQuery(inputTableStatement, inputWhereStatement) {
        return $http({
            method: 'GET',
            url: '../php/deleteQuery.php',
            params: {tableStatement: inputTableStatement, whereStatement: inputWhereStatement}
        }).then(function(response) {

            // Checks for an array in the data, if there is, the update request was a success
            return Array.isArray(angular.fromJson(response).data);
        });
    }

}]);