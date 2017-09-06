<?php
	require_once('connect.php');

	$selectStatement = $_GET['selectStatement'];
	$fromStatement = $_GET['fromStatement'];
	$whereStatement = $_GET['whereStatement'];
	
	$sqlStatement = "";
	
	if($whereStatement == "") {
		$sqlStatement = ("SELECT " . $selectStatement . " FROM " . $fromStatement . ";");
	} else {
		$sqlStatement = ("SELECT " . $selectStatement . " FROM " . $fromStatement . " WHERE " . $whereStatement .  ";");
	}
	
	$result = $db->query($sqlStatement);
	
	echo(json_encode($result->fetchAll(PDO::FETCH_ASSOC)));	
	
?>