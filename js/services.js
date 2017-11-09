

app.factory('translationService', function() {  
    return { translate: translate };
	
	function translate(item) {
		
		var languageFlag = "";
		item = item.toLowerCase();
		
		if(localStorage.getItem("languageFlag") === "fr") {
			languageFlag = "fr";
		} else {
			languageFlag = "en";
		}
		
		// NOTE, make sure the text you're comparing below is lowercase as 'item' is forced to lowercase
		
		if(languageFlag === "en") {
		
			/* ---- General Text ---- */
			if(item === "appname") return "Mental Health App";
			if(item === "mood") return "Mood";
			if(item === "sleep") return "Sleep";
			if(item === "diet") return "Diet";
			if(item === "stress") return "Stress";
			if(item === "nocheckinsfound") return "No Checkins Found";
			if(item === "generate") return "Generate";
			if(item === "checkinlog") return "Check In Log";
			if(item === "gender") return "Gender";
			if(item === "male") return "Male";
			if(item === "female") return "Female";
			if(item === "other") return "Other";
			if(item === "securityQuestion") return "Security Question";
			if(item === "question") return "Question";
			if(item === "answer") return "Answer";
			if(item === "back") return "Back";
			if(item === "login") return "Login";
			if(item === "submit") return "Submit";
			
			/* ---- login.html ---- */
			if(item === "forgotmypin") return "Forgot my Pin";
			if(item === "createnewuser") return "Create New User";
			if(item === "invalidpin") return "The pin you have entered is invalid";

			/* ---- forgotMyPin.html ---- */
			if(item === "phase1") return "What is the first name of the account your trying to recover";
			if(item === "setyournewpin") return "Set your new pin";
			if(item === "invalidname") return "That name wasn't found";
			if(item === "invalidanswer") return "That answer isn't correct";
			if(item === "invalidnewpin") return "Your pin must be between 4-6 numbers";
			
			/* ---- createNewUser.html ---- */
			if(item === "pinalreadyinuse") return "That pin or name is already in use";
			if(item === "firstname") return "First Name";
			if(item === "pin") return "Pin (4-6 numbers)";
		
		} else if(languageFlag === "fr") {
			
			/* ---- General Text ---- */
			if(item === "appname") return "Su suis Mental Health App";
			if(item === "mood") return "Ambiance";
			if(item === "sleep") return "Dormir";
			if(item === "diet") return "Régime";
			if(item === "stress") return "Stress";
			if(item === "nocheckinsfound") return "Aucune Vérification n'a été Trouvée";
			if(item === "generate") return "Générer";
			if(item === "checkinlog") return "Enregistrement dans le Journal"
			if(item === "gender") return "Le genre";
			if(item === "male") return "Garçon";
			if(item === "female") return "Fille";
			if(item === "other") return "Autre";
			if(item === "firstname") return "Prénom";
			if(item === "answer") return "Répondre";
			if(item === "back") return "Arrière";
			if(item === "login") return "S'identifier";
			
			/* ---- login.html ---- */
			if(item === "forgotmypin") return "J'ai oublié mon épingle";
			if(item === "createnewuser") return "Créer un nouvel utilisateur";
			if(item === "invalidpin") return "La broche que vous avez entrée est invalide";
			
			/* ---- forgotMyPin.html ---- */
			if(item === "phase1") return "Quel est le prénom du compte que vous essayez de récupérer";
			if(item === "question") return "Question";
			if(item === "setyournewpin") return "Définissez votre nouvelle broche";
			if(item === "submit") return "Soumettre";
			if(item === "invalidname") return "Ce nom n'a pas été trouvé";
			if(item === "invalidanswer") return "Cette réponse n'est pas correcte";
			if(item === "invalidnewpin") return "Votre broche doit être entre 4 et 6 chiffres";
		
			/* ---- createNewUser.html ---- */
			if(item === "pinalreadyinuse") return "Cette broche ou ce nom est déjà utilisé";
			if(item === "pin") return "Pin (4-6 numéros)";
			if(item === "securityquestion") return "Question de sécurité";
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