<?php
include("../../../../db-config.php");
$pdo = new PDO($dsn, $db_username, $db_password); 

$item_id=$_POST["item-id"];
$item_name=$_POST["item-name"];

$stmt = $pdo->prepare("UPDATE `items` SET itemName='$item_name' WHERE itemId=$item_id");
header('Content-type: text/xml');

if($stmt->execute()){
	echo("<response>1</response>");
}else{
	echo("<response>0</response>");
}
$pdo = null;

?>