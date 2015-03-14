/*jslint node: true, browser: true */
"use strict";


function Model(controller) {

    var gameHeader = document.getElementById("gameHeader"),
        gameArea = document.getElementById("gameArea"),
        gameHeight,
        gameWidth,
        paddle = {},
        ball = {},
        blocks = new Array(),
        start = true;

    function block(x, y, width, color) {
        var x = x,
            y = y,
            width = width,
            height = width,
            color = color,
            visible = true;

        this.getX = function(){
            return x;
        };

        this.getY = function(){
            return y;
        };

        this.getWidth = function(){
            return width;
        };

        this.getHeight = function(){
            return height;
        };

        this.getColor = function(){
            return color;
        }

        this.visible = function(){
            return visible;
        };

        this.remove = function() {
            visible = false;
        };
    }

    this.init = function() {

    };

    this.getVars = function() {

        gameHeight = gameArea.clientHeight;
        gameWidth = gameArea.clientWidth;

        paddle.width = gameWidth * 0.2;
        paddle.height = 15;
        paddle.x = (gameWidth / 2) - (paddle.width / 2);
        paddle.y = gameHeight - 40;
        paddle.speed = 0;

        ball.width = 8;
        ball.height = ball.width;
        ball.xstart = (gameWidth / 2) - (ball.width / 2);
        ball.ystart = gameHeight - 60;
        ball.x = ball.xstart;
        ball.y = ball.ystart;
        ball.vx = 0;
        ball.vxstart = ball.vx;
        ball.vy = -100;
        ball.vystart = ball.vy;

        var blocksPerRow = 11,
            blocksPerCol = 4,
            blockWidth = gameWidth / blocksPerRow,
            colors = ["#568545" , "#785675", "#564357", "#545643"];

        for( var x = 0; x < blocksPerRow; x++){

            blocks[x] = new Array();

            for (var y = 0; y < blocksPerCol; y++){

                blocks[x][y] = new block(x * blockWidth, y * blockWidth, blockWidth, colors[y]);
            }
        }

        console.log(blocks);

    };

    this.getBlocks = function() {
        return blocks;
    };

    this.getPaddleData = function() {
        return paddle;
    }

    this.getBallData = function() {
        return ball;
    }

    this.update = function(gamma) {

        if(start){
            this.getVars();
            start = false;
        }


        this.movePaddle(gamma);
        this.moveBall();


    };

    this.ballCollision = function(x, y, rect){

        var x1 = x - ball.width,
            x2 = x + ball.width,
            y1 = y - ball.width,
            y2 = y + ball.width;

        // console.log("Comparing: " + x1 + " " + x2 + " " + y1 + " " + y2 + " to " 
        //         + rect.x + " " + rect.x2 + " " + rect.y + " " + rect.y2);

        if( !(x2 < rect.x || x1 > rect.x2 || y1 > rect.y2 || y2 < rect.y)){
            console.log("col");
            return true;
        }

        return false;

    }

    this.moveBall = function() {

        var x = ball.x + ball.vx * ( controller.getUpdateTime() / 1000);
        var y = ball.y + ball.vy * ( controller.getUpdateTime() / 1000);

        var rect = {};
        rect.x = 0;
        rect.y = 0;
        rect.x2 = gameWidth;
        rect.y2 = gameHeight;

        /*
         * Detect for the walls first
         */
        if( x - ball.width/2 < 0.0 ) { // left wall
            x = 0 + ball.width /2;
            ball.vx *= -1;
        }

        if ( x + ball.width/2 > gameWidth ){ //right wall
            x = gameWidth - ball.width/2;
            ball.vx *= -1;
        }

        if ( y - ball.width /2 < 0.0 ){ //top wall
            y = 0 + (ball.width /2);
            ball.vy *= -1;
        }

        if ( y + ball.width /2 > gameHeight){// bottom wall
            x = ball.xstart;
            y = ball.ystart;
            ball.vx = ball.vxstart;
            ball.vy = ball.vystart;
        }

        /*
         * Next check for the paddle. We first need to check for a collision
         * Then work out what kind of collision happened.
         *
         * There is no point checking for collisions with the bottom of the 
         * paddle.
         */

        var rect = {};
        rect.x = paddle.x;
        rect.y = paddle.y;
        rect.x2 = paddle.x + paddle.width;
        rect.y2 = paddle.y + paddle.height;

        if (this.ballCollision(x, y, rect)){

            /*
             * Okay collision happened, detect what side it happened on
             */
           
            /*
             * if all was outside of a y collision, now its causing one
             */
            if( ball.y + ball.height /2 < paddle.y || ball.y - ball.height / 2 > paddle.y + paddle.height){

                y = paddle.y - ball.height/2;
                ball.vy *= -1;

                ball.vx += paddle.speed * 0.2;

            }else{ // must be the sides

                //If was outside left of paddle && on left side of paddle
                if(ball.x + ball.width/2 < paddle.x 
                    && x - ball.width/2 < paddle.x + (paddle.width/2)){

                    x = paddle.x - ball.width/2;
                    ball.vx = (ball.vx * -1 ) + paddle.speed;

                }else if(ball.x > paddle.x + paddle.width){ //right side

                    x = paddle.x + paddle.width + ball.width/2;
                    ball.vx = (ball.vx * -1 ) + paddle.speed;
                }
            }
        }//finished paddle checks

        /*
         * Check for collisions with the blocks
         */
        for( var xcoord = 0; xcoord < blocks.length; xcoord++){
            for(var ycoord = 0; ycoord < blocks[xcoord].length; ycoord++){

                var block = blocks[xcoord][ycoord]; // get block

                if(block.visible()){ // if block exists

                    rect.x = block.getX();
                    rect.x2 = block.getX() + block.getWidth();
                    rect.y = block.getY();
                    rect.y2 = block.getY() + block.getHeight();

                    //If collision
                    if( this.ballCollision(x, y, rect)){

                        block.remove();

                        //Top of block
                        if(ball.y < block.getY() && y < block.getY() - block.getHeight()/2){
                            console.log("top");
                            y = block.getY() - ball.height;
                            ball.vy *= -1;
                        }else if(ball.y > block.getY() + block.getHeight() / 2 && y > block.getY() + block.getHeight()/2){
                            console.log("bottom");
                            y = block.getY() + block.getHeight() + block.getHeight();
                            ball.vy *= -1;
                        } else if(ball.x < block.getX() && x < block.getX() + (block.getWidth()/2)){
                            x = block.getX() - ball.width;
                            ball.vx *= -1;
                        } else if(ball.x > block.getX() + block.getWidth() && x > block.getX() - block.getWidth() / 2){
                            x = block.getX() + block.getWidth() + block.getWidth();
                            ball.vx *= -1;
                        }

                    }

                }
            }
        }


        ball.x = x;
        ball.y = y;
    };

    this.movePaddle = function(gamma) {

        var multiplier = 1;
        if( gamma < 0 ){
            multiplier = -1;
            gamma = gamma * -1;
        }

        if(gamma < 0.5 ){
            gamma = 0;
        }

        var speed = Math.pow(gamma, 1.35) / 4 * multiplier * 2;

        paddle.speed = speed * controller.getUpdateTime();
        paddle.x = paddle.x + speed;

        if (paddle.x <= 0) {
            paddle.x = 0;
        } else if (paddle.x + paddle.width >= gameWidth) {
            paddle.x = gameWidth - paddle.width;
        }

        //Bug hunting, displays the data
        // var gameArea = document.getElementById("gameArea");
        // gameArea.innerHTML = gameWidth + " " + paddle.x + " " + speed + "</br>";

    };

    this.resetModel = function() {
        console.log("--MODEL---: reset");

        start = true;
    }

    this.shutDown = function() {
        console.log("--MODEL---: shut down");
    }

    this.init();

}