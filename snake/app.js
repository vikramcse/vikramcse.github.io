(function() {
	'use strict';

	window.onload = function() {
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var score = 0;
		var level = 0;
		var FOOD = 1;
		var SNAKE = 2;
		var  direction = 0;
		var active = true;
		var speed = 500;

		// Initialize the matrix.
	    var map = new Array(20);
	    for (var i = 0; i < map.length; i++) {
	        map[i] = new Array(20);
	    }

	    var snake = new Array(3);

		/*
		By default, the canvas object will have a height of 300 pixels of height by 300 pixels of width.
		will be using a 20x20 matrix where each slot has a size of 10 pixels of height by 10 pixels of width.
		so we need 200 x 200, then 20 more in height form score and 4 for border.
		*/

		canvas.width = 204;
		canvas.height = 224;

		var body = document.getElementsByTagName('body')[0];
		body.appendChild(canvas);

		// add snake
		// Add the new modified map matrix
		map = generateSnake(map);

		// generate food
		// Add the new modified map matrix
		map = generateFood(map);
		drawGame();

		window.addEventListener('keydown', function(e) {
	        if (e.keyCode === 38 && direction !== 3) {
	            direction = 2; // Up
	        } else if (e.keyCode === 40 && direction !== 2) {
	            direction = 3; // Down
	        } else if (e.keyCode === 37 && direction !== 0) {
	            direction = 1; // Left
	        } else if (e.keyCode === 39 && direction !== 1) {
	            direction = 0; // Right
	        }
	    });

		function drawGame() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Traverse all the body pieces of the snake, starting from the last one
        for (var i = snake.length - 1; i >= 0; i--) {

            // We're only going to perform the collision detection using the head
            // so it will be handled differently than the rest
            if (i === 0) {
                switch(direction) {
                    case 0: // Right
                        snake[0] = { x: snake[0].x + 1, y: snake[0].y }
                        break;
                    case 1: // Left
                        snake[0] = { x: snake[0].x - 1, y: snake[0].y }
                        break;
                    case 2: // Up
                        snake[0] = { x: snake[0].x, y: snake[0].y - 1 }
                        break;
                    case 3: // Down
                        snake[0] = { x: snake[0].x, y: snake[0].y + 1 }
                        break;
                }

                // Check that it's not out of bounds. If it is show the game over popup
                // and exit the function.
                if (snake[0].x < 0 || 
                    snake[0].x >= 20 ||
                    snake[0].y < 0 ||
                    snake[0].y >= 20) {
                    showGameOver();
                    return;
                }

                // Detect if we hit food and increase the score if we do,
                // generating a new food position in the process, and also
                // adding a new element to the snake array.
                if (map[snake[0].x][snake[0].y] === 1) {
                    score += 10;
                    map = generateFood(map);

                    // Add a new body piece to the array
		            // means take a last part of the snake is copied and add to the head 
                    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
                    map[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;

                    // If the score is a multiplier of 100 (such as 100, 200, 300, etc.)
                    // increase the level, which will make it go faster.
                    if ((score % 100) == 0) {
                        level += 1;
                    }
                
                // Let's also check that the head is not hitting other part of its body
                // if it does, we also need to end the game.
                } else if (map[snake[0].x][snake[0].y] === 2) {
                    showGameOver();
                    return;
                }

                map[snake[0].x][snake[0].y] = 2;
            } else {

                // Remember that when they move, the body pieces move to the place
                // where the previous piece used to be. If it's the last piece, it
                // also needs to clear the last position from the matrix

                // removed tha tail of snake
                if (i === (snake.length - 1)) {
                    map[snake[i].x][snake[i].y] = null;
                }

                // place the part where the previous piece used to be in last point
                snake[i] = { x: snake[i - 1].x, y: snake[i - 1].y };
                map[snake[i].x][snake[i].y] = 2;
            }
        }

        // Draw the border as well as the score
        drawMain();

        // Start cycling the matrix
        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[0].length; y++) {
                if (map[x][y] === 1) {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(x * 10, y * 10 + 20, 10, 10);
                } else if (map[x][y] === 2) {
                    ctx.fillStyle = 'orange';
                    ctx.fillRect(x * 10, y * 10 + 20, 10, 10);          
                }
            }
        }
        
        if (active) {
            setTimeout(drawGame, speed - (level * 50));
        }
    }

		function drawMain() {
			ctx.lineWidth = 2;
			ctx.stroke = 'black';

			// it is starting from (x1, y1) => (2, 20) because 2 units are taken by border
			// and uppder 20 is for score stuff then (x2, y2) => (200, 200) because total 
			// boder is substracted drom x2 and from height the score section and boder is substracted 
			ctx.strokeRect(2, 20, canvas.width - 4, canvas.height - 24);

			ctx.font = '12px sans-serif';
	        ctx.fillText('Score: ' + score + ' - Level: ' + level, 2, 12);
	    }

	    function generateFood(map) {

	    	// Generate a random position for the rows and the columns.
	    	// multiplying 19 because we need any position between 1 - 20
	    	// Math.random gives float numbers and multiplying 19 takes that
	    	// number into range between 0-19

	    	var randomX = Math.round(Math.random() * 19);
	    	var randomY = Math.round(Math.random() * 19);

	    	// We also need to watch so as to not place the food
		    // on the a same matrix position occupied by a part of the
		    // snake's body.
		    while (map[randomX][randomY] === SNAKE) {
		        randomX = Math.round(Math.random() * 19);
		        randomY = Math.round(Math.random() * 19);
		    }
		 	
		 	// set random food location into grid
		    map[randomX][randomY] = FOOD;
		    return map;
	    }

	    function generateSnake(map) {
	    	// Generate a random position for the row and the column of the head.
	    	var randomX = Math.round(Math.random() * 19);
	        var randomY = Math.round(Math.random() * 19);

	        // what if we placed the first snake pos and next pos will go out of bound
	        // for that we would have to check that if the pixel is out of bound then 
	        // generate next random position
	        // we are considering only x axis because the at start snake moves form left to right

	        while((randomX - snake.length) < 0) {
	        	var randomX = Math.round(Math.random() * 19);
	        }

	        for(var i = 0; i < snake.length; i++) {
	        	snake[i] = {x: randomX - i, y: randomY};
	        	map[randomX - i][randomY] = SNAKE;
	        }
		    
		    return map;
	    }

	    function showGameOver() {
		    // Clear the canvas
		    ctx.clearRect(0, 0, canvas.width, canvas.height);
		 
		    ctx.fillStyle = 'black';
		    ctx.font = '16px sans-serif';
		    
		    ctx.fillText('Game Over!', ((canvas.width / 2) - (ctx.measureText('Game Over!').width / 2)), 50);
		 
		    ctx.font = '12px sans-serif';
		 
		    ctx.fillText('Your Score Was: ' + score, ((canvas.width / 2) - (ctx.measureText('Your Score Was: ' + score).width / 2)), 70);
		}
	};

}());