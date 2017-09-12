<?php
	// Load SQL DB
	$directory = 'sqlite:..\sql\zen.db';
	$db = new PDO($directory) or die("Cannot open the database");
?>
