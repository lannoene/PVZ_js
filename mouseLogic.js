function calcStaticPos(x, y) {
	y = Math.floor((y - 80)/80);
	x = Math.floor((x - 200)/64);
	return [x, y];
}
let mousePos;
function getMousePosition(canvas, event) {
	let rect = canvas.getBoundingClientRect();
	let tempMousePosX = mouseX = event.clientX - rect.left;
	let tempMousePosY = mouseY = Math.floor(event.clientY - rect.top);
	return [tempMousePosX, tempMousePosY];
}

let canvasElem = document.querySelector("canvas");
  
canvasElem.addEventListener("mousedown", function(e) {
	if (gameover === false && pauseMode === false) {
		tempMouseArray = getMousePosition(canvasElem, e);
		tempMousePosX = tempMouseArray[0];
		tempMousePosY = tempMouseArray[1];

		mousePos = calcStaticPos(mouseX, mouseY);
		if (isplantSelected === true) {
			if (mousePos[0] >= 0 && mousePos[1] >= 0 && mousePos[0] <= 8 && mousePos[1] <= 4) {
				createPlant(mousePos[1], mousePos[0], plantIdPub);//y, x
				isplantSelected = false;
				console.log('planted' + plantIdPub);
				console.log(game_Plants);
			}
		}
	}
});
let mouseUpPosX;
let mouseUpPosY;
canvasElem.addEventListener("mouseup", function(e) {
	let mouseArray = getMousePosition(canvasElem, e);
	mouseUpPosX = mouseArray[0];
	mouseUpPosY = mouseArray[1];
});

function clearMouseInput() {
	mouseUpPosX = null;
	mouseUpPosY = null;
	tempMousePosX = null;
	tempMousePosY = null;
}