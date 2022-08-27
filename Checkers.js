var canvas = document.getElementById('canvas');
var cx = canvas.getContext('2d');
canvas.width = window.innerWidth - 450;
canvas.height = window.innerHeight-20;

//global variables
var black = '#8B4513'; // color of a black square
var white = '#f8f8f8'; // color of a white sqaure
var board = []; // array of arraies to declare the board
var black_checkers =[]; // an array of the black checkers
var white_checkers = []; // an array for the white checkers
var square_SIDE = 70; // side of the square
var mark_square = '#4A2512'; // color of marked square
var screen_gap = 450; // the Gap between the beginning of the screen to eh beginning of the canvas
var whosturn = 'red'; // variable that defines whose player's turn
var the_checker_row; // the chosen checker's row
var the_checker_col; // the chosen checker's column
var mustAttack = false; // bool variable to declare if a checker must attack
var whoswin = '';
// delcare a Rect Object
class Rect {
	constructor(x,y){ 
		this.x = x; // gets x position
		this.y = y; // gets y psition
		this.width = square_SIDE; // width of the rect
		this.height = square_SIDE; // height of the rect
		this.col = Math.floor(this.x/this.width); // calculate the rect's column
		this.row = Math.floor(this.y/this.height); // calculate the rect's row
		this.color =''; // declare a color variable
		this.ocupied = false; // bool variable to define if the rect is ocupied by a checker
		this.marked = false; // bool variable to define if the rect is marked (before a checker move)
	}
	// A Draw function
	Draw(){
		// calculate the position of the square (even or odd column/row and color it with the match color)
		if(this.marked == false && this.col%2 == 1){
			if(this.row%2 == 1)
				this.color = white;
			else if(this.row%2 == 0)
				this.color = black;
		}
		else if(this.marked == false && this.col%2 == 0){
			if(this.row % 2 == 0)
				this.color = white;
			else if(this.row % 2 == 1)
				this.color = black;
		}
		else if(this.marked == true)//if the square is marked (before a checker move)
			this.color = mark_square;
		//Drawing the Rect
		cx.fillStyle = this.color;
		cx.fillRect(this.x,this.y,this.width,this.height);
	}
}
//declare a checker object
class Checker{
	constructor(x,y,color){
		this.x = x + (square_SIDE/2); // Making the X position at the middle of the rect
		this.y = y + (square_SIDE/2); // Same as X position
		this.radius = 25; // Radius of the Checker
		this.col = Math.floor(this.x/square_SIDE); // calculate the checker's column
		this.row = Math.floor(this.y/square_SIDE); // calculate the checker's row
		this.color = color; // enters the checker's color by whos play.
		this.isKing = false; // bool variable that define if the checker is a king now
	}
	// A Draw function
	Draw(){
		//if the checker is a king the stroke line is yellow
		if (this.isKing == true)
			cx.strokeStyle = 'yellow';
		else
			cx.strokeStyle = 'white';
		cx.fillStyle = this.color;
		cx.lineWidth = 5;
		cx.beginPath();
		cx.arc(this.x,this.y,this.radius,0,Math.PI*2);
		cx.fill();
		cx.stroke();
	}
}
// function to intiate the Game
function CreateGame(){
	// First double for loops to draw the board
	for(var i=0;i<8;i++){
		board[i] = []; //Create an array inside the big array
		for(var j=0; j<8; j++){
			board[i][j] = new Rect(j*square_SIDE, i*square_SIDE); // Creating the Rects inside the board array
			board[i][j].Draw(); // Draw each Rect
		}
	}
	// Now we are drawing the white Checkers
	for (var i = 0; i < 8; i++) {
		white_checkers[i] = [];  // 2 dimensional array - defines the white checkers positions
		if(i<3 && i % 2 == 0 )// draw the white checkers in an even row
			for(var j=1; j< 8; j +=2){
				white_checkers[i][j]= new Checker(j*square_SIDE, i*square_SIDE,'red'); // create new checker objects
				white_checkers[i][j].Draw();
				board[i][j].ocupied = true; // declare the rect as ocupied by a checker
			}
		else if(i<3 &&  i % 2 == 1) // draw the white checkers in an odd row
			for(var j=0; j< 8; j +=2){
				white_checkers[i][j]= new Checker(j*square_SIDE, i*square_SIDE,'red'); // create new checker objects
				white_checkers[i][j].Draw();
				board[i][j].ocupied = true; //  declare the rect as ocupied by a checker
			}
		else{  //after row 3, the rest positions are declared as nulls.
			for (var j = 0; j < 8; j++) {
				white_checkers[i][j] = null;
			}
		}
	}
	//Another for loop to draw the black checkers - Same as the white checkers
	for (var i = 0; i < 8; i++) {
		black_checkers[i] = []; // 2 dimensional array - defines the black checkers positions
		if(i>=5 && i % 2 == 0 ) // draw the black checkers in rows 5-8 on even rows
			for(var j=1; j< 8; j +=2){
				black_checkers[i][j]= new Checker(j*square_SIDE, i*square_SIDE,'black'); // create new checker objects
				black_checkers[i][j].Draw();
				board[i][j].ocupied = true;  // declare the rect as ocupied by a checker
			}
		else if(i>=5 && i % 2 == 1) // draw the black checkers in rows 5-8 on odd rows
			for(var j=0; j< 8; j +=2){
				black_checkers[i][j]= new Checker(j*square_SIDE, i*square_SIDE,'black'); // create new checker objects
				black_checkers[i][j].Draw();
				board[i][j].ocupied = true;  // declare the rect as ocupied by a checker
			}
		else{ // The rest positions are nulls
			for (var j = 0; j < 8; j++) {
				black_checkers[i][j] = null;
			}
		}
	}
}
//A function to move a checker (on the screen, and in the arrays), get the checkers array, checker's current row and col, the checker's new col and row
function PlayMove(checkers,current_row,current_col,new_row,new_col){
	//The CURRENT row and col belongs to the first position of the checker we clicked on.
	//The NEW row and col belongs to the new position the checker is going to.
	//The checker enters his new position (create new checker object)
	checkers[new_row][new_col] =  new Checker(board[new_row][new_col].x, board[new_row][new_col].y, whosturn);
	checkers[new_row][new_col].isKing = checkers[current_row][current_col].isKing;

	if(whosturn == 'red' && checkers[new_row][new_col].isKing == false){
		if(new_row == board.length -1)// if a red checker arrived to the end of the board (bottom side), he is a king
			checkers[new_row][new_col].isKing = true;
	}
	else if(whosturn == 'black' && checkers[new_row][new_col].isKing == false){
		if(new_row == 0)// if a black checker arrived the end of the board (top side), he is a king.
			checkers[new_row][new_col].isKing = true;
	}
	if(mustAttack){ // if the checker must attack
		var eaten_row = (new_row + current_row)/2; // eaten checker's row
		var eaten_col = (new_col + current_col)/2; // eaten checker's col

		if(whosturn == 'red')
			black_checkers[eaten_row][eaten_col] = null; // a checker has been eaten
		else if(whosturn == 'black')
			white_checkers[eaten_row][eaten_col] = null;  // a checker has been eaten

		board[eaten_row][eaten_col].ocupied = false; // the square isnt ocupied
		board[eaten_row][eaten_col].marked = false; // the square isnt marked
		board[eaten_row][eaten_col].Draw(); // we draw the square again
		mustAttack = false; //after the attack
	}

	//Turn is over
	if(whosturn =='red')
		whosturn = 'black';
	else
		whosturn ='red';

	board[current_row][current_col].ocupied = false; // Make the previous location not ocupied
	board[current_row][current_col].marked = false; // Make the previous location not marked
	board[new_row][new_col].marked = false; // Make the new location not marked
	board[new_row][new_col].ocupied = true; // Then - the new location is ocupied
	checkers[current_row][current_col] = null;	// the previous location at the checkers array is now a null
	board[current_row][current_col].Draw();	// Then we draw the squares and the new Checker
	board[new_row][new_col].Draw();
	checkers[new_row][new_col].Draw();
}
//function to mark all of the relevant squares only if a checker was clicked
function Mark(click_row, click_col){
	//Test whether we clicked on a WHITE checker and if it's his turn.
	if(whosturn == 'red' && white_checkers[click_row][click_col] != null){
		the_checker_row = click_row; // Save this checker's row
		the_checker_col = click_col; // Save this checker's column

		// we check if the checker is a king - if he does we activate the KingMark function
		var king = white_checkers[click_row][click_col].isKing;
		if(king == true)
			KingMark(black_checkers,the_checker_row,the_checker_col);
		
		else if(king == false){
			//first we check if the checker must attack
			if(mustAttack){
				//check if one checker can attack another to the - BOTTOM RIGHT CHECKER
				// the checker MUST be below sixth row and col - preventing slipping out the array
				if(the_checker_col<6 && the_checker_row < 6 && black_checkers[the_checker_row+1][the_checker_col+1] != null &&
				 board[the_checker_row+2][the_checker_col+2].ocupied == false){
				 	//if there is a checker he can attack, the square after him will be marked.
					board[the_checker_row+2][the_checker_col+2].marked = true;
					board[the_checker_row+2][the_checker_col+2].Draw();
				}
				//check if one checker can attack another. BOTTOM LEFT CHECKER
				// the checker MUST be below sixth row and above first col - preventing slipping out the array
				if(the_checker_col>1 && the_checker_row<6 && black_checkers[the_checker_row+1][the_checker_col-1] != null &&
				 board[the_checker_row+2][the_checker_col-2].ocupied == false){
				 	//if there is a checker he can attack, the square after him will be marked.
					board[the_checker_row+2][the_checker_col-2].marked = true;
					board[the_checker_row+2][the_checker_col-2].Draw();
				}
			}
			else if(mustAttack == false){
				//Here we mark the bottom Left checker's square - if it's not ocupied
				if(the_checker_col>0 && board[the_checker_row+1][the_checker_col-1].ocupied == false){
					//column MUST be above the first one, so it won't slip out the array
					board[the_checker_row+1][the_checker_col-1].marked = true;
					board[the_checker_row+1][the_checker_col-1].Draw();
				}
				//Here we mark the bottom Right checker's square - if it's not ocupied
				if(the_checker_col<7 && board[the_checker_row+1][the_checker_col+1].ocupied == false){
					//column MUST be below the last, so it won't slip out the array
					board[the_checker_row+1][the_checker_col+1].marked = true;
					board[the_checker_row+1][the_checker_col+1].Draw();
				}
			}
		}
	}
	//Test whether we clicked on a BLACK cheker and if it's his turn.
	else if(whosturn == 'black' && black_checkers[click_row][click_col] != null){
		the_checker_row = click_row; // Save this checker's row
		the_checker_col = click_col; // Save this checker's column

		// we check if the checker is a king - if he does we activate the KingMark function
		var king = black_checkers[click_row][click_col].isKing;
		if(king == true)
			KingMark(white_checkers,the_checker_row,the_checker_col);

		else if(king == false){
			//first we check if the checker must attack
			if(mustAttack){
				//check if one checker can attack another. TOP RIGHT CHECKER
				// the checker MUST be below sixth row and above the second col - preventing slipping out the array
				if(the_checker_col<6 && the_checker_row>1 && white_checkers[the_checker_row-1][the_checker_col+1] != null &&
				 board[the_checker_row-2][the_checker_col+2].ocupied == false){
					board[the_checker_row-2][the_checker_col+2].marked = true;
					board[the_checker_row-2][the_checker_col+2].Draw();
				}
				//check if one checker can attack another. TOP LEFT CHECKER
				// the checker MUST be above the second col and row - preventing slipping out the array
				if(the_checker_col>1 && the_checker_row>1 && white_checkers[the_checker_row-1][the_checker_col-1] != null &&
				 board[the_checker_row-2][the_checker_col-2].ocupied == false){
					board[the_checker_row-2][the_checker_col-2].marked = true;
					board[the_checker_row-2][the_checker_col-2].Draw();
				}
			}
			else if(mustAttack == false){
				//Here we mark the Top Right checker's rect - if it's not ocupied
				if(the_checker_col<7 && board[the_checker_row-1][the_checker_col+1].ocupied == false){
					//the checker's column MUST be below the last cloumn.
					board[the_checker_row-1][the_checker_col+1].marked = true;
					board[the_checker_row-1][the_checker_col+1].Draw();
				}
				//Here we mark the Top Left checker's rect - if it's not ocupied
				if(the_checker_col>0 && board[the_checker_row-1][the_checker_col-1].ocupied == false){
					//the checker's column MUST be above the first cloumn.
					board[the_checker_row-1][the_checker_col-1].marked = true;
					board[the_checker_row-1][the_checker_col-1].Draw();
				}
			}
		}
	}
}
//function to mark all the king's squares
function KingMark(passive_checkers, row,col){
	//The first test is whether the king must attack
	if(col>0 && col<7 && row>0 && row<7){// if the king is not at the sides of the board
		if(row<6 && col<6){
			// bottom right squares - below seventh row and column
			if(passive_checkers[row+1][col+1]!= null && board[row+2][col+2].ocupied ==false){
				mustAttack = true;
				board[row+2][col+2].marked = true;
				board[row+2][col+2].Draw();
			}
		}
		if(row<6 && col>1){
			// bottom left square - below seventh row and above second column, to prevent slip out the array
			if(passive_checkers[row+1][col-1]!= null && board[row+2][col-2].ocupied ==false){ 
				mustAttack = true;
				board[row+2][col-2].marked = true;
				board[row+2][col-2].Draw();
			}
		}
		if(row>1 && col<6){
			//top right sqaure - above second row, below seventh column, to prevent slip out the array
			if(passive_checkers[row-1][col+1]!= null && board[row-2][col+2].ocupied ==false){ 
				mustAttack = true;
				board[row-2][col+2].marked = true;
				board[row-2][col+2].Draw();
			}
		}
		if(row>1 && col>1){
			// top left square - above second row and column, to prevent slip out the array
			if(passive_checkers[row-1][col-1]!= null && board[row-2][col-2].ocupied ==false){
				mustAttack = true;
				board[row-2][col-2].marked = true;
				board[row-2][col-2].Draw();
			}
		}
		//General marked squares for a king
		for (var i = row-1; i <= row+1; i+=2) { // running on the 4 squares the king can go
			for(var j = col-1; j <= col+1; j+=2){
				 // mark the square if it doesnt ocupied + if he isnt must to attack
				if (mustAttack == false && board[i][j].ocupied == false){
					board[i][j].marked = true;
					board[i][j].Draw();
				}
			}	
		}
	}
	//Exceptions
	//Last Row
	if(row == 7){
		// the TOP RIGHT square
		if(mustAttack == false && board[row-1][col+1].ocupied == false){ 
			board[row-1][col+1].marked = true;
			board[row-1][col+1].Draw();
		}
		// if this square is ocupied and the king can eat
		else if(passive_checkers[row-1][col+1] != null && board[row-2][col+2].ocupied == false){
			mustAttack = true;
			board[row-2][col+2].marked = true;
			board[row-2][col+2].Draw();
		}
		if(col > 0){ // if the king is not on the corner, both top left and top right squares will be marked.
			//TOP LEFT square
			if(mustAttack == false && board[row-1][col-1].ocupied == false){
				board[row-1][col-1].marked = true;
				board[row-1][col-1].Draw();
			}
			else if(passive_checkers[row-1][col-1] != null && board[row-2][col-2].ocupied == false){
				mustAttack = true;
				board[row-2][col-2].marked = true;
				board[row-2][col-2].Draw();
			}
		}	
	}
	//First Row
	else if(row == 0){
		//BOTTOM LEFT square
		if(mustAttack == false && board[row+1][col-1].ocupied == false){
			board[row+1][col-1].marked = true;
			board[row+1][col-1].Draw();
		} 
		// if the square is ocupied and the king can eat
		else if(passive_checkers[row+1][col-1] != null && board[row+2][col-2].ocupied == false){
			mustAttack = true;
			board[row+2][col-2].marked = true;
			board[row+2][col-2].Draw();
		}
		if(col<7){// if the king is not on the corner, both bottom left and bottom right squares will be marked.
			//BOTTOM RIGHT square
			if(mustAttack == false &&  board[row+1][col+1].ocupied == false){
				board[row+1][col+1].marked = true;
				board[row+1][col+1].Draw();
			}
			else if(passive_checkers[row+1][col+1] != null && board[row+2][col+2].ocupied == false){
				mustAttack = true;
				board[row+2][col+2].marked = true;
				board[row+2][col+2].Draw();
			}
		}
	}
	//Columns
	if(row>0 && row<7){
		if(col == 0){ // Left Column
			// TOP RIGHT square
			if(mustAttack == false &&  board[row-1][col+1].ocupied == false){
				board[row-1][col+1].marked = true;
				board[row-1][col+1].Draw();
			}
			// if the square is ocupied and the king can eat
			else if(row>1 && passive_checkers[row-1][col+1] != null && board[row-2][col+2].ocupied == false){
				//row must be above the second to prevent slip out
				mustAttack = true;
				board[row-2][col+2].marked = true;
				board[row-2][col+2].Draw();
			}
			// BOTTOM RIGHT square
			if(mustAttack == false &&  board[row+1][col+1].ocupied == false){
				board[row+1][col+1].marked = true;
				board[row+1][col+1].Draw();
			}
			// if the square is ocupied and the king can eat
			else if(passive_checkers[row+1][col+1] != null && board[row+2][col+2].ocupied == false){
				mustAttack = true;
				board[row+2][col+2].marked = true;
				board[row+2][col+2].Draw();
			}
		}
		else if(col == 7){ // Right Column
			// TOP LEFT
			if(mustAttack == false &&  board[row-1][col-1].ocupied == false){
				board[row-1][col-1].marked = true;
				board[row-1][col-1].Draw();
			}
			// if the square is ocupied and the king can eat
			else if(passive_checkers[row-1][col-1] != null && board[row-2][col-2].ocupied == false){
				mustAttack = true;
				board[row-2][col-2].marked = true;
				board[row-2][col-2].Draw();
			}
			// BOTTOM LEFT
			if(mustAttack == false && board[row+1][col-1].ocupied == false){
				board[row+1][col-1].marked = true;
				board[row+1][col-1].Draw();
			}
			// if the square is ocupied and the king can eat
			else if(row<6 && passive_checkers[row+1][col-1] != null && board[row+2][col-2].ocupied == false){
				// row must be below the seventh to prevent slip out
				mustAttack = true;
				board[row+2][col-2].marked = true;
				board[row+2][col-2].Draw();
			}
		}
	}
}
//A function to un mark the squares - After a checker Move
function UnMark(){
	for(var i=0; i<8; i++){
		for(var j=0; j<8; j++){
			if(board[i][j].ocupied == false){ // If the square isnt ocupied we unmark it and draw the rect again.
				board[i][j].marked = false;
				board[i][j].Draw();
			}
		}	
	}
}
//Test Function if any checker must attack according to each player's turn - this function will turn mustAttack to true or false
function ifMustAttack(checkers, passive_checkers){
	// running on every checker left on the board
	for(var i =0; i < checkers.length; i++){
		for(var j=0; j < checkers[i].length; j++){
			//now we need to check if the checker is at the sides of the board - top, bottom,left and right.
			//then we have to ensure the checker is above col 1 and below col 6 - same on rows
			// (in those rows\cols he cant eat to both directions, it will be a slip out)
			if(checkers[i][j] != null){
				if(i > 1 && i<6 && j>1 && j<6){
				//if the checker is not on sides of the board
				//then we check, if there is a checker we can attack on the 4 relevant squares
					for(var k=i-1; k<=i+1; k+=2){ // running on the previous row and the following row
						for(var q=j-1; q<=j+1; q+=2){// running on the previous col and the following col
							var destsquare_row = k*2 - i; // calculate the destination square's row
							var destsquare_col = q*2 - j; // calculate the destination square's col
							//if there is an opponent's checker we can eat and an unocupied square after him.
							if(passive_checkers[k][q] != null && board[destsquare_row][destsquare_col].ocupied == false){
								//if the checker isnt king he cant eat backwards (k=opponent checker's row, i=player checker's row)
								//red cant eat UPand black cant eat DOWN
								if(checkers[i][j].isKing == false && whosturn == 'red' && i > k){
									mustAttack == false;
								}
								else if(checkers[i][j].isKing == false && whosturn == 'black' && i < k){
									mustAttack = false;
								}
								else{
									mustAttack = true;
								}
							} 
						}
					}
				}
				//Now we need to check the 4 sides of the board 
				else if(i <=1){
					//whether the checker is on the TOP side of the board
					if(j < 6){ //if the checker is NOT on the top-right side, so we are checking the bottom-right side
						if(passive_checkers[i+1][j+1] != null && board[i+2][j+2].ocupied == false){ // checks the bottom-right squares
							mustAttack = true;
						}
						if(checkers[i][j].isKing == false && whosturn == 'black') // if it's a black checker and he is not a king, he cant attack backwards
							mustAttack = false;
					}
					if(j > 1){ //if the checker is NOT on top-left side, so we check the bottom-left side
						if(passive_checkers[i+1][j-1] != null && board[i+2][j-2].ocupied == false){ // checks the bottom-left squares
							mustAttack = true;
						}
						if(checkers[i][j].isKing == false && whosturn == 'black')// if it's a black checker and he is not a king, he cant attack backwards
							mustAttack = false;
					}
				}
				else if(i >= 6){
				//whether the checker is on the BOTTOM side of the board
					if(j < 6){ // if the checker is NOT on the bottom-right side, so we are checking the top-right side
						if(passive_checkers[i-1][j+1] != null && board[i-2][j+2].ocupied == false) // checks the top-right squares
							mustAttack = true;
						if(checkers[i][j].isKing == false && whosturn == 'red') // if it's a red checker and he is not a king, he cant attack backwards
							mustAttack = false;
					}
					if(j > 1){ // if the checker is NOT on bottom-left side, so we are checing the top-left side
						if(passive_checkers[i-1][j-1] != null && board[i-2][j-2].ocupied == false) // checks the top-left squares
							mustAttack = true;
						if(checkers[i][j].isKing == false && whosturn == 'red') // if it's a red checker and he is not a king, he cant attack backwards
							mustAttack = false;
					}
				}
				if(j <= 1){
					//whether the checker is on the left side of the board
					if(i>1 && i< 6){ // above the first 2 rows and below the last 2 rows - already checked
						if(passive_checkers[i-1][j+1] != null && board[i-2][j+2].ocupied == false){ // checks the top-right squares
							mustAttack = true;
							if(checkers[i][j].isKing == false && whosturn == 'red') // if it's a red checker and he is not a king, he cant attack backwards
								mustAttack = false;
						}
						if(passive_checkers[i+1][j+1] != null && board[i+2][j+2].ocupied == false){ // checks the bottom-right squares
							mustAttack = true;
							if(checkers[i][j].isKing == false && whosturn == 'black')// if it's a black checker and he is not a king, he cant attack backwards
								mustAttack = false;
						}
					}
				}
				else if(j >= 6){
					//whether the checker is on the right side of the board
					if(i>1 && i< 6){ // above the first 2 rows and below the last 2 rows - already checked
						if(passive_checkers[i-1][j-1] != null && board[i-2][j-2].ocupied == false){ // checks the top-left squares
							mustAttack = true;
							if(checkers[i][j].isKing == false && whosturn == 'red') // if it's a red checker and he is not a king, he cant attack backwards
								mustAttack = false;
						}
						if(passive_checkers[i+1][j-1] != null && board[i+2][j-2].ocupied == false){ // checks the bottom-left squares
							mustAttack = true;
							if(checkers[i][j].isKing == false && whosturn == 'black') // if it's a black checker and he is not a king, he cant attack backwards
								mustAttack = false;
						}
					}
				}
			}
		}
	}
}
//Function which runs before every turn and checks if any player wins
function ifWin(){
	// 2 counters to count how many checkers left on the board - each player.
	var counter_black = 0;
	var counter_white = 0;
	for(var i =0;i<board.length; i++){
		if(i%2 == 0){ // runs on even rows
			for(var j =1; j<board[i].length; j+=2){
				if(black_checkers[i][j]!= null)
					counter_black++;
				else if(white_checkers[i][j]!= null)
					counter_white++;
			}
		}
		if(i%2 == 1){ //runs on odd rows
			for(var j =0; j<board[i].length-1; j+=2){
				if(black_checkers[i][j]!= null)
					counter_black++;
				else if(white_checkers[i][j]!= null)
					counter_white++;
			}
		}
	}
	if(counter_white == 0){ //if there is no white checker left on te board
		console.log("black wins!");
		whoswin = 'black'; //black wins
	}
	else if(counter_black == 0){ //if there is no black checkers left on the board
		console.log("red wins!");
		whoswin = 'red'; // red wins
	}
	else{
		whoswin = ''; // no one wins, game is continuing
	}
}
//Function to draw the win
function DrawWin(){
	cx.strokeStyle = 'black';
	cx.fillStyle= 'white';
	cx.strokeRect(100,100,500,380);
	cx.fillRect(100,100,500,380);

	cx.font = "75px arial";
	cx.fillStyle = 'black';
	cx.fillText( whoswin.toUpperCase() +" Wins!",150,300);
}

