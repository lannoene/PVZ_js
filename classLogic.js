class zombie {
	constructor(type, row) {
		switch (type) {
			case 1:
				this.x = 780;
				this.y = row * 80 + 20;
				this.type = 'Normal';
				this.image = zombie_normal;
				this.width = 125;
				this.height = 125;
				this.id = countZombies;
				this.health = 100;
				this.row = row;
				this.eatDelay = 50;
				this.eatProgress = this.eatDelay;
				this.animPos = 0;
				this.frameY = 2;
				this.animState = 'Normal_walk';
				this.animDelay = 3;
				this.slowTime = 0;
			break;
			case 2:
				this.x = 780;
				this.y = row * 80 + 20;
				this.type = 'ConeHead';
				this.image = zombie_normal;
				this.width = 125;
				this.height = 125;
				this.id = countZombies;
				this.health = 230;
				this.row = row;
				this.eatDelay = 50;
				this.eatProgress = this.eatDelay;
				this.animPos = 0;
				this.frameY = 3;
				this.animState = 'ConeHead_walk';
				this.animDelay = 7;
				this.slowTime = 0;
			break;
		}
	}
	update(zombieIndex) {
		if (this.x < 140) {
			gameOver();
		}
		game_Peas.forEach((object, index) => {
			if (Math.floor(this.x) > object.x - 60 && Math.floor(this.x) < object.x - 10 && this.row == object.row) {
				game_Peas.splice(index, 1);
				this.health = this.health - 10;
				console.log(this.health);
				if (object.type == 'SnowPea') {
					this.slowTime = 500;
					if (this.slowTime <= 0) {
						freezeZombie.play();
					}
				}

				if (this.type === 'Normal') {
					peaHit.currentTime = 0;
					peaHit.play();
				} else if (this.type === 'ConeHead') {
					zombieConeHeadHit.currentTime = 0;
					zombieConeHeadHit.play();
				}
			}
		});
		let eatingplant = null;
		game_Plants.forEach((object, index) => {
			if (Math.floor(this.x) > object.x - 60 && Math.floor(this.x) < object.x + 10 && this.row == object.row) {
				eatingplant = object;
			}
		});
		if (this.health <= 0) {
			game_Zombies.splice(zombieIndex, 1);
			peaKill.currentTime = 0;
			peaKill.play();
		}
		if (eatingplant === null && this.slowTime === 0) {
			this.x = Math.floor((this.x - 0.2)*10)/10;//round to nearest tenth place
		} else if (eatingplant !== null) {
				if (this.eatProgress <= 0) {
					eatingplant.health = eatingplant.health - 50;
					console.log(eatingplant.health);
					this.eatProgress = this.eatDelay;
					if (eatingplant.health > 0) {
						zombieChomp.currentTime = 0;
						zombieChomp.play();
					} else {
						zombieGulp.play();
					}
				if (this.slowTime > 0) {
					this.slowTime = this.slowTime - 1;
				}
			} else {
				this.eatProgress = this.eatProgress - 1;
			} 
		}  else if (this.slowTime > 0) {
			this.x = Math.floor((this.x - 0.1)*10)/10;//round to nearest tenth place
			this.slowTime = this.slowTime - 1;
		}
	}
	draw() {
		if (this.animPos >= spriteAnimations[this.animState].loc.length) {
			this.animPos = 0;
		}
		let position = this.animPos;
		let frameX = spriteWidth * position;
		if (this.type === 'Normal') {
		}
		switch (this.type) {
			case 'Normal':
				ctx.drawImage(playerImage, frameX, this.frameY * spriteHeight, spriteWidth, spriteHeight, this.x - 10, this.y, this.width, this.height)
			break;
			case 'ConeHead':
				ctx.drawImage(playerImage, frameX, this.frameY * spriteHeight, spriteWidth, spriteHeight, this.x + 10, this.y, this.width, this.height);
			default:
				//ctx.drawImage(playerImage, frameX, this.frameY * spriteHeight, spriteWidth, spriteHeight, this.x, this.y, this.width, this.height);
			break;
		}
		if (gameFrame % this.animDelay === 1) {
			this.animPos = this.animPos + 1;
		}
	}
}

