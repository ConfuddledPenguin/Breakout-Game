/*jslint node: true, browser: true */
"use strict";


function Scores() {

	var scoresMap = {};

	var scoreLocation = "com.tom-maxwell.breakout.scores"; 
	
	this.load = function() {

		if (localStorage.getItem(scoreLocation)) {
	        var scoreString = localStorage.getItem(scoreLocation);
	        scoresMap = JSON.parse(scoreString);
	    }
	};

	this.save = function() {

		var scoresJSON = JSON.stringify(scoresMap);
        localStorage.setItem(scoreLocation, scoresJSON);
	};

	this.add = function(name, score) {

		var values = {};
		values[0] = name;
		values[1] = score;

		var d = new Date();

		scoresMap[d.getTime()] = values;
		this.save();
	}

	this.isEmpty = function(){

		var size = 0, key;
		for (key in scoresMap) {
		    if (scoresMap.hasOwnProperty(key)) size++;
		}
    

		console.log(size);

		if(size === 0 ){
			return true;
		}

		return false;
	}

	this.get = function() {

		var sortable = [];
		for (var name in scoresMap)
		      sortable.push([name, scoresMap[name]]);
		sortable.sort(function(a, b) {return a[1][1] - b[1][1]});

		return sortable;
	}

	this.clear = function(){

		scoresMap = {};
		this.save();
	}

	this.load();
}