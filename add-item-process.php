<?php
include("../../../../db-config.php");
$pdo = new PDO($dsn, $db_username, $db_password); 

$item_name=$_POST["item-name"];

$stmt = $pdo->prepare("INSERT INTO `items` (itemName) 
				VALUES('$item_name');");
				
header('Content-type: text/xml');

if($stmt->execute()){
	echo("<response>".$pdo->lastInsertId()."</response>");
}else{
	echo("<response>0</response>");
}
$pdo = null;

?>