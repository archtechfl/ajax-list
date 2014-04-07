<?php 
include("../../../../db-config.php");
$pdo = new PDO($dsn, $db_username, $db_password); 

$item_id=$_POST["item-id"];

$stmt = $pdo->prepare("DELETE FROM `items` WHERE itemId = $item_id");
header('Content-type: text/xml');

if($stmt->execute()){
	echo("<response>1</response>");
}else{
	echo("<response>0</response>");
}
$pdo = null;



?>