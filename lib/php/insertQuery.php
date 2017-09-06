<?php
	require_once('connect.php');
	
	$insertStatement = $_GET['insertStatement'];
	$columnStatement = $_GET['columnStatement'];
	$valueStatement = $_GET['valueStatement'];
	
	$sqlStatement = ("INSERT INTO " . $insertStatement . " (" . $columnStatement . ") VALUES (" . $valueStatement . ");");
	
	$result = $db->query($sqlStatement);
	
	echo(json_encode($result->fetchAll(PDO::FETCH_ASSOC)));	
	

?>