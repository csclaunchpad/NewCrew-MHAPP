<?php
	require_once('connect.php');
	
	$updateStatement = $_GET['updateStatement'];
	$setStatement = $_GET['setStatement'];
	$whereStatement = $_GET['whereStatement'];
	
	$sqlStatement = "";
	
	if(empty($whereStatement)) {
		$sqlStatement = ("UPDATE " . $updateStatement . " SET " . $setStatement . ";");
	} else {
		$sqlStatement = ("UPDATE " . $updateStatement . " SET " . $setStatement . " WHERE " . $whereStatement .  ";");
	}
	
	$result = $db->query($sqlStatement);
	
	echo(json_encode($result->fetchAll(PDO::FETCH_ASSOC)));	
	

?>