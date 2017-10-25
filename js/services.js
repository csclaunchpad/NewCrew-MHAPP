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