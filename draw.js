const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 500;
/*todo:
* add sunflower gen sun sound effect
* add lawnmowers
* add zombie eating plant animation
* buckethead zombie (just code a bucket onto the normal zombie)
* add a level reset button (all it does is just call resetLevelVars();)
* add achivements
* add unsoddened ground for early levels
* add bitmask to plant array;
*/

//count vars
let gameFrame = 0;
let zombieDelay = 500;//frames
let game_Sun = [];
let sunDelay = 800;//auto gen delay
let pauseMode = false;
let zombieSpawnWeight = 0.1;
let packetSoundTimes = 0;
let getSeed;
//titlescreen var
let gameover = false;
let isOn = 'titleScreen';
//zombie var
let game_Zombies = [];
var countZombies = 0;
let levelZombies = []; //1, is zombie type, 2 is frame to spawn (* 10). always has to be in order
//plants var
let game_Plants = [];
var countPlants = 0;
let stagFrmPea = 100;
let game_Packet_choose = [];//packet ids. player will choose this
let game_Packets = [];
let everyPacket = 6;
let allPackets = [new packet(0)];
let unlockedPackets = 1;
var plantIdPub;
let sunflowers = 0;
//pea vars
let game_Peas = [];
let countPeas = 1;
//click vars
let mouseX;
let mouseY;
let tempMousePosX;
let tempMousePosY;
var scroll = 0;
//player vars
let sun_count = 50;
let isplantSelected = false;
let plantSelected;
let isShovelSelected = false;
let username = 'New User';
let userInfo;
let level = 1;
let world = 1;
let currentLvl = false;
let nextPacket;

