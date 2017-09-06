<?php
	require_once('connect.php');
	
	$data = json_decode(file_get_contents("php://input"));
	
	$selectStatement = $data->selectStatement;
	$fromStatement = $data->fromStatement;
	$whereClause = $data->whereClause;
	
	error_log("SELECT value: " . $selectStatement);
	error_log("FROM value: " . $fromStatement);
	error_log("WHERE value: " . $whereClause);
	
	$sqlStatement = "";
	
	if(empty($whereClause)) {
		$sqlStatement = $db->prepare('SELECT :s FROM :f;');
		
		$sqlStatement->bindParam(':s', $selectStatement);
		$sqlStatement->bindParam(':f', $fromStatement);
	} else {
		$sqlStatement = $db-prepare('SELECT :s FROM :f WHERE :w;');
		
		$sqlStatement->bindParam(':s', $selectStatement);
		$sqlStatement->bindParam(':f', $fromStatement);
		$sqlStatement->bindParam(':w', $whereStatement);
	}
	
	$sqlStatement->execute();
	
	error_log($sqlStatement->fetchColumn());
?>