// First we Create the Game
CreateGame();
//then we start with a click event
window.addEventListener('click', function(e){
	var click_X = e.clientX; // Here we getting our click's X position 
	var click_Y = e.clientY; // Here we getting our click's Y position
	var click_col = Math.floor((click_X- screen_gap) / square_SIDE);// Calculate the click's column
	var click_row = Math.floor(click_Y / square_SIDE); // Calculate the click's row

	//a test if any player didnt win the game
	if(whoswin == ''){
		//then we check if any checker must attack
		if(whosturn == 'red')
			ifMustAttack(white_checkers,black_checkers);
		else if(whosturn == 'black')
			ifMustAttack(black_checkers,white_checkers);

		//test whether we clicked on Marked square - if we dont, we are unmarking all of the marked squares
		if(!board[click_row][click_col].marked){
			UnMark();
		}

		//Every click on a checker, this function will Mark the relevant squares
		Mark(click_row, click_col);

		 // Test if we click on a marked square, then it'll play the move
		if(whosturn == 'red' && board[click_row][click_col].marked == true){
			PlayMove(white_checkers, the_checker_row, the_checker_col, click_row, click_col); // Play The move
			UnMark(); // unmark all the rects on the board
			the_checker_col = null;
			the_checker_row = null;
		}
		// Test if we click on a marked square
		else if(whosturn == 'black' && board[click_row][click_col].marked == true){ 
			PlayMove(black_checkers, the_checker_row, the_checker_col, click_row, click_col); // Play The move
			UnMark(); // unmark all the rects on the board
			the_checker_col = null;
			the_checker_row = null;
		}
	}
	//Here we check before the turn is over, if any player won the game.
	ifWin();
	if(whoswin != '')
		DrawWin();	
});

