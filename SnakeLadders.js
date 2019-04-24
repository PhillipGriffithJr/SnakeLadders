/*
 * SnakeLadders.js
 * CS 346 Project 2
 * Phillip Griffith Jr 
 */

"use strict";

//Create an array of Board_Spaces
//This array is 0-indexed, so Board_Space[0] = Space 1 on the depiction of the board
let Space = [];
let playerPos = 0;
let player2Pos = 0;
let img = null;
let img2 = null;
let canvas = null;
let gc = null;
let playerName = null;
let moveNumber = 0;

//Server Setup
let clientNum = null;
// let url = "ws://ec2-52-90-168-24.compute-1.amazonaws.com:8080";
let url = "ws://localhost:8080";
let connection = null;

window.onload = function() {
    //Set up the buttons
    let rollButton = document.getElementById("roll_button");
    let newGameButton = document.getElementById("new_game_button");
    let submitNameButton = document.getElementById("submit_name_button");
    rollButton.onclick = rollDice;
    newGameButton.onclick = newGame;
    submitNameButton.onclick = submitName;

    //Loop through and create an object for each board space so that we know where to draw, and where the snakes and ladders are
    //i for row, this goes bottom to top where 0 is the bottom row and 7 is the top row
    //j for column so row-column indexed
    let k = 1;
    let m = 7;
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            if(i%2 == 0) {
                Space[k-1] = new Board_Space(j*96, m*96, k, null);
            }
            else {
                Space[k-1] = new Board_Space((7-j)*96, m*96, k, null);
            }
            
            k++;
        }
        m--;
    }

    //Manually set the connections for each of the spaces that connect to another a la snakes and ladders
    //Connected spaces are numbered as they appear in the array i.e Space 2 is in array index 1, connects to space 18 which is
    //in array index 17
    Space[1].Connected_Space = 17; //2 goes up to 18
    Space[4].Connected_Space = 21; //5 goes up to 22
    Space[26].Connected_Space = 8; //27 goes down to 9
    Space[28].Connected_Space = 43; //29 goes up to 44
    Space[32].Connected_Space = 18; //33 goes down to 19
    Space[39].Connected_Space = 55; //40 goes up to 56
    Space[41].Connected_Space = 27; //42 goes down to 28
    Space[45].Connected_Space = 62; //46 goes up to 63
    Space[60].Connected_Space = 42; //61 goes down to 43

    //Draw the player at space 1 on the board
    canvas = document.getElementById("boardCanvas");
    gc = canvas.getContext("2d");
    img = new Image();
    img.src = "smaller_meeple_icon.png";
    img.onload = function() {
        gc.drawImage(img, Space[0].xPos, Space[0].yPos);
    }

    //Draw the other player at space 1 on the board
    img2 = new Image();
    img2.src = "small_dice_icon.png";
    img2.onload = function() {
        gc.drawImage(img2, Space[0].xPos, Space[0].yPos);
    }
}

function Board_Space(xPosition, yPosition, Space_Num, Con_Space) {
    this.xPos = xPosition;
    this.yPos = yPosition;
    this.Space_Number = Space_Num;
    this.Connected_Space = Con_Space;
}

//This function will roll a 6 sided dice, and move the player's token to the correct position
function rollDice() {
    let win = null;
    let toptext = document.getElementById("top_text");
    let diceRoll = Math.floor(Math.random() * 6) + 1; //roll the dice
    let oldPos = playerPos;
    let preWarpPos = playerPos + diceRoll;
    let didWarp = 0;
    let rolled6 = 0;
    if(diceRoll == 6) {
        rolled6 = 1;
    }
    else {
        hideButtons();
    }
        
    toptext.innerHTML = "You Rolled " + diceRoll;  //tell the player what they rolled
    console.log(diceRoll);
    playerPos += diceRoll; //update the player position
    gc.clearRect(0, 0, 768, 768); //clear the screen

    //check to see if the player has won
    if(playerPos > 63)
    {
        playerPos = 63;
        win = true;
    }

    if(Space[playerPos].Connected_Space != null) {
        playerPos = Space[playerPos].Connected_Space;
        didWarp = 1;
    }

    console.log("playerPos is " + playerPos);

    //draw the player's icons to the correct space
    gc.drawImage(img, Space[playerPos].xPos, Space[playerPos].yPos);
    gc.drawImage(img2, Space[player2Pos].xPos, Space[player2Pos].yPos);
    moveNumber++;

    if(win == true) {
        toptext.style.color = "black";
        toptext.innerHTML = "Congratulations " + playerName + ", You Win!"

        sendMove(true);
    }

    let msg = {
        cid: clientNum,
        pName: playerName,
        clientRoll: diceRoll,
        clientPos: playerPos,
        client6: rolled6,
        clientwin: win, 
        text: "this is client " + clientNum + " sending a message" 
    };

    console.log("about to send message");
    connection.send(JSON.stringify(msg));
}

