<?php
	// Load SQL DB
	$directory = 'sqlite:C:\Users\wamsjd\Desktop\zen\WebContent\sql\zen.db';
	$db = new PDO($directory) or die("Cannot open the database");
?>