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
let img = null;
let canvas = null;
let gc = null;

window.onload = function() {
    //Set up the button
    let rollButton = document.getElementById("roll_button");
    rollButton.onclick = rollDice;

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
    img.src = "smaller_meeple_icon.png"
    img.onload = function() {
        gc.drawImage(img, Space[0].xPos, Space[0].yPos);
    }


}

function Board_Space(xPosition, yPosition, Space_Num, Con_Space) {
    this.xPos = xPosition;
    this.yPos = yPosition;
    this.Space_Number = Space_Num;
    this.Connected_Space = Con_Space;
}

//This function will roll a 6 sided dice, and move the player's token to the correct position
function rollDice()
{
    let win = null;
    let toptext = document.getElementById("top_text");
    let diceRoll = Math.floor(Math.random() * 6) + 1; //roll the dice
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
    }

    console.log("playerPos is " + playerPos);

    //draw the player icon to the correct space
    gc.drawImage(img, Space[playerPos].xPos, Space[playerPos].yPos);

    if(win == true)
        toptext.innerHTML = "Congratulations you Win!";
}
