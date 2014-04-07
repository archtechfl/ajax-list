// JavaScript Document
window.onload = function(){

console.log("at AJAX");

//Insert event listener setup

var insertButton = document.getElementById("submitButton");

var outputList = document.getElementById("output");

insertButton.addEventListener("click", insert, false);

//Set up delete button

var deleteButton = document.createElement ('img');
deleteButton.src="delete.jpg";
deleteButton.className = "deleteButton";
deleteButton.id = "deleteRecord";
deleteButton.addEventListener("click", deleteRecord, false);

//Initial display

function displayAll(){

var myRequest = new XMLHttpRequest; 
myRequest.onreadystatechange = function(){ 

        console.log(myRequest.readyState);  
		
        if(myRequest.readyState === 4){    
			
			var items = myRequest.responseXML.childNodes[0].getElementsByTagName("item");
			
			for (i=0; i<items.length;i++){
				var itemName = items[i].childNodes[1].innerHTML;
				var itemText = document.createTextNode(itemName);
				
				var itemID = parseInt(items[i].childNodes[0].innerHTML);
				
				//console.log("Sum of item ID + 1 : " + (itemID + 1));
				
				var entry = document.createElement('li');
				entry.id = itemID;
				entry.className = "item";
				entry.appendChild(itemText);
				
				//entry.addEventListener("click", edit, false);
				
				outputList.appendChild(entry);
			}
			
		output.addEventListener("click", edit, false);
		
		//Delete button event listener
		output.addEventListener("mouseover", deleteAppear, false);
			
        } 
};

myRequest.open("GET", "display-items.php", true); //true means it is asynchronous // Send urls through the url
myRequest.send(null);

}

displayAll();

//Insert function

function insert(){

	var itemName = document.getElementById("inputMain");
	var itemNameVal = itemName.value;
	
	var myRequest_insert = new XMLHttpRequest; 
	myRequest_insert.onreadystatechange = function(){     
	if(myRequest_insert.readyState === 4)
		{        
		
			var latest = myRequest_insert.responseXML.getElementsByTagName("response");
			latestID = latest[0].childNodes[0].nodeValue;
			displayLatest(latestID);
			
			itemName.value = '';
			
		} 
	};
	
	myRequest_insert.open("POST","add-item-process.php",true); 
	myRequest_insert.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	myRequest_insert.send('item-name='+ itemNameVal);
	
}//end of insert function

//Display latest function

function displayLatest(e){

console.log("Display retrieved: " + e);

var displayLatest = new XMLHttpRequest; 
displayLatest.onreadystatechange = function(){ 

        //console.log(displayLatest.readyState);  
		
        if(displayLatest.readyState === 4){    
			
			var latestItems = displayLatest.responseXML.childNodes[0].getElementsByTagName("item");
			
			//console.log(latestItems);
			
			var outputList = document.getElementById("output");
			
			var itemId = "";
			var itemName = "";
			var itemText = "";
			
			
			for (i=0; i<latestItems.length;i++){
				itemId = parseInt(latestItems[i].childNodes[0].innerHTML);
				itemName = latestItems[i].childNodes[1].innerHTML;
				
				console.log("Item ID: " + itemId);
				if (itemId == e)
					{
						itemText = document.createTextNode(itemName);
						console.log("match found");
						//Insert latest item
						var entry = document.createElement('li');
						entry.id = itemId;
						entry.className = "item";
						entry.appendChild(itemText);						
						outputList.appendChild(entry);
						
					}
			}
			
			
        } 
};

displayLatest.open("GET", "display-items.php", true); //true means it is asynchronous // Send urls through the url
displayLatest.send(null);

}//end of latest

function edit(event){

	//Creation of edit field
	
	console.log("target class name: " + event.target.className);
	
	if (event.target.className == "item"){

	var editField = document.createElement ('input');
	
	editField.type = "text";
	editField.id = "editField";
	
	//Place edit field and fill in value
	
	var currentItem = event.target.childNodes[0];
	
	console.log("Current item text: " + currentItem.nodeValue);//Get text of paragraph
	
	var fillText = currentItem.nodeValue;
	editField.value = fillText; //Fills edit field with text of list item
	
	//Prepares for addition of edit field to list item
	var parent = currentItem.parentNode;
	
	var parentID = currentItem.parentNode.id;
	
	console.log("Parent ID: " + parentID);
	
	//Following ensures that only list item text triggers edit field addition

	parent.insertBefore(editField, currentItem);//Insert edit field before list item text
	
	output.removeEventListener("click", edit, false);//remove click event listener for edit
	document.addEventListener("keydown", keyboardActions, false);//Activate escape key trigger for edit field removal
	
	}
	
}

function keyboardActions (event) {
	console.log("Key pressed: " + event.keyCode);
	if (event.keyCode == 27){
		document.getElementById("editField").remove();//remove edit field with escape key press
		
		output.addEventListener("click", edit, false);//Restore click event listener for edit
		
		document.removeEventListener("keydown", keyboardActions, false);//Escape key triggers nothing until after next edit field appears
	} else if (event.keyCode == 13){
		console.log("Update process begun");
		
		output.addEventListener("click", edit, false);//Restore click event listener for edit
		
		updateProcess();
		
	} else {
		return null;
	}
}

function updateProcess() {
	var myRequest_update = new XMLHttpRequest; 
	
	//Preparing to retrieve values
	var updateField = document.getElementById ("editField");
	var updateText = updateField.value;
	
	var item_id = updateField.parentNode.id;
	
	var currentListItem = updateField.parentNode;
	
	console.log("Update item ID: " + item_id + " parent of edit Field: " + currentListItem);
	
	var currentText = currentListItem.childNodes[1];//Get value of current text in list node
	
	console.log("current text: " + currentText);
	
	//Get response to update
	
	myRequest_update.onreadystatechange = function(){     
	if(myRequest_update.readyState === 4)
		{    
			var updateResponse = parseInt (myRequest_update.responseXML.childNodes[0].firstChild.nodeValue);
			
			//Prepare feedback message
			var feedback = document.getElementById("feedbackMessage");//retrieve feedback paragraph
			
			if (updateResponse == 1){
				console.log("Update success");
				currentText.nodeValue = updateText;
				currentListItem.removeChild(updateField);
				
				var fM = document.createTextNode("Update successful!");//feedback text node
				feedback.appendChild(fM);
				
				setTimeout(removeMessage,1000);
				
			} else {
				console.log("Update unsuccessful");
				
				var fM = document.createTextNode("Update error");//feedback text node
				feedback.appendChild(fM);
				
				setTimeout(removeMessage,1000);
				
			}
		} 
	};
	
	//Send update to server
	myRequest_update.open("POST","edit-item-process.php",true); 
	myRequest_update.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	myRequest_update.send('item-name='+ updateText + '&item-id='+ item_id);
}

function removeMessage () {
	console.log("At remove message");
	var feedback = document.getElementById("feedbackMessage");//retrieve feedback paragraph
	var feedbackContent = feedback.childNodes[0];
	feedback.removeChild(feedbackContent);
}

//Delete button appear function
function deleteAppear (event) {
	console.log("delete yes" + event.target.tagName);
	
	if (event.target.tagName == "LI"){

	event.target.appendChild(deleteButton);
	
	output.removeEventListener("mouseover", deleteAppear, false);
	output.addEventListener("mouseout", deleteRemove, false);
	
	}
	
}

//removing delete button from item during mouse off

function deleteRemove (event) {
	
	console.log("Remove target: " + event.target);
	
	output.removeEventListener("mouseout", deleteRemove, false);
	output.addEventListener("mouseover", deleteAppear, false);
	
}

//Delete record function

function deleteRecord (e) {
	
	console.log("Target during delete: " + e.target.id);
	
	var del = document.getElementById("deleteRecord");
	console.log("Del: " + del);

	var currentListItem = del.parentNode;//Determine which list item the delete button is currently on
	
	console.log("current list item: " + currentListItem);
	
	var currentID = currentListItem.id;//Get the item ID embedded in the list item node ID
	
	//Preparing next record to receive delete button
	
	deleteButtonRecipient = del.parentNode.previousSibling;//Determine recipient for delete button after targeted record is deleted
	
	if ((typeof deleteButtonRecipient.id) == "undefined"){
		console.log("You are at the first record");
		deleteButtonRecipient = del.parentNode.nextSibling;//Determine recipient for delete button after targeted record is deleted
	} else {
		console.log("You are not at the first record");
	}
	
	//begin AJAX request for delete
	var myRequest_delete = new XMLHttpRequest; 
	myRequest_delete.onreadystatechange = function(){     
	if(myRequest_delete.readyState === 4)
		{       
			var deleteResponse = parseInt (myRequest_delete.responseXML.childNodes[0].firstChild.nodeValue);
			if (deleteResponse == 1){
				console.log("Delete success");
				
				if (deleteButtonRecipient != null){
					deleteButtonRecipient.appendChild(del);//Send delete button to record above, or below at top
				}
				output.removeChild(currentListItem);//remove deleted record from viewable list
				
				var feedback = document.getElementById("feedbackMessage");//retrieve feedback paragraph
				var fM = document.createTextNode("Delete successful!");//feedback text node
				
				feedback.appendChild(fM);//Display message
				
				setTimeout(removeMessage,1000);//Message timeout
				
			} else {
			
				var feedback = document.getElementById("feedbackMessage");//retrieve feedback paragraph
				var fM = document.createTextNode("Delete error");//feedback text node
				
				console.log("delete unsuccessful");
				
			}
		} 
	};
	
	myRequest_delete.open("POST","delete-item-process.php",true); 
	myRequest_delete.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	myRequest_delete.send('item-id=' + currentID);
	
}

}//End of onload