function randomColorGen(total) {
	var colors = [];
	for(var i=0;i<total;i++) {
		colorStr = "rgb(";
		colorStr += Math.floor(Math.random()*256) + ", "; //space after , needed
		colorStr += Math.floor(Math.random()*256) + ", ";
		colorStr += Math.floor(Math.random()*256) + ")";
		colors.push(colorStr);
	}
	return colors;
} 

var totalSquares = 6; //default mode : 6 squares
var colors = [];
var targetColor;
var colorDisplay = document.querySelector("#colorDisplay");
var message = document.querySelector("#message");
var newOrAgain = document.querySelector("#newOrAgain");
var squares = document.querySelectorAll(".square");
var modeBtns = document.querySelectorAll(".mode");

init();

function init() {
	//init global variables
	reset();
	//add listeners to squares
	setupSquares();
	//mode buttons 
	setupModeButtons();
	//newOrAgain button
	newOrAgain.addEventListener("click", function(){
		reset();
	});
	//add service worker
	addServiceWorker();
}

function setupSquares() {
	for(var i=0;i<squares.length;i++) {
		squares[i].addEventListener("click", function(){
			var selectColor = this.style.background;
			if (selectColor === targetColor) {
				changeAllColor();
				message.textContent = "Correct!!!";
				document.querySelector("h1").style.background = targetColor;
				newOrAgain.textContent = "Play Again";
			}
			else {
				this.style.background = "#232323";
				message.textContent = "Try Again!";
			}
		});
	}
}

function setupModeButtons() {
	for(var i=0;i<modeBtns.length;i++) {
		modeBtns[i].addEventListener("click", function(){
			modeBtns[0].classList.remove("selected");
			modeBtns[1].classList.remove("selected");
			this.classList.add("selected");
			this.textContent === "easy" ? totalSquares = 3 : totalSquares = 6;
			reset();
		});
	}
}

function reset() {
	//set h1 background color(game title);
	document.querySelector("h1").style.background = "steelblue";
	//generate colors
	colors = randomColorGen(totalSquares);
	//set target color
	targetColor = colors[Math.floor(Math.random()*colors.length)];
	colorDisplay.textContent = targetColor;
	//change all squares to new colors
	for(var i=0;i<squares.length;i++) {
		if (colors[i]) {
			squares[i].style.display = "block";
			squares[i].style.background = colors[i];
		}
		else
			squares[i].style.display = "none";
	}
	//reset messages
	message.textContent = "";
	newOrAgain.textContent = "New Colors";
}

function changeAllColor() {
	for(var i=0;i<squares.length;i++) {
		squares[i].style.background = targetColor;
	}
}

function addServiceWorker() {
	if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./serviceWorker.js')
             .then(function() { console.log('Service Worker Registered'); });
  	}
}



