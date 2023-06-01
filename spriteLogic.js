//start sprite anim logic
const playerImage = new Image();
playerImage.src = 'sprite/sheet.png';
const spriteWidth = 252;
const spriteHeight = 250;

const staggerFrames = 2;
const spriteAnimations = [];
const animationStates = [
	{
		name: 'Sunflower',
		frames: 55,
	},
	{
		name: 'PeaShooter',
		frames: 49,
	},
	{
		name: 'Normal_walk',//zombie
		frames: 46,
	},
	{
		name: 'ConeHead_walk',//zombie
		frames: 21,
	},
	{
		name: 'SnowPea',//zombie
		frames: 20,
	}
]
animationStates.forEach((state, index) => {
	let frames = {
		loc: [],
	}
	//auto generating sprite locations
	for (let j = 0; j < state.frames; j++) {
		let positionX = j * spriteWidth;
		let positionY = 0;
		frames.loc.push({x: positionX, y: positionY});
	}
	spriteAnimations[state.name] = frames;
});
console.log(spriteAnimations);
//end sprite anim logic (i stole this from some guy on utub lmao)