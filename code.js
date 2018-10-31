// global setup
document.getElementById("canvas").style.zIndex = "-1";
var ctx = canvas.getContext("2d");
var grid = [];
var stack = [];
var w = 10;
var xOffset = 10;
var yOffset = 40;

var rows;
var cols;

function setup(rows, cols) {
	for(var i = 0; i < rows; i++) {
		for(var j = 0; j < cols; j++) {
			var cell = new Cell(i, j);
			grid.push(cell);
			cell.light("gray");
		}
	}
}

function recursiveBacktrack(i, j, rows, cols) {
	var index = (i*cols) + j;
	grid[index].visited = true;
	grid[index].light("white");

	var choices = [];
	var wallBreak = [];
	if(i > 0 && !grid[index-cols].visited) {
		choices.push(grid[index-cols]);
		wallBreak.push("top");
	}
	if(i < rows - 1 && !grid[index+cols].visited) {
		choices.push(grid[index+cols]);
		wallBreak.push("bottom");
	}
	if(j > 0 && !grid[index-1].visited) {
		choices.push(grid[index-1]);
		wallBreak.push("left");
	}
	if(j < cols - 1 && !grid[index+1].visited) {
		choices.push(grid[index+1]);
		wallBreak.push("right");
	}
	
	if(choices.length > 0) {
		var pick = Math.floor(Math.random() * choices.length);
		switch(wallBreak[pick]) {
			case "left":
				grid[index].walls[3] = false;
				choices[pick].walls[1] = false;
				break;
			case "right":
				grid[index].walls[1] = false;
				choices[pick].walls[3] = false;
				break;
			case "top":
				grid[index].walls[0] = false;
				choices[pick].walls[2] = false;
				break;
			case "bottom":
				grid[index].walls[2] = false;
				choices[pick].walls[0] = false;
				break;
		}
		stack.push(grid[index]);
		setTimeout(recursiveBacktrack, 1, choices[pick].y, choices[pick].x, rows, cols);
	} else if(stack.length !== 0) {
		var next = stack.pop();
		setTimeout(recursiveBacktrack, 1, next.y, next.x, rows, cols);
	}
}  

function draw() {
	for(var i = 0; i < grid.length; i++) grid[i].show();
}

function Cell(i, j) {
	
	this.x = j;
	this.y = i;
	this.walls = [true, true, true, true];
	this.visited = false;
	
	this.show = function() {
		ctx.strokeStyle = "black";
		ctx.lineWidth = "2";
		
		if(this.walls[0]) {
			ctx.beginPath();
			ctx.moveTo((this.x * w) + xOffset, (this.y * w) + yOffset);
			ctx.lineTo((this.x * w) + w + xOffset, (this.y * w) + yOffset);
			ctx.stroke();
		}
		if(this.walls[1]) {
			ctx.beginPath();
			ctx.moveTo((this.x * w) + w + xOffset, (this.y * w) + yOffset);
			ctx.lineTo((this.x * w) + w + xOffset, (this.y * w) + w + yOffset);
			ctx.stroke();
		}
		if(this.walls[2]) {
			ctx.beginPath();
			ctx.moveTo((this.x * w) + w + xOffset, (this.y * w) + w + yOffset);
			ctx.lineTo((this.x * w) + xOffset, (this.y * w) + w + yOffset);
			ctx.stroke();
		}
		if(this.walls[3]) {
			ctx.beginPath();
			ctx.moveTo((this.x * w) + xOffset, (this.y * w) + w + yOffset);
			ctx.lineTo((this.x * w) + xOffset, (this.y * w) + yOffset);
			ctx.stroke();
		}
	};
	
	this.light = function(color) {
		ctx.beginPath();
		ctx.rect((this.x * w) + xOffset, (this.y * w) + yOffset, w, w);
		ctx.fillStyle = color;
		ctx.fill();
		this.show();
	};
}

function reset() {
	canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
	grid = [];
	stack = [];
}

function generate() {
	document.getElementById("generate").disabled = true;
	reset();
	rows = Number(document.getElementById("height").value);
	cols = Number(document.getElementById("width").value);
	w = (window.innerWidth > window.innerHeight ? window.innerHeight/rows : window.innerWidth/rows);
	setup(rows, cols);
	recursiveBacktrack(0, 0, rows, cols);
	draw();
	document.getElementById("generate").disabled = false;
}