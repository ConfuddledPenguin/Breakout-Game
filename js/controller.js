/*jslint node: true, browser: true */
"use strict";

function Controller() {

    var model = new Model(this),
        view = new CanvasDrawer(model),
        updateRate = 16.66666666667 * 2,
        run = false,
        gamma = 0;

    this.update = function() {

        if(run){

            // console.log("CONTROLLER: UPDATE");

            model.update(gamma);
            view.update();
        }
    };

    this.run = function() {
        run = true;
    };

    this.pause = function() {
        run = false;
    };

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