class plant {//PLANNNNT
	constructor(type, row, column, id) {
		switch (id) {
			case 0:
				this.x = column * 64 + 200;//right. starts at col 0
				this.y = row * 80 + 80;//down. starts at row 0
				this.type = 'PeaShooter';
				this.image = peashooter_plant;
				this.width = 50;
				this.height = 50;
				this.id = 0;
				this.health = 200;
				this.row = row;
				this.column = column;
				this.fire_rate = 100;
				this.time = 0;
				this.frameY = 1;
				this.animPos = 0;
				this.animDelay = 2;
			break;
			case  1:
				this.x = column * 64 + 200;
				this.y = row * 80 + 80;
				this.type = 'Sunflower';
				this.image = sunflower;
				this.width = 60;
				this.height = 60;
				this.id = 1;
				this.health = 200;
				this.row = row;
				this.column = column;
				this.gen_rate = 800;
				this.time = 0;
				this.frameY = 0;
				this.animPos = 0;
				this.animDelay = 2;
			break;
			case  2:
				this.x = column * 64 + 200;
				this.y = row * 80 + 80;
				this.type = 'Wallnut';
				this.image = wallnut;
				this.width = 50;
				this.height = 60;
				this.id = 2;
				this.health = 1500;
				this.row = row;
				this.column = column;
				this.time = 0;
			break;
			case  3:
				this.x = column * 64 + 200;
				this.y = row * 80 + 80;
				this.type = 'PotatoMine';
				this.image = potatoMineUnrmdGry;
				this.width = 60;
				this.height = 60;
				this.id = 3;
				this.health = 200;
				this.row = row;
				this.column = column;
				this.time = 0;
				this.armTime = 1300;
			break;
			case 4:
				this.x = column * 64 + 200;
				this.y = row * 80 + 80;
				this.type = 'CherryBomb';
				this.image = cherryBomb;
				this.width = 80;
				this.height = 60;
				this.id = 4;
				this.health = 200;
				this.row = row;
				this.column = column;
				this.time = 0;
				this.armTime = 50;
			break;
			case 5:
				this.x = column * 64 + 200;//right. starts at col 0
				this.y = row * 80 + 80;//down. starts at row 0
				this.type = 'SnowPea';
				this.image = peashooter_plant;
				this.width = 50;
				this.height = 50;
				this.id = 5;
				this.health = 200;
				this.row = row;
				this.column = column;
				this.fire_rate = 100;
				this.time = 0;
				this.frameY = 4;
				this.animPos = 0;
				this.animDelay = 5;
			break;
		}
	}
	update(index) {
		if (this.health <= 0) {
			if (this.id === 1) {
				sunflowers = --sunflowers;
			}
			game_Plants.splice(index, 1);
		}
		this.time = this.time + 1;
		switch (this.id) {
			case 0://peashooter
				game_Zombies.forEach((object, index) => {
					if (object.row == this.row && this.time >= this.fire_rate && object.x + 30 > this.x) {
						game_Peas.push(new projectile('pea', this.row, this.column));
						peaShoot.currentTime = 0;
						peaShoot.play();
						console.log('spawned new pea');
						this.time = 0;
					}
				});
				if (this.time >= this.fire_rate) {
					this.time = 0;
				}
			break;
			case 1://sunflower
			this.gen_rate = Math.sqrt(sunflowers/2) * 600;//update this. find out how to count sunflowers
			console.log(this.gen_rate);
				if (this.time >= this.gen_rate) {
					game_Sun.push(new sun(this.x, this.y, 'normal', 'gen_flower'));
					this.time = 0;
				}
			break;
			case 2://wallnut
			break;
			case 3://potato mine
				if (this.time >= this.armTime && this.time % 100 === 1) {
					if (this.image == potatoMineGray) {
						this.image = potatoMineRed;
					} else {
						this.image = potatoMineGray;
					}
				} else if (this.time < this.armTime && this.time % 100 === 1 && this.time !== 1) {
					if (this.image == potatoMineUnrmdGry) {
						this.image = potatoMineUnrmdRed;
					} else {
						this.image = potatoMineUnrmdGry;
					}
				}
				if (this.time === this.armTime) {
					potatoMineArm.play();
				}
				if (this.time >= this.armTime) {
					game_Zombies.forEach((object, itemindex) => {//1: how much to the right it goes 2: how far to the left it goes
						if (Math.floor(this.x) > object.x - 10 && Math.floor(this.x) < object.x + 30 && this.row == object.row) {//fix this hitbox pls
							game_Zombies.forEach((object, index) => {
								if (Math.floor(this.x) > object.x - 30 && Math.floor(this.x) < object.x + 30 && this.row == object.row) {
									object.health = object.health - 500;
								}
							});
							potatoMineExp.play();
							game_Plants.splice(index, 1);
						}
					});
				}
			break;
			case 4://cherry bomb
				if (this.time >= this.armTime) {
					game_Zombies.forEach((object, index) => {
						if (Math.floor(this.x) > object.x - 90 && Math.floor(this.x) < object.x + 120 && this.row == object.row || Math.floor(this.x) > object.x - 90 && Math.floor(this.x) < object.x + 120 && this.row == object.row - 1 || Math.floor(this.x) > object.x - 90 && Math.floor(this.x) < object.x + 120 && this.row == object.row + 1) {
							object.health = object.health - 500;
						}
					});
					potatoMineExp.play();
					game_Plants.splice(index, 1);
				}
			break;
			case 5://snow PeaShooter
				game_Zombies.forEach((object, index) => {
					if (object.row == this.row && this.time >= this.fire_rate && object.x + 30 > this.x) {
						game_Peas.push(new projectile('SnowPea', this.row, this.column));
						peaShoot.currentTime = 0;
						peaShoot.play();
						console.log('spawned new snow pea');
						this.time = 0;
					}
				});
				if (this.time >= this.fire_rate) {
					this.time = 0;
				}
			break;
		}

	}
	draw() {
		if (this.id == 0|| this.id == 1 || this.id == 5) {
			if (this.animPos >= spriteAnimations[this.type].loc.length) {
				this.animPos = 0;
			}
			let position = this.animPos;
			let frameX = spriteWidth * position;
			ctx.drawImage(playerImage, frameX, this.frameY * spriteHeight, spriteWidth, spriteHeight, this.x - 10, this.y, 70, 70);
			if (gameFrame % this.animDelay === 0) {
				this.animPos = this.animPos + 1;
			}
		} else {
			ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		}
	}
}