function drawlevel() {
	if (isOn == 'game_level') {
		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		ctx.drawImage(backgroundLayer, 0, 0, 1100, 500);

		//refer to draw logic
		game_Peas.forEach((object, index) => {
			object.update(index);
			object.draw();
		});

		game_Plants.forEach((object, index) => {
			object.update(index);
			object.draw(index);
		});

		game_Zombies.forEach((object, index) => {
			object.update(index);
			object.draw();
		});
	
		game_Packets.forEach((object, index) => {
			object.update(index);
			object.draw();
		});

		game_Sun.forEach((object, index) => {
			object.update(index);
			object.draw();
		});
		ctx.textAlign = "left";
		ctx.font = "30px Arial";
		ctx.fillStyle = "#000000";
		ctx.drawImage(sunBank, 0, 0, sunBank.width/3, sunBank.height/3);
		ctx.fillText(sun_count, 50, 33);

		if (gameFrame % (sunDelay * 2) === 0) {
			let rng = Math.floor(Math.random() * 550) + 200;
			game_Sun.push(new sun(rng, -50, 'normal', 'gen_auto'));
		}

		spawnZombies(levelZombies);

		shovel();

		//menu button left
		ctx.drawImage(spriteImage2, 986, 907, 36, 63, 640, 0, 30, 52.5);
		//menu button center 1
		ctx.drawImage(spriteImage2, 400, 892, 48, 61, 670, 2, 40, 50.8);
		//menu button center 2
		ctx.drawImage(spriteImage2, 400, 892, 48, 61, 710, 2, 40, 50.8);
		//menu button right
		ctx.drawImage(spriteImage2, 0, 932, 48, 61, 750, 2, 40, 50.8);
		ctx.textAlign = ('center');
		ctx.font = "30px Stonecraft";
		ctx.fillStyle = "green";
		ctx.fillText('Menu', 710, 30);
		ctx.fillStyle = "black";
		ctx.strokeText('Menu', 710, 30);

		if (mouseUpPosX > 640 && mouseUpPosX < 640 + 180 && mouseUpPosY > 0 && mouseUpPosY < 0 + 63) {
			isOn = 'level_pause';
			pauseScreen();
			ctx.fillStyle = '#000000';
			ctx.fillText(world + '-' + level, 780, 480);
		}

		gameFrame = ++gameFrame;

		if (levelZombies.length === 0 && game_Zombies.length === 0) {
			endLevel(level, world);
		}
	} else if (isOn == 'level_pause') {//bug with this
		if (mouseUpPosX > 439 && mouseUpPosX < 439 + 220 && mouseUpPosY > 360 && mouseUpPosY < 360 + 63) {
			pauseScreen();
		}
		if (mouseUpPosX > 160 && mouseUpPosX < 160 + 220 && mouseUpPosY > 360 && mouseUpPosY < 360 + 63) {
			isOn = 'titleScreen';
			titleScreenMusic.play();
			pauseMode = false;
			clearMouseInput();
			drawMenu();
		}
	} else if (isOn == 'level_end') {
		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		ctx.drawImage(backgroundLayer, 0, 0, 1100, 500);

		//refer to draw logic
		game_Peas.forEach((object, index) => {
			object.update(index);
			object.draw();
		});

		game_Plants.forEach((object, index) => {
			object.draw(index);
		});

		game_Zombies.forEach((object, index) => {
			object.update(index);
			object.draw();
		});

		game_Packets.forEach((object, index) => {
			object.update(index);
			object.draw();
		});

		game_Sun.forEach((object, index) => {
			object.update(index);
			object.draw();
		});
		gameFrame = ++gameFrame;
		ctx.drawImage(seedIcons, allPackets[nextPacket].packetimgX, allPackets[nextPacket].packetimgY, allPackets[nextPacket].packetWidth, allPackets[nextPacket].packetHeight, 300, 300, 108, 69);//packet
		if (mouseUpPosX > 300 && mouseUpPosX < 300 + allPackets[nextPacket].packetWidth && mouseUpPosY > 300 && mouseUpPosY < 300 + allPackets[nextPacket].packetHeight) {
			grasswalkMusic.pause();
			winMusic.play();
		}

		//menu button left
		ctx.drawImage(spriteImage2, 986, 907, 36, 63, 640, 0, 30, 52.5);
		//menu button center 1
		ctx.drawImage(spriteImage2, 400, 892, 48, 61, 670, 2, 40, 50.8);
		//menu button center 2
		ctx.drawImage(spriteImage2, 400, 892, 48, 61, 710, 2, 40, 50.8);
		//menu button right
		ctx.drawImage(spriteImage2, 0, 932, 48, 61, 750, 2, 40, 50.8);
		ctx.textAlign = ('center');
		ctx.font = "30px Stonecraft";
		ctx.fillStyle = "green";
		ctx.fillText('Menu', 710, 30);
		ctx.fillStyle = "black";
		ctx.strokeText('Menu', 710, 30);

		if (mouseUpPosX > 640 && mouseUpPosX < 640 + 180 && mouseUpPosY > 0 && mouseUpPosY < 0 + 63) {
			isOn = 'level_pause';
			pauseScreen();
			ctx.fillStyle = '#000000';
			ctx.fillText(world + '-' + level, 780, 480);
		}

		winMusic.onended = function(){
			isOn = 'titleScreen';
			titleScreenMusic.currentTime = 0;
			titleScreenMusic.play();
			resetLevelVars();
			currentLvl = false;
			setCookie('info', username + '*' + level + '*' + world, 100);
			drawMenu();
		}
	}
	clearMouseInput();

	if (gameover === false && isOn != 'titleScreen') {//stop if u gamed over
		requestAnimationFrame(drawlevel);
	}
}

