/*jslint node: true, browser: true */
"use strict";

function CanvasDrawer(model) {

	var canvasElement = document.getElementById("gameCanvas")
	var gameArea = document.getElementById("gameArea");
	var firstUpdate = true,
		canvas = canvas = canvasElement.getContext("2d");

	console.log(canvas);

	this.update = function() {
		// console.log("--VIEW----: UPDATE");

		/*
		 * Ah web dev how I love thee...
		 *
		 * Since setting the width on the canvas some what dynamically is 
		 * awkward the below mess is required.
		 * 
		 * You can forgot rotating the device. If your want too, simply go away, 
		 * thank you.
		 * 
		 */ 
		if(firstUpdate){
			canvasElement.style.height = gameArea.clientHeight + "px";
			canvasElement.style.width = gameArea.clientWidth + "px";
			canvas.canvas.height = gameArea.clientHeight ;
			canvas.canvas.width = gameArea.clientWidth;

			firstUpdate = false;
		}

		this.clearCanvas();
		this.drawPaddle();
		this.drawBlocks();
		this.drawBall();

	};

	this.clearCanvas = function() {

		canvas.clearRect(0,0,canvas.canvas.width, canvas.canvas.height);

	};

	this.drawBlocks = function() {

		var blocks = model.getBlocks();

		for( var x = 0; x < blocks.length; x++){
            for (var y = 0; y < blocks[x].length; y++){

                var block = blocks[x][y];

                if(block.visible()){
                	var color = block.getColor();
                	canvas.fillStyle = color;
                	canvas.fillRect(block.getX(), block.getY(), 
                				block.getWidth(), block.getHeight());


                	var edge = 4;

                	//top
                	canvas.fillStyle = shadeColor(color, 40);
                	canvas.beginPath();
                	canvas.moveTo(block.getX(), block.getY());
                	canvas.lineTo(block.getX() + edge, block.getY() + edge);
                	canvas.lineTo(block.getX() + block.getWidth() - edge, block.getY() + edge);
                	canvas.lineTo(block.getX() + block.getWidth(), block.getY());
                	canvas.closePath();
                	canvas.fill();

                	//bottom
                	canvas.fillStyle = shadeColor(color, -20);

                	canvas.beginPath();
                	canvas.moveTo(block.getX(), block.getY() + block.getHeight());
                	canvas.lineTo(block.getX() + edge, block.getY() + block.getHeight() - edge);
                	canvas.lineTo(block.getX() + block.getWidth() - edge, block.getY() + block.getHeight() - edge);
                	canvas.lineTo(block.getX() + block.getWidth(), block.getY() + block.getHeight());
                	canvas.closePath();
                	canvas.fill();

                	//right
                	canvas.fillStyle = shadeColor(color, -10);

                	canvas.beginPath();
                	canvas.moveTo(block.getX() + block.getWidth(), block.getY());
                	canvas.lineTo(block.getX() + block.getWidth() - edge, block.getY() + edge);
                	canvas.lineTo(block.getX() + block.getWidth() - edge, block.getY() + block.getHeight() - edge);
                	canvas.lineTo(block.getX() + block.getWidth(), block.getY() + block.getHeight());
                	canvas.closePath();
                	canvas.fill();

                	//left
                	canvas.fillStyle = shadeColor(color, 20);

                	canvas.beginPath();
                	canvas.moveTo(block.getX() , block.getY());
                	canvas.lineTo(block.getX() + edge, block.getY() + edge);
                	canvas.lineTo(block.getX() + edge, block.getY() + block.getHeight() - edge);
                	canvas.lineTo(block.getX(), block.getY() + block.getHeight());
                	canvas.closePath();
                	canvas.fill();
                	
                }
            }
        }
	};

	this.drawBall = function() {

		var ball = model.getBallData();

		// console.log(ball);

		//base of ball
		canvas.fillStyle = "#00ff00";
		canvas.beginPath();
		canvas.lineWidth = 0;
		canvas.arc(ball.x, ball.y, ball.width/2, 0, 2*Math.PI);
		canvas.fill();

	}

	this.drawPaddle = function() {

		var paddle = model.getPaddleData();

		// console.log(paddle);

		canvas.fillStyle = "#FF0000";
		canvas.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
	};
}

function shadeColor(color, percent) {  
    var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}