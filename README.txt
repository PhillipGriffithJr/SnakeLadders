README by Phillip and Mayra

Hello,

This is the README for our cloud implementation of Snakes and Ladders. 
When the page is open, the game will begin once both players input a name. At that time, hitting the roll button will roll the dice and 
begin the game.
When you roll a 6 you get an extra turn. While it is not your turn, the buttons are hidden. 
The game works via message passing. Originally we intended for the clients to read state by asking a server that queries the database.
While the code is set up to send data to a database we did not end up using it for this iteration of the project.
The clients share state by sending a message to one another when the state changes. The message is sent through the server to the other
client. As of now the game only supports two players.
The New Game button currently resets the board but does not reset state between players. This is a work in progress function.
In the future there are many features that can be added (i.e Scaling out to more than 2 players, distinct instances of the game, 
use of the database to update leaderboards, modular rulesets, distinct single and multiplayer modes etc). 

Thanks for reading! 