function drawMenu() {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	ctx.drawImage(menuBackground, 0, 0, menuBackground.width/1.2, menuBackground.height/1.2);
	ctx.drawImage(menuBackgroundBottom, 0, menuBackground.height/1.2 - 1, menuBackgroundBottom.width/1.2, menuBackgroundBottom.height/1.2);
	//adventure mode
	ctx.drawImage(spriteImage, 0, 0, 411, 295, 385, 11, 342.5, 245.8);
	//more ways to play
	ctx.filter = "brightness(50%)";
	ctx.drawImage(spriteImage, 819, 98, 333, 266, 397, 158, 277.5, 221.7);
	ctx.filter = "brightness(100%)";
	//sign pole
	ctx.drawImage(spriteImage2, 999, 618, 15, 203, 30, 0, 12.5, 169.2);
	//welcome back
	ctx.drawImage(spriteImage, 883, 588, 411, 94, 6, 0, 342.5, 78.3);
	//bottom left bush
	ctx.drawImage(spriteImage2, 50, 757, 206, 67, 0, 449, 171.7, 55.8);
	//gnome achivements guy
	ctx.drawImage(spriteImage2, 303, 369, 236, 303, 172, 253, 196.7, 252.5);
	//gnome achivements words
	ctx.drawImage(spriteImage, 1126, 1657, 235, 54, 175, 450, 195.8, 45);
	//help and options
	ctx.drawImage(spriteImage, 351, 984, 137, 210, 658, 306, 114.2, 175);
	//almanac
	ctx.drawImage(spriteImage3, 0, 0, 189, 197, 426, 358, 157.5, 164.2);
	//grayed out zen garden
	ctx.filter = "brightness(50%)";
	ctx.drawImage(spriteImage, 387, 1193, 174, 173, 542, 339, 145, 144.2);
	//grayed out crazy dave shop keys
	ctx.drawImage(spriteImage, 1899, 0, 135, 264, 342, 303, 112.5, 220);
	ctx.filter = 'brightness(100%)';

	ctx.textAlign = "left";
	ctx.font = '20px Stonecraft';
	ctx.fillStyle = "#ffffff";
	ctx.fillText(world + '-' + level, 521, 60);

	ctx.font = '23px BrianneTod';
	ctx.fillText(username + '!', 50, 60);

	if (isOn == 'menu_userselect') {
		drawOptionMenu(4, 'Ok', 'Cancel', 'Create', 'Delete');
		ctx.fillStyle = "#ebd971";
		ctx.font = '30px Stonecraft';
		ctx.textAlign = "center";
		ctx.fillText('WHO ARE YOU?', 400, 100);
		ctx.font = '23px BrianneTod';
		ctx.fillStyle = 'lightgreen';
		ctx.fillText(getCookie('info').split('*')[0], 400, 140);
	if (mouseUpPosX > 439 && mouseUpPosX < 439 + 220 && mouseUpPosY > 360 && mouseUpPosY < 360 + 63) {
		isOn = 'titleScreen';
	}
	if (mouseUpPosX > 160 && mouseUpPosX < 160 + 220 && mouseUpPosY > 360 && mouseUpPosY < 360 + 63) {
		userInfo = getCookie('info').split('*');
		if (userInfo[0] == 'err_no_cookie') {
			alert('Error: you are either playing this on a local file or you have cookies disabled. Please enable them to use Save Data.')
		} else {
			username = userInfo[0];
			level = Number(userInfo[1]);
			world = Number(userInfo[2]);
			console.log(userInfo);
			isOn = 'titleScreen';
		}
	}
	if (mouseUpPosX > 160 && mouseUpPosX < 160 + 220 && mouseUpPosY > 415 && mouseUpPosY < 415 + 63) {
		username = prompt('Please type in your name here:');
		setCookie('info', username + '*' + level + '*' + world, 100);
	}
	} else {
		checkTitleMenuBounds();
	}

	clearMouseInput();
	if (isOn === 'titleScreen' || isOn == 'menu_userselect') {
		requestAnimationFrame(drawMenu);
	}
}
let almanac = 'menu';
function drawAlmanac() {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	//background
	ctx.drawImage(spriteImage4, 259, 211, 72, 72, 0, 0, canvas.width, canvas.height);
	//left
	for (let i = 24; i < 475; i = i + 25) {
		ctx.drawImage(spriteImage4, 235, 215, 30, 30, 0, i, 25, 25);
	}
	//bottom
	for (let i = 25; i < 775; i = i + 25) {
		ctx.drawImage(spriteImage4, 277, 279, 30, 30, i, 475, 25, 25);
	}
	//right
	for (let i = 25; i < 475; i = i + 25) {
		ctx.drawImage(spriteImage4, 326, 233, 30, 30, 775, i, 25, 25);
	}
	//top
	for (let i = 25; i < 775; i = i + 25) {
		ctx.drawImage(spriteImage4, 283, 188, 30, 30, i, 0, 25, 25);
	}
	//top left corner
	ctx.drawImage(spriteImage4, 235, 186, 30, 30, 0, -1, 25, 25);
	//bottom left corner
	ctx.drawImage(spriteImage4, 235, 282, 30, 30, 0, 477, 25, 26);
	//bottom right corner
	ctx.drawImage(spriteImage4, 326, 279, 30, 30, 775, 475, 25, 25);
	//top right corner
	ctx.drawImage(spriteImage4, 326, 188, 30, 30, 775, 0, 25, 25);
	//backButton
	ctx.drawImage(spriteImage3, 191, 148, 166, 63, 659, 444, 138.3, 52.5);
	if (almanac == 'menu') {
		//almanac index bar
		ctx.drawImage(spriteImage, 822, 0, 944, 95, 7, 0, 786.7, 79.2);
		
		ctx.drawImage(viewPlants, 80, 150, 300, 250);
		ctx.drawImage(viewZombies, 410, 150, 300, 250);
	} else if (almanac == 'plants') {
		//plants title bar
		ctx.drawImage(spriteImage, 876, 502, 533, 85, 3, 0, 444.2, 70.8);
		//back button. is != to the close button!!
		ctx.drawImage(spriteImage3, 193, 84, 162, 62, 423, 441, 135, 51.7);
		let packetx = 0;
		let packety = scroll;
		window.addEventListener('wheel', function(e){
			scroll -= e.deltaY/20000;
			deltaY = e.deltaY/20000;
		});
		if (scroll <= -4 || scroll >= 0) {
			if (scroll <= -4) {
				scroll = -4;
			} else {
				scroll = 0;
			}
		}
		ctx.fillText(scroll, 100, 300);
		//will need to change this later
		for (var i = 0; i < 40; i = i + 1) {
			packetx = packetx + 1;
			if (i % 4 == 0) {
				packetx = 0;
				packety = packety + 1;
			}
			
			if (allPackets[i] !== undefined) {
				ctx.drawImage(seedIcons, allPackets[i].packetimgX, allPackets[i].packetimgY, allPackets[i].packetWidth, allPackets[i].packetHeight, packetx * allPackets[i].packetWidth, packety * 70, 108, 69);
			} else {
				ctx.drawImage(seedIcons, 330, 912, 107, 70, packetx * 105, packety* 70, 105, 67);
			}
		};

	} else if (almanac == 'zombies') {
		//zombies title bar
		ctx.drawImage(spriteImage, 1411, 525, 531, 86, 3, 0, 442.5, 71.7);

		//back button. is != to the close button!!
		ctx.drawImage(spriteImage3, 193, 84, 162, 62, 423, 441, 135, 51.7);
	}

	checkAlmanacBounds();

	clearMouseInput();
	if (isOn === 'almanac') {
		requestAnimationFrame(drawAlmanac);
	}
}

