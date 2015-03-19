/*jslint node: true, browser: true */
"use strict";

function Controller() {

    var model = new Model(this),
        view = new CanvasDrawer(model),
        updateRate = 16.66666666667 * 2,
        run = false,
        gamma = 0,
        scoreDisplay = document.getElementById("scoreDisplay"),
        scores = new Scores();

    this.update = function() {

        if(run){

            // console.log("CONTROLLER: UPDATE");

            model.update(gamma);
            view.update();

            scoreDisplay.innerHTML = model.getScore();
        }
    };

    this.saveScore = function() {

        var name = window.prompt("Enter your name");
        scores.add(name, model.getScore());
    }

    this.gameOver = function() {

        run = false;

        this.showFailMenu();

    }

    this.gameWon = function() {

        run = false;

        this.showWinMenu();
    }

    this.run = function() {
        run = true;
    };

    this.pause = function() {
        run = false;
    };

    this.showFailMenu = function() {

        var menu = document.getElementById("failMenu");
        menu.className = "";
    }

    this.hideFailMenu = function() {
    
        var menu = document.getElementById("failMenu");
        menu.className = "noDisplay";

    }

    this.showWinMenu = function() {

        var menu = document.getElementById("winMenu");
        menu.className = "";
    }

    this.hideWinMenu = function() {
    
        var menu = document.getElementById("winMenu");
        menu.className = "noDisplay";

    }

    this.showMainMenu = function() {

        var game = document.getElementById("game");
        game.className = "noDisplay";

        var menu = document.getElementById("mainMenu");
        menu.className = "";

    };

    this.showPauseMenu = function() {

        var menu = document.getElementById("pauseMenu");

        menu.className = "";
    };

    this.hidePauseMenu = function(){

        var menu = document.getElementById("pauseMenu");

        menu.className = "noDisplay";
    };

    this.getUpdateTime = function() {
        return updateRate;
    };

    this.showLocalHighScores = function() {

        var highscoresLocal = document.getElementById("highscoresLocal");

        if(scores.isEmpty() === true){

            highscoresLocal.innerHTML = 
                "<p>There are no scores, play the game to score </p>";

        }else{

            highscoresLocal.innerHTML = "";

            var scoresMap = scores.get();

            for( var i = scoresMap.length - 1 ; i != 0; i--){

                var entry = scoresMap[i];

                highscoresLocal.innerHTML += "<p>" + entry[0] + "</p>" + "<p>" + entry[1] + "</p>";

            }


        }
         
        highscoresLocal.className = "";

        var highscoresGlobal = document.getElementById("highscoresGlobal");
        highscoresGlobal.className  = "noDisplay";
    };

    this.showGlobalHighScores = function() {

        var highscoresLocal = document.getElementById("highscoresLocal");
            highscoresLocal.className = "noDisplay";

            var highscoresGlobal = document.getElementById("highscoresGlobal");
            highscoresGlobal.className = "";

    };

    this.init = function() {

        var playButton = document.getElementById("playGame"),
            controller = this;
        playButton.addEventListener("click", function() {

            var game = document.getElementById("game");
            game.className = "";

            var menu = document.getElementById("mainMenu");
            menu.className += "noDisplay";

            controller.run();
        });

        document.getElementById("quitGame").addEventListener("click", function() {

            model.shutDown();
            window.close();

            //For in browser mode
            alert("If this was a real app I could add this...");

        });

        var highscoresButton = document.getElementById("highScoresButton");
        highscoresButton.addEventListener("click", function() {

            var highscores = document.getElementById("highscores");
            highscores.className = "";

            var menu = document.getElementById("mainMenu");
            menu.className = "noDisplay";

            controller.showLocalHighScores();

        });

        var highscoresLocalButton = document.getElementById("highscoresLocalButton");
        highscoresLocalButton.addEventListener("click", function() {

            controller.showLocalHighScores();
            
        });

        var highscoresGlobalButton = document.getElementById("highscoresGlobalButton");
        highscoresGlobalButton.addEventListener("click", function() {

            controller.showGlobalHighScores();

        });

        var highscoresExit = document.getElementById("highScoreExit");
        highscoresExit.addEventListener("click", function() {

            var highscores = document.getElementById("highscores");
            highscores.className = "noDisplay";

            var menu = document.getElementById("mainMenu");
            menu.className = "";

        });

        var menubutton = document.getElementById("menubutton");
        menubutton.addEventListener("click", function() {
            controller.pause();
            controller.showPauseMenu();
        });

        var pauseResumeButton = document.getElementById("pauseResume");
        pauseResumeButton.addEventListener("click", function() {
            controller.hidePauseMenu();
            controller.run();
        });

        var pauseRestartButton = document.getElementById("pauseRestart");
        pauseRestartButton.addEventListener("click", function() {
            controller.hidePauseMenu();
            model.resetModel();
            controller.run();
        });

        var pauseQuitMainButton = document.getElementById("pauseQuitMain");
        pauseQuitMainButton.addEventListener("click", function() {
            controller.hidePauseMenu();
            model.resetModel();
            controller.showMainMenu();
        });

        var pauseQuitButton = document.getElementById("pauseQuit");
        pauseQuitButton.addEventListener("click", function() {
            model.shutDown();
            window.close();
            alert("If this was a real app I could add this...");
        });

        var failRestartButton = document.getElementById("failRestart");
        failRestartButton.addEventListener("click", function() {
            controller.hideFailMenu();
            model.resetModel();
            controller.run();
        });

        var failSaveScoreButton = document.getElementById("failSaveScore");
        failSaveScoreButton.addEventListener("click", function() {
            controller.saveScore();
        });

        var failQuitMainButton = document.getElementById("failQuitMain");
        failQuitMainButton.addEventListener("click", function() {
            controller.hideFailMenu();
            model.resetModel();
            controller.showMainMenu();
        });

        var failQuitButton = document.getElementById("failQuit");
        failQuitButton.addEventListener("click", function() {
            model.shutDown();
            window.close();
            alert("If this was a real app I could add this...");
        });

        var winRestartButton = document.getElementById("winRestart");
        winRestartButton.addEventListener("click", function() {
            controller.hideWinMenu();
            model.resetModel();
            controller.run();
        });

        var winSaveScoreButton = document.getElementById("winSaveScore");
        winSaveScoreButton.addEventListener("click", function() {
            controller.saveScore();
        });

        var winQuitMainButton = document.getElementById("winQuitMain");
        winQuitMainButton.addEventListener("click", function() {
            controller.hideWinMenu();
            model.resetModel();
            controller.showMainMenu();
        });

        var winQuitButton = document.getElementById("winQuit");
        winQuitButton.addEventListener("click", function() {
            model.shutDown();
            window.close();
            alert("If this was a real app I could add this...");
        });

        if(window.DeviceOrientationEvent){

            window.addEventListener("deviceorientation", function(eventData){

                var gameArea = document.getElementById("gameArea");
                gamma = eventData.gamma;

            });

        }


        window.addEventListener("resize", model.getVars);

        window.setInterval(this.update, updateRate);

    };

    this.init();
}

document.addEventListener("load", new Controller());