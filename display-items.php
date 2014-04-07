<?php
include("../../../../db-config.php");
header('Content-type: text/xml');
$pdo = new PDO($dsn, $db_username, $db_password);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("SELECT * FROM `items`");
if($stmt->execute()){
	echo("<response>");
	while($row = $stmt->fetch()) { 	
		echo("<item>");
		echo("<itemid>".$row["itemId"]."</itemid>");
		echo("<itemname>".$row["itemName"]."</itemname>");
		echo("</item>");
	}
	echo("</response>");
}else{
	echo("<response>0</response>");
}

$pdo = null;
?>