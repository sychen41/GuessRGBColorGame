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

var colors;
var targetColor;
var colorDisplay = document.querySelector("#colorDisplay");
var message = document.querySelector("#message");
var newOrAgain = document.querySelector("#newOrAgain");
var squares = document.querySelectorAll(".square");
var easy = document.querySelector("#easy");
var hard = document.querySelector("#hard");
var easyMode = false;

easy.addEventListener("click", function() {
	easy.classList.add("selected");
	hard.classList.remove("selected");
	easyMode = true;
	init();
});
hard.addEventListener("click", function() {
	easy.classList.remove("selected");
	hard.classList.add("selected");
	easyMode = false;
	init();
});

function init() {
	var totalSquares = 6; //default mode : 6 squares
	if (easyMode) totalSquares = 3;
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
}
init();

//add listeners to squares
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

function changeAllColor() {
	for(var i=0;i<squares.length;i++) {
		squares[i].style.background = targetColor;
	}
}

newOrAgain.addEventListener("click", function(){
	newOrAgain.textContent = "New Colors";
	init();
});