class projectile {
	constructor(type, row, column) {
		switch (type) {
			case 'pea':
				this.x = column * 64 + 200;
				this.y = row * 80 + 95;
				this.type = type;
				this.image = peashooter_pea;
				this.width = 30;
				this.height = 30;
				this.id = countPeas;
				this.row = row;
			break;
			case 'SnowPea':
				this.x = column * 64 + 200;
				this.y = row * 80 + 95;
				this.type = type;
				this.image = snowPeaProjec;
				this.width = 18;
				this.height = 18;
				this.id = countPeas;
				this.row = row;
			break;
		}
	}
	update(index) {
		this.x = this.x + 5;
		if (this.x > 850) {
			game_Peas.splice(index, 1);
			console.log('projectile auto removed');
		}
	}
	draw() {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

class packet {//PACKETTTT
	constructor(id, row, index) {
		switch (id) {
			case 0:
				this.x = 70;
				this.y = row * 78 + 80;
				this.plantwidth = 50;
				this.plantheight = 50;
				this.cost = 100;
				this.recharge = 0;//0 = no charge
				this.rechargeTime = 300;
				this.marker = null;
				this.id = 0;
				this.type = 'PeaShooter';
				this.packetId = id;
				this.packetWidth = 108;//our sprite sheet vars
				this.packetHeight = 69;
				this.packetimgX = 0;
				this.packetimgY = 0;
				this.isDark = false;
				this.description = 'How can a single plant grow and shoot so many peas so quickly? PeaShooter says, "Hard work, commitment, and a healthy, well-balanced breakfast of sunlight and high-fiber carbon dioxide make it all possible."';
				this.index = index;
			break;
			case 1:
				this.x = 70;
				this.y = row * 78 + 80;
				this.plantwidth = 60;
				this.plantheight = 60;
				this.cost = 50;
				this.recharge = 300;
				this.rechargeTime = 300;
				this.maker = null;
				this.id = 1;
				this.type = 'Sunflower';
				this.packetId = id;
				this.packetWidth = 108;
				this.packetHeight = 69;
				this.packetimgX = 108;
				this.packetimgY = 0;
				this.isDark = false;
				this.description = `Sunflower can't resist bouncing to the beat. Which beat is that? Why, the life-giving jazzy rhythm of the Earth itself, thumping at a frequency only Sunflower can hear.`;
				this.index = index;
			break;
			case 2:
				this.x = 70;
				this.y = row * 78 + 80;
				this.plantwidth = 40;
				this.plantheight = 50;
				this.cost = 50;
				this.recharge = 0;
				this.rechargeTime = 1500;
				this.marker = null;
				this.id = 2;
				this.type = 'Wallnut';
				this.packetId = id;
				this.packetWidth = 108;
				this.packetHeight = 69;
				this.packetimgX = 324;
				this.packetimgY = 0;
				this.isDark = false;
				this.description = `"People wonder how I feel about getting constantly chewed on by zombies," says Wall-nut. "What they don't realize is that with my limited senses all I can feel is a kind of tingling, like a relaxing back rub."`
				this.index = index;
			break;
			case 3:
				this.x = 70;
				this.y = row * 78 + 80;
				this.plantwidth = 60;
				this.plantheight = 60;
				this.cost = 25;
				this.recharge = 0;
				this.rechargeTime = 1500;
				this.marker = null;
				this.id = 3;
				this.type = 'PotatoMine';
				this.packetId = id;
				this.packetWidth = 108;
				this.packetHeight = 69;
				this.packetimgX = 0;
				this.packetimgY = 69;
				this.isDark = false;
				this.description = `Some folks say Potato Mine is lazy, that he leaves everything to the last minute. Potato Mine says nothing. He's too buys thinking about his investment strategy.`
				this.index = index;
			break;
			case 4:
				this.x = 70;
				this.y = row * 78 + 80;
				this.plantwidth = 60;
				this.plantheight = 60;
				this.cost = 150;
				this.recharge = 0;
				this.rechargeTime = 1500;
				this.marker = null;
				this.id = 4;
				this.type = 'CherryBomb';
				this.packetId = id;
				this.packetWidth = 109;
				this.packetHeight = 68;
				this.packetimgX = 216;
				this.packetimgY = 0;
				this.isDark = false;
				this.description = `"I wanna explode," says Cherry #1. "No, let's detonate instead!" says his brother, Cherry #2. After intense consultation they agree to explodonate.`
				this.index = index;
			break;
			case 5:
				this.x = 70;
				this.y = row * 78 + 80;
				this.plantwidth = 50;
				this.plantheight = 50;
				this.cost = 175;
				this.recharge = 0;//0 = no charge
				this.rechargeTime = 300;
				this.marker = null;
				this.id = 5;
				this.type = 'SnowPea';
				this.packetId = id;
				this.packetWidth = 107;//our sprite sheet vars
				this.packetHeight = 68;
				this.packetimgX = 110;
				this.packetimgY = 70;
				this.isDark = false;
				this.bottomBrightness;
				this.description = `Folks often tell Snow Pea how "cool" he is, or exhort him to "stay frosty." Snow Pea just rolls his eyes. He's heard 'em all.`;
				this.index = index;
			break;
			default:
			break;
		}
	}
	update(index) {
		// make it dark if the cost is too much
		if (tempMousePosX > this.x && tempMousePosX < this.x + seedpacket.width && tempMousePosY > this.y && tempMousePosY < this.y + seedpacket.height) {
			isplantSelected = !isplantSelected;
			plantIdPub = this.id;
			console.log(plantIdPub);
		}
		this.isDark = 100;
		this.bottomBrightness = 100;
		if (sun_count < this.cost) {
			this.isDark = this.isDark - 33;
		}
		if (sun_count < this.cost) {
			this.bottomBrightness = 66;
		}
		if (this.recharge != this.rechargeTime) {
			this.isDark = this.isDark - 33;
		}

		if (this.recharge < this.rechargeTime) {
			this.recharge = this.recharge + 1;
		}

		if (isplantSelected === true && this.id === plantIdPub) {
			this.marker = selection;
		} else {
			this.marker = null;
		}
		if (isplantSelected === true) {
			if (packetSoundTimes === 0) {
				packetPick.play();
				packetSoundTimes = 1;
			}
		} else {
			packetSoundTimes = 0;
		}
	}
	draw() {
		let rechargePercent = Math.ceil((this.rechargeTime - this.recharge)/this.rechargeTime * this.packetHeight); //percent charge (out of the packet's height).

		ctx.filter = "brightness(" + this.bottomBrightness +"%)";
		ctx.drawImage(seedIcons, this.packetimgX, rechargePercent + this.packetimgY, this.packetWidth, this.packetHeight - rechargePercent, this.x, this.y + rechargePercent, 108, this.packetHeight - rechargePercent);//packet white

		if (this.isDark !== false) {
			ctx.filter = "brightness(" + this.isDark + "%)";
			ctx.drawImage(seedIcons, this.packetimgX, this.packetimgY, this.packetWidth, rechargePercent, this.x, this.y, 108, rechargePercent);//gray
		}
		ctx.filter = "brightness(" + this.bottomBrightness +"%)";
		ctx.drawImage(seedIcons, 456, 39, 49, 31, this.x + this.packetWidth - 49, this.y + this.packetHeight - 31, 40.8, 25.8);//p. cost
		ctx.filter = "brightness(100%)";
		
		ctx.font = "20px Arial";
		ctx.fillStyle = "#000000";
		ctx.textAlign = 'right';
		ctx.fillText(this.cost, this.x + this.packetWidth - 10, this.y + 60);

		if (this.marker !== null) {//marker
			ctx.drawImage(this.marker, this.x - 2, this.y - 2, this.packetWidth + 2, this.packetHeight + 2);
		}
		//ctx.fillText(Math.ceil((this.rechargeTime - this.recharge)/10/this.rechargeTime * 1000), this.x, this.y + 60);
	}
}

class sun {
	constructor(x, y, size, type) {
		switch (size) {
			case 'normal':
				this.x = x;
				this.y = y;
				this.image = sun_img;
				this.width = 50;
				this.height = 50;
				this.maxTime = 500;
				this.createTime = gameFrame;
				this.type = type;
				this.rotate = 0;
			break;
			case 'small':
				//todo in night levels
				this.image = sun_img;
			break;
		}
	}
	update(index) {
		if (this.y < 300 && this.type === 'gen_auto') {
			this.y = Math.floor(this.y + 1);
		}
		if (tempMousePosX > this.x && tempMousePosX < this.x + 50 && tempMousePosY > this.y && tempMousePosY < this.y + 50) {
			console.log('sun clicked');
			sun_count = sun_count + 25;
			game_Sun.splice(index, 1);
			sunPick.currentTime = 0;
			sunPick.play();
		}
		if ((this.maxTime + this.createTime) - gameFrame <= 0) {
			game_Sun.splice(index, 1);
			console.log('sun removed');
		}
	}
	draw() {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}