function chooseYourSeeds() {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	ctx.drawImage(backgroundLayer, -500, 0, backgroundLayer.width - 100, 500);
	ctx.drawImage(spriteImage, 976, 1223, 495, 58, 144, 3, 412.5, 48.3);
	if (game_Packet_choose.length == 5 || game_Packet_choose.length == unlockedPackets) {
		//normal "play" button
		ctx.drawImage(spriteImage3, 357, 86, 140, 75, 290, 420, 116.7, 62.5);
	} else {
		//darked play button
		ctx.drawImage(spriteImage3, 357, 162, 140, 71, 290, 420, 116.7, 59.2);
	}
	for (let i = 51; i < 380; i = i + 3) {
		ctx.drawImage(spriteImage5, 1155, 1957, 496, 4, 144, i, 413, 3);
	}
	ctx.drawImage(spriteImage5, 0, 1306, 495, 32, 144, 380, 412.5, 26.7);
	let packetx = 0;
	let packety = 0;

	//will need to change this later
	allPackets.forEach((object, index) => {
		packetx = packetx + 1;
		if (index % 4 == 0) {
			packetx = 0;
			packety = packety + 1;
		}
		if (game_Packet_choose.includes(object.id)) {
			ctx.filter = "brightness(50%)";
			ctx.drawImage(seedIcons, object.packetimgX, object.packetimgY, object.packetWidth, object.packetHeight, packetx * object.packetWidth + 144, packety * 70, 108, 69);
			
			ctx.filter = "brightness(100%)";
			} else {
				ctx.drawImage(seedIcons, object.packetimgX, object.packetimgY, object.packetWidth, object.packetHeight, packetx * object.packetWidth + 144, packety * 70, 108, 69);
			}
	});
	
	checkChooseSeedsBounds();
	clearMouseInput();
	if (isOn == 'choose_seeds') {
		requestAnimationFrame(chooseYourSeeds);
	}
}