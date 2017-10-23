<?php
	require_once('connect.php');
	
	$insertStatement = $_REQUEST['insertStatement'];
	$columnStatement = $_REQUEST['columnStatement'];
	$valueStatement = $_REQUEST['valueStatement'];
	
	$sqlStatement = "INSERT INTO " . $insertStatement . " (" . $columnStatement . ") VALUES (" . $valueStatement . ");";

	$result = $db->query($sqlStatement);

	echo(json_encode($result->fetchAll(PDO::FETCH_ASSOC)));


?>