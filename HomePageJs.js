"use stsrict"; 

window.onload=function(){
setuptable();
}

function setuptable(){
	let table_area = document.getElementById("table_area");
	let url = "http://localhost:3000/";

//query the database
fetch(url)
	.then(checkStatus)
	.then(function(responseText) {
		let json = JSON.parse(responseText);

		let newTable = document.createElement("table");
		let caption = document.createElement("caption");
		caption.innerHTML = "Player Results";
		newTable.appendChild(caption);
		let headerRow = document.createElement("tr");
		let title1 = document.createElement("th");
		let title2 = document.createElement("th");
		let title3 = document.createElement("th");
		let title4 = document.createElement("th");
		let title5 = document.createElement("th");
		title1.innerHTML = "Player's Name";
		title2.innerHTML = "Number of Games Won";
		title3.innerHTML = "Number of Games Played";
		title4.innerHTML = "Date of Last Game Played";
		title5.innerHTML = "Least Number of moves it Took to Win";
		headerRow.appendChild(title1); 
		headerRow.appendChild(title2); 
		headerRow.appendChild(title3); 
		headerRow.appendChild(title4); 
		headerRow.appendChild(title5); 
		newTable.appendChild(headerRow); 

		//create rows of table
		for (let i = 0; i<json.length; i++){
			//create a new row and the data for that row
			let newRow = document.createElement("tr");
			let data1 = document.createElement("td");
			let data2 = document.createElement("td");
			let data3 = document.createElement("td");
			let data4 = document.createElement("td");
			let data5 = document.createElement("td");

			data1.innerHTML = json[i].playerName;
			data2.innerHTML = json[i].gamesWon;
			data3.innerHTML = json[i].gamesPlayed;
			data4.innerHTML = json[i].lastTimePlayed;
			data5.innerHTML = json[i].moveHS;

			newRow.appendChild(data1);
			newRow.appendChild(data2);
			newRow.appendChild(data3);
			newRow.appendChild(data4);
			newRow.appendChild(data5);

			newTable.appendChild(newRow);
		}

		table_area.appendChild(newTable);
	})
	
}

function checkStatus(response){
	if(response.status >=200 && response.status <300)
	{
		return response.text();
	}
	else
	{
		return Promise.reject(new Error(response.status + ": " + response.text));
	}
}