//This function will reset the single player version of the game
function newGame() {
    playerPos = 0;
    gc.clearRect(0, 0, 768, 768); //clear the screen
    gc.drawImage(img, Space[0].xPos, Space[0].yPos);
    let toptext = document.getElementById("top_text");
    toptext.style.color = "black";
    toptext.innerHTML = "Snakes and Ladders Single Player";
}

//This function handles the input of a username for the game
function submitName() {
    let toptext = document.getElementById("top_text");
    let nameInput = document.getElementById("name_input_box");
    //compare name input to regex string here
    let newName = nameInput.value;
    if(/^([a-z]|[A-Z]|[0-9]){1,10}$/.test(newName) == false || newName.toLowerCase().includes("drop")) {
        nameInput.value = "";
        toptext.style.color = "red";
        toptext.innerHTML = "Invalid Name. Please create a name of length 10 or less using only numbers and letters and no spaces. Do not attempt to inject SQL either (If you have drop in your name this will raise a flag)."
    }
    else {
        playerName = newName;
        nameInput.value = "";
        toptext.style.color = "black";
        toptext.innerHTML = "Hello " + playerName + "!";

        //establish a connection with the server now that you have a name
        //connect to the server
        connection = new WebSocket(url);
        connection.onopen = () => {
            console.log("connection established");
            connection.onmessage = (message) => {
                if(clientNum == null) {
                    clientNum = message.data;
                    console.log("clientNum is " + clientNum);
                }
                else {
                    //update the position of the other player
                    let content = JSON.parse(message.data);
                    toptext.innerHTML = content.pName + " rolled a " + content.clientRoll;
                    player2Pos = content.clientPos;

                    //redraw the screen
                    gc.clearRect(0, 0, 768, 768); //clear the screen
                    gc.drawImage(img, Space[playerPos].xPos, Space[playerPos].yPos); //draw player 1
                    gc.drawImage(img2, Space[player2Pos].xPos, Space[player2Pos].yPos); //draw player 2

                    if(content.client6 == "0") {
                        revealButtons();
                    }

                    if(content.clientwin == true) {
                        toptext.innerHTML = content.pName + " Won the Game!";
                        sendMove(false);
                    }

                    console.log(content.text);
                }
            };
        };
    }
}

function hideButtons() {
    let buttons = document.getElementById("button_div");
    buttons.style.display = "none";
}

function revealButtons() {
    let buttons = document.getElementById("button_div");
    buttons.style.display = "flex";
}

//This function sends a post request containing move information to the server
function sendMove(didWin)
{
    let lowerName = playerName.toLowerCase();
    let url = "http://localhost:3000";
    let dataToSend = {
        player: lowerName,
        win: didWin,
        numMoves: moveNumber
    };

    let fetchOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    };

    fetch(url, fetchOptions)
        .then(checkStatus)
        .then(function(responseText) {
            console.log(responseText);
        })
        .catch(function(error) {
        });
}

/**
 * This method handles slow responses from the server
 * @param {Promise} response
 */
function checkStatus(response) {
    if(response.status >= 200 && response.status < 300) {
        return response.text();
    }
    else {
        return Promise.reject(new Error(response.status + ": " + response.text));
    }
}
