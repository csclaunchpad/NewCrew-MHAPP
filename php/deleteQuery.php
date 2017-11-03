<?php
	require_once('connect.php');
	
	$tableStatement = $_GET['tableStatement'];
	$whereStatement = $_GET['whereStatement'];
	
	$sqlStatement = ("DELETE FROM " . $tableStatement . " WHERE " . $whereStatement . ";");
		
	$result = $db->query($sqlStatement);
	
	error_log($sqlStatement);
	
	echo(json_encode($result->fetchAll(PDO::FETCH_ASSOC)));	
	

?>