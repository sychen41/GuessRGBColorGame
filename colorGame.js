var colors = [
	"rgb(255, 0, 0)", // space can't be omited. wrong: rgb(255,0,0)
	"rgb(255, 255, 0)",
	"rgb(0, 255, 0)",
	"rgb(0, 255, 255)",
	"rgb(255, 0, 255)",
	"rgb(0, 0, 255)"
];
var targetColor = colors[3];
var colorDisplay = document.querySelector("#colorDisplay");
colorDisplay.textContent = targetColor;

var squares = document.querySelectorAll(".square");


for(var i=0;i<squares.length;i++) {
	squares[i].style.background = colors[i];

	squares[i].addEventListener("click", function(){
		var selectColor = this.style.background;
		if (selectColor === targetColor)
			changeAllColor();
		else
			this.style.background = "#232323";
			//this.classList.add("wrong");
	});
}

function changeAllColor() {
	for(var i=0;i<squares.length;i++) {
		squares[i].style.background = targetColor;
	}
}