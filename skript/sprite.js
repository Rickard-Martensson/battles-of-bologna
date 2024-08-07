"use strict";
const ARROW_CONSTS = {};
class Effect {
    constructor(pos, name, framerate, team, size) {
        this.pos = { x: pos.x, y: pos.y };
        this.name = name;
        this.frame = 0;
        this.framerate = framerate;
        this.dateLastFrame = Date.now();
        this.team = team;
        //
        console.log("hehe", EFFECT_DIRECTORY, EFFECT_DIRECTORY[name], EFFECT_DIRECTORY[name].drawSize.x);
        this.DRAW_SIZE = { x: EFFECT_DIRECTORY[name].drawSize.x * size, y: EFFECT_DIRECTORY[name].drawSize.y * size };
        this.imgSize = EFFECT_DIRECTORY[name].imgSize;
        this.framesPerRow = EFFECT_DIRECTORY[name].framesPerRow;
        this.totalFrames = EFFECT_DIRECTORY[name].totalFrames;
        this.totalRows = Math.ceil(this.totalFrames / this.framesPerRow);
    }
    checkDead(game, index) {
        if (this.frame >= this.totalFrames) {
            index > -1 ? game.effects.splice(index, 1) : false;
        }
    }
    draw() {
        let imageSizex = this.imgSize.x;
        let imageSizey = this.imgSize.y;
        if (Date.now() - this.dateLastFrame > this.framerate) {
            this.frame += 1;
            this.dateLastFrame = Date.now(); // - (this.dateLastFrame - 300);
            if (this.frame >= this.totalFrames) {
                // console.log(this.frame, Math.floor(this.frame / this.framesPerRow))
                return;
            }
        }
        let frame = this.frame;
        ctx.drawImage(Images[this.name], imageSizex * (frame % this.framesPerRow), imageSizey * (Math.floor(frame / this.framesPerRow) + this.team * this.totalRows), imageSizex, imageSizey, (this.pos.x - this.DRAW_SIZE.x / 2) * S, (this.pos.y - this.DRAW_SIZE.y / 2) * S, this.DRAW_SIZE.x * S, this.DRAW_SIZE.y * S);
    }
}
var projectileType;
(function (projectileType) {
    projectileType[projectileType["arrow"] = 0] = "arrow";
    projectileType[projectileType["barrel"] = 1] = "barrel";
    projectileType[projectileType["ballista"] = 2] = "ballista";
    projectileType[projectileType["cannon"] = 3] = "cannon";
    projectileType[projectileType["rocket"] = 4] = "rocket";
    projectileType[projectileType["big_rocket"] = 5] = "big_rocket";
    projectileType[projectileType["cannonball"] = 6] = "cannonball";
    projectileType[projectileType["spear"] = 7] = "spear";
})(projectileType || (projectileType = {}));
class Projectile {
    constructor(pos, vel, team, dmg, isUpdate = false, newData = false, type = "arrow") {
        this.pos = { x: pos.x, y: pos.y };
        this.vel = { vx: vel.vx, vy: vel.vy };
        this.team = team;
        this.dmg = dmg;
        this.type = type;
        if (this.type == "arrow") {
            this.ARROW_LEN = [0.6, 3, 1];
            //this.ARROW_COLORS = ['#DDDDDD', '#8B3F2B', '#FFFFFF'];
            this.ARROW_COLORS_2 = [{ r: 221, g: 221, b: 221 }, { r: 129, g: 63, b: 43 }, { r: 255, g: 255, b: 255 }];
            //this.ARROW_COLORS_3 = ['#DDDDDD', '#6F2B1F', '#8B3F2B', '#8B3F2B', '#FFFFFF'];
            this.ARROW_SIZE = .6;
        }
        if (this.type == "barrel") {
            this.isDying = false;
            this.DRAW_SIZE = 10;
            this.frame = 0;
            this.lastFrame = Date.now();
        }
        else if (this.type == "ballista") {
            this.DRAW_SIZE = 12;
            this.startPos = this.pos.x;
            this.deathFrame = 0;
            this.lastFrame = Date.now();
        }
        else if (this.type == "cannon") {
            this.DRAW_SIZE = 10;
            this.startPos = this.pos.x;
            this.vel.vx *= 2;
            game.addEffect(this.pos.x + getDirection(this.team) * 10, this.pos.y + 5, "cannon_explosion", 60, this.team, 1);
        }
        else if (this.type == "spear") {
            this.ARROW_LEN = [0.9, 7];
            //this.ARROW_COLORS = ['#DDDDDD', '#8B3F2B', '#FFFFFF'];
            this.ARROW_COLORS_2 = [{ r: 221, g: 221, b: 221 }, { r: 129, g: 63, b: 43 }];
            //this.ARROW_COLORS_3 = ['#DDDDDD', '#6F2B1F', '#8B3F2B', '#8B3F2B', '#FFFFFF'];
            this.ARROW_SIZE = .7;
        }
        else if (this.type == "rocket" || this.type == "big_rocket_projectile") {
            const TAU = Math.PI * 2;
            this.DRAW_SIZE = 10;
            if (this.type == "big_rocket_projectile") {
                this.DRAW_SIZE = 20;
            }
            this.frame = 0;
            this.angle = TAU / 4 + this.vel.vx;
            this.deathFrame = 0;
            this.lastFrame = Date.now();
        }
        this.dead = false;
        // this.colors = ['#DDDDDD', '#6F2B1F', '#8B3F2B', '#8B3F2B', '#8B3F2B', '#8B3F2B', '#FFFFFF']
        console.log("this type", this.type);
        if (isUpdate) {
            this.updateData(newData);
        }
        else {
            if (this.type == "rocket" || this.type == "big_rocket_projectile") {
                playSoundEffect("firework");
            }
            else if (this.type == "cannon") {
                playSoundEffect("cannon");
            }
            else {
                playSoundEffect("arrow");
            }
        }
    }
    updateData(newData) {
        console.log("olddata:", newData);
        for (var i in newData) {
            this[i] = newData[i];
        }
    }
    getData() {
        let data = this;
        console.log("aData:", data);
        console.log("newData:", { pos: this.pos, vel: this.vel, team: this.team, dmg: this.dmg });
        return data;
    }
    moveBal() {
        let a = 10;
        let castelHeight = 59;
        this.pos.x += this.vel.vx * fpsCoefficient / 100;
        this.pos.y += (castelHeight - this.pos.y) / 40;
    }
    moveRocket() {
        this.pos.x += this.vel.vx * fpsCoefficient / 100;
        this.pos.y += this.vel.vy * fpsCoefficient / 100;
        this.vel.vy += (-110 * Math.sin(this.angle) + GRAVITY) * fpsCoefficient / 100;
        this.vel.vx += (1 - 2 * this.team) * (5 + 45 * Math.cos(this.angle)) * fpsCoefficient / 100;
        this.angle -= 1.3 * fpsCoefficient / 100;
        // console.log(this.vel.vy, this.angle)
    }
    moveBigRocket() {
        this.pos.x += this.vel.vx * fpsCoefficient / 100;
        this.pos.y += this.vel.vy * fpsCoefficient / 100;
        this.vel.vy += (-110 * Math.sin(this.angle) + GRAVITY) * fpsCoefficient / 100;
        this.vel.vx += (1 - 2 * this.team) * (5 + 45 * Math.cos(this.angle)) * fpsCoefficient / 100;
        this.angle -= 1.3 * fpsCoefficient / 100;
    }
    move() {
        if (this.type == "ballista") {
            this.moveBal();
            return;
        }
        else if (this.type == "rocket") {
            this.moveRocket();
            return;
        }
        else if (this.type == "big_rocket_projectile") {
            this.moveBigRocket();
            return;
        }
        this.pos.x += this.vel.vx * fpsCoefficient / 100;
        this.pos.y += this.vel.vy * fpsCoefficient / 100;
        this.vel.vy += GRAVITY * fpsCoefficient / 100;
        // console.log("proj loc:", this.pos.x, this.pos.y)
        //this.predictTouchDown()
    }
    checkHitRocket() {
        if (this.pos.y > HEIGHT - 5) {
            this.dead = true; //
            playSoundEffect("explode");
            if (this.type == "big_rocket_projectile") {
                game.addEffect(this.pos.x, HEIGHT, "explosion", 60, this.team, 2);
            }
            else {
                game.addEffect(this.pos.x, HEIGHT, "explosion", 60, this.team, 1);
            }
            for (var i in game.sprites) {
                if (this.team != game.sprites[i].team) {
                    //console.log("disty:", dist(this.pos, game.sprites[i].pos), game.sprites[i].size);
                    if (dist(this.pos, game.sprites[i].pos) - game.sprites[i].size < ROCKET_SPLASH_RADIUS) {
                        // console.log("raketbombad")
                        game.sprites[i].takeDmg(this.dmg);
                    }
                }
            }
        }
    }
    checkHitCannon() {
        if (this.team == 0 && this.pos.x > 285) {
            playSoundEffect("cannon_hit");
            game.players[getOtherTeam(this.team)].takeDmg(this.dmg);
            this.dead = true;
            game.addEffect(this.pos.x, this.pos.y, "explosion", 60, this.team, 1);
        }
        else if (this.team == 1 && this.pos.x < 35) {
            playSoundEffect("ballista_hit");
            game.players[getOtherTeam(this.team)].takeDmg(this.dmg);
            this.dead = true;
            game.addEffect(this.pos.x, this.pos.y, "explosion", 60, this.team, 1);
        }
    }
    checkHitBallista() {
        if (this.deathFrame == 0) {
            if (this.team == 0 && this.pos.x > 270) {
                playSoundEffect("cannon_hit");
                game.players[getOtherTeam(this.team)].takeDmg(this.dmg);
                this.ballistaDeathAnim();
            }
            else if (this.team == 1 && this.pos.x < 50) {
                playSoundEffect("cannon_hit");
                game.players[getOtherTeam(this.team)].takeDmg(this.dmg);
                this.ballistaDeathAnim();
            }
            for (var i in game.projectiles) {
                let target = game.projectiles[i];
                if (target.type == "ballista" && this.team != target.team) {
                    //console.log("disty:", dist(this.pos, game.projectiles[i].pos), game.projectiles[i].size);
                    if (dist(this.pos, target.pos) < 5) {
                        console.log("hejhej");
                        target.ballistaDeathAnim(); // kom på nåt sätt så den inte kör hela tiden
                        // playSoundEffect("arrow_hit")
                        playSoundEffect("cannon_hit");
                        this.ballistaDeathAnim();
                    }
                }
            }
        }
    }
    ballistaDeathAnim() {
        if (Date.now() - this.lastFrame > 20) {
            this.deathFrame += 1;
            this.lastFrame = Date.now();
            if (this.deathFrame > 5) {
                this.dead = true;
            }
        }
    }
    checkHit() {
        if (this.type == "ballista") {
            this.checkHitBallista();
            return;
        }
        else if (this.type == "rocket" || this.type == "big_rocket_projectile") {
            this.checkHitRocket();
            return;
        }
        else if (this.type == "barrel") {
            this.checkHitBarrel();
            return;
        }
        else if (this.type == "cannon") {
            this.checkHitCannon();
            return;
        }
        else if (this.pos.y > HEIGHT - 5) {
            for (var i in game.sprites) {
                if (this.team != game.sprites[i].team) {
                    //console.log("disty:", dist(this.pos, game.sprites[i].pos), game.sprites[i].size);
                    if (dist(this.pos, game.sprites[i].pos) < game.sprites[i].size) {
                        console.log("hejhej");
                        game.sprites[i].takeDmg(this.dmg);
                        playSoundEffect("arrow_hit");
                        this.dead = true;
                        return;
                    }
                }
            }
        }
    }
    checkDead(index) {
        // if (this.dead || this.pos.y > HEIGHT) {
        if (this.dead) {
            index > -1 ? game.projectiles.splice(index, 1) : false;
        }
        else if ((this.type == "arrow" || this.type == "spear") && this.pos.y > HEIGHT) {
            index > -1 ? game.projectiles.splice(index, 1) : false;
        }
    }
    getVec() {
        var hyp = Math.sqrt(this.vel.vx * this.vel.vx + this.vel.vy * this.vel.vy);
        return { dx: this.vel.vx / hyp, dy: this.vel.vy / hyp };
    }
    predictTouchDown() {
        var acceleration = GRAVITY / 2;
        var t_0 = (-this.vel.vy + Math.sqrt(this.vel.vy * this.vel.vy - 4 * acceleration * (this.pos.y - 100))) / (2 * acceleration);
        console.log(this.vel.vx * t_0 + this.pos.x);
    }
    drawRocket() {
        const TAU = Math.PI * 2;
        let frame = (this.frame + 1) % 4;
        this.frame = frame;
        let angle = 0;
        let imageSize = 16;
        if (this.angle + TAU > TAU * 1.2) {
            angle = 0;
        }
        else if (this.angle + TAU > TAU * 1.10) {
            angle = 1;
        }
        else if (this.angle + TAU > TAU * 1.0) {
            angle = 2;
        }
        else if (this.angle + TAU > TAU * .95) {
            angle = 3;
        }
        else if (this.angle + TAU > TAU * .9) {
            angle = 4;
        }
        else if (this.angle + TAU > TAU * .85) {
            angle = 5;
        }
        else if (this.angle + TAU > TAU * .8) {
            angle = 5;
        }
        else if (this.angle + TAU > TAU * .7) {
            angle = 6;
        }
        else {
            angle = 6;
        }
        // else if (this.vel.vy < 0.5) {
        //     angle = 2
        // }
        ctx.drawImage(Images["rocket_projectile"], imageSize * (frame + this.team * 4), imageSize * (angle), imageSize, imageSize, (this.pos.x - this.DRAW_SIZE / 2) * S, (this.pos.y - this.DRAW_SIZE / 2) * S, this.DRAW_SIZE * S, this.DRAW_SIZE * S);
    }
    drawCannon() {
        let frame = 1;
        let imageSize = 16;
        ctx.drawImage(Images["ballista_projectile"], imageSize * frame, imageSize * 4, imageSize, imageSize, (this.pos.x - this.DRAW_SIZE / 2) * S, (this.pos.y - this.DRAW_SIZE / 2) * S, this.DRAW_SIZE * S, this.DRAW_SIZE * S);
    }
    drawBallista() {
        let castelHeight = 59;
        let frame = 1;
        let imageSize = 16;
        let isDying = 0;
        if (this.pos.y - castelHeight < 5) {
            frame = 4;
        }
        else if (this.pos.y - castelHeight < 12) {
            frame = 3;
        }
        else if (this.pos.y - castelHeight < 18) {
            frame = 2;
        }
        if (this.deathFrame != 0) {
            frame = this.deathFrame;
            console.log("wtf mannen");
            isDying = 32;
            this.ballistaDeathAnim();
        }
        ctx.drawImage(Images["ballista_projectile"], imageSize * frame, imageSize * (this.team) + isDying, imageSize, imageSize, (this.pos.x - this.DRAW_SIZE / 2) * S, (this.pos.y - this.DRAW_SIZE / 2) * S, this.DRAW_SIZE * S, this.DRAW_SIZE * S);
    }
    checkHitBarrel() {
        if (this.pos.y > HEIGHT - 3 && this.isDying == false) {
            this.isDying = true;
            this.frame = 0;
            this.vel = { vx: getDirection(this.team) * 7, vy: -15 };
            playSoundEffect("barrel_hit");
            // game.addEffect(this.pos.x, HEIGHT, "explosion", 60, this.team, 1)
            console.log("impactpoint:", this.pos.x - BASE_POS[this.team].x);
            game.addSprite("viking", this.team, 0, this.pos.x);
        }
        else if (this.isDying == true && this.frame >= 6) {
            this.dead = true;
        }
    }
    drawBarrel() {
        const TAU = Math.PI * 2;
        let frame = this.frame;
        if (Date.now() - this.lastFrame > 100) {
            this.lastFrame = Date.now();
            frame = (frame + 1) % 8;
            this.frame = frame;
        }
        let imageSize = 16;
        ctx.drawImage(Images["barrel_projectile"], imageSize * (frame), imageSize * (Number(this.isDying) * 3), imageSize, imageSize, (this.pos.x - this.DRAW_SIZE / 2) * S, (this.pos.y - this.DRAW_SIZE / 2) * S, this.DRAW_SIZE * S, this.DRAW_SIZE * S);
        if (!this.isDying) {
            ctx.drawImage(Images["barrel_projectile"], imageSize * (frame), imageSize * 1, imageSize, imageSize, (this.pos.x - this.DRAW_SIZE / 2) * S, (103 - this.DRAW_SIZE / 2) * S, this.DRAW_SIZE * S, this.DRAW_SIZE * S);
        }
    }
    draw() {
        if (this.type == "ballista") {
            this.drawBallista();
            return;
        }
        else if (this.type == "cannon") {
            this.drawCannon();
            return;
        }
        else if (this.type == "rocket" || this.type == "big_rocket_projectile") {
            this.drawRocket();
            return;
        }
        else if (this.type == "barrel") {
            this.drawBarrel();
            return;
        }
        let lastPos = { x: this.pos.x, y: this.pos.y };
        let { dx, dy } = this.getVec();
        ctx.lineWidth = this.ARROW_SIZE * S;
        if (ARROW_GRAPHICS_LEVEL != 0) {
            for (var i = 0; i < this.ARROW_LEN.length; i++) {
                ctx.beginPath();
                if (ARROW_GRAPHICS_LEVEL > 1) {
                    ctx.strokeStyle = getShadedColorCode(this.ARROW_COLORS_2[i].r, this.ARROW_COLORS_2[i].g, this.ARROW_COLORS_2[i].b);
                }
                else {
                    ctx.strokeStyle = getColorCode(this.ARROW_COLORS_2[i].r, this.ARROW_COLORS_2[i].g, this.ARROW_COLORS_2[i].b);
                }
                ;
                // ctx.strokeStyle = this.ARROW_COLORS[i]
                ctx.moveTo(lastPos.x * S, lastPos.y * S);
                let endPos = {
                    x: lastPos.x - dx * this.ARROW_LEN[i], y: lastPos.y - dy * this.ARROW_LEN[i]
                };
                ctx.lineTo(endPos.x * S, endPos.y * S);
                lastPos = { x: endPos.x, y: endPos.y };
                ctx.stroke();
            }
        }
        else {
            let totARROW_LEN = this.ARROW_LEN.reduce((a, b) => a + b, 0);
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.moveTo(lastPos.x * S, lastPos.y * S);
            let endPos = { x: lastPos.x - dx * totARROW_LEN, y: lastPos.y - dy * totARROW_LEN };
            ctx.lineTo(endPos.x * S, endPos.y * S);
            ctx.stroke();
        }
    }
}
class ProtoSprite {
    constructor(x, dir, team) {
        this.pos.x = x;
        this.direction = dir;
        this.team = team;
    }
}
class Sprite {
    constructor(x, y, name, team, isUpdate, newData) {
        //console.log(x, y, name, team, isUpdate, "newdata:", newData)
        if (isUpdate) {
            this.updateData(newData);
        }
        else {
            this.pos = { x: x, y: y };
            this.name = name;
            this.imageName = this.name;
            this.uniqeId = Math.floor(100000000 * Math.random());
            this.animations = STATS[this.name].animations;
            // this.animations = {
            //     idle: new Animation(32, 0, 8, 60, true),
            //     walk: new Animation(32, 1, 8, 20, true),
            //     attack: new Animation(32, 2, 7, 20, false),
            // };
            this.frameDelay = 20; //how many ms left until next frame
            this.currentFrame = 0;
            this.animTimeMult = 1; //makes sprint look better
            this.direction = 1;
            this.team = team;
            //jahaaaa. det låter ju svinkul. Men då kan man väll bekosta sig en tävlingsgrimma. Eller åt minstonde
            this.setStats();
            this.currentAnimation = SpriteCurAnim.idle;
            this.currentSpeed = this.speed;
            this.state = SpriteCurState.idle;
            this.isWalking = false; //helps to make atk anim better
            this.DRAW_SIZE = 24 * (this.imageSize / 32);
            // this._last0frame = Date.now();  //not important, debugging
            //attack
            this.lastAtkCycleDate = START_TIME;
            this.lastStartOfAtkCycleDate = null;
            this.lastDmgdTime = START_TIME;
            this.hasLowOpactity = null;
            this.drawInvisible = false;
            this.invincible = false;
            this.drawSpriteYOffset = 0;
            this.deathDate = -1;
            this.activeEffList = [];
            // this.activeEffects = new Set();
            for (var abilityIdx in game.players[this.team].activeAbilities) {
                var abilityName = game.players[this.team].activeAbilities[abilityIdx];
                this.activateAbility(abilityName);
            }
            this.atkFriendRow = 0;
            this.defFriendRow = 0;
            this.atkEnemyRow = 0;
            this.defEnemyRow = 0;
            if (this.abilities.includes("changeRow")) {
                this.atkFriendRow = 1;
                this.defFriendRow = 1;
                this.atkEnemyRow = 0;
                this.defEnemyRow = 0;
            }
            else if (this.siege == true) {
                this.atkFriendRow = 2;
                this.defFriendRow = 2;
                this.atkEnemyRow = 0;
                this.defEnemyRow = 0;
            }
        }
    }
    updateData(newData) {
        console.log("newData:", newData);
        for (var i in newData) {
            this[i] = newData[i];
        }
        this.animations = STATS[this.name].animations;
        // this.activeEffects = new Set();
        // for (var i in newData.activeEffects) {
        //     this.activeEffects.add(i)
        // }
    }
    getData() {
        let data = this;
        return data;
    }
    setStats() {
        if (this.name in STATS) {
            for (var stat in STATS[this.name]) {
                this[stat] = STATS[this.name][stat];
            }
            // this.abilities = new Set(UNIQE[this.name])
        }
        else {
            console.log("unknown sprite", this.name);
        }
        ;
        this.atkDelay = (IS_ONLINE) ? this.atkDelay - ATK_DELAY_REDUCED_ONLINE : this.atkDelay;
        if (this.team == 0) {
            this.direction = 1;
            this.img += "_blue";
        }
        else if (this.team == 1) {
            this.direction = -1;
        }
    }
    addActiveEffects(name) {
        if (this.activeEffList.includes(name)) {
            console.log("the sprite already has this effect");
        }
        else {
            this.activeEffList.push(name);
        }
    }
    hasActiveEffect(name) {
        return this.activeEffList.includes(name);
    }
    removeActiveEffects(name) {
        if (this.activeEffList.includes(name)) {
            this.activeEffList = this.activeEffList.filter(e => e !== name);
            // var index = this.activeEffList.indexOf(name);
            // if (index !== -1) {
            //     this.activeEffList.splice(index, 1);
            // }
        }
        else {
            console.log("could not remove effect since unit does not have it");
        }
    }
    activateAbility(name) {
        if (name == "invincible") {
            this.armor = 99;
            this.hasLowOpactity = true;
        }
        else if (name == "target") {
        }
        else if (name == "sprint") {
            this.speed += 10.1;
            this.animTimeMult /= 2;
        }
        else if (name == "rage") {
            this.atkSpeed *= 0.5;
            this.drawSpriteYOffset = 4;
            this.armor = -1;
        }
        else if (name == "shield") {
            this.currentFrame = 0;
            this.isCurSpecAnim = true;
            this.armor = 2;
            this.atkDelay = 9999;
            this.speed = 0;
        }
        else if (name == "bigFlame") {
            this.range *= 1.8;
        }
        else if (name == "electrocuted") {
            // this.atkDelay *= 3;
            this.atkSpeed *= 4;
        }
        else {
            console.log("this effect:", name, "is not known, and cannot be added");
            return;
        }
        this.addActiveEffects(name);
    }
    deactivateAbility(name) {
        if (!this.hasActiveEffect(name)) {
            console.log("the effect", name, "was asked to be removed from a", this.name, "sprite. however we only have effects", this.activeEffList, "so nothing happens. weird.");
            return;
        }
        // if (!this.activeEffects.has(name)) {
        //     console.log("the effect", name, "was asked to be removed from a", this.name, "sprite. however we only have effects", this.activeEffects, "so nothing happens. weird.")
        //     // return
        // }
        // this.activeEffects.delete(name)
        if (name == "invincible") {
            this.armor = 0;
            this.hasLowOpactity = false;
        }
        else if (name == "target") {
        }
        else if (name == "sprint") {
            this.speed = STATS[this.name].speed;
            this.animTimeMult *= 2;
        }
        else if (name == "rage") {
            this.atkSpeed *= 2;
            this.drawSpriteYOffset = 0;
            this.armor = 0;
        }
        else if (name == "shield") {
            this.isCurSpecAnim = false;
            this.armor = 0;
            this.atkDelay = STATS[this.name].atkDelay;
            this.speed = STATS[this.name].speed;
        }
        else if (name == "bigFlame") {
            this.range /= 1.8;
        }
        else if (name == "electrocuted") {
            // this.atkDelay /= 3;
            this.atkSpeed /= 4;
        }
        else {
            console.log("this effect:", name, "is not known, and cannot be removed");
            return;
        }
        this.removeActiveEffects(name);
    }
    move() {
        let firstXpos = this.pos.x;
        //======= jump magic ========\\
        if (this.jumpState == 1) {
            this.state = SpriteCurState.special;
            this.currentAnimation = SpriteCurAnim.special;
            const JUMP_HEIGHT = 20;
            const JUMP_CHARGE_TIME = 300; // milliseconds
            const JUMP_DURATION = 1.3; // adjust animation speed aswell in SpriteCurAnim.jump in globals
            var JUMP_SPEED_MULT = 3.5;
            if (this.hasActiveEffect("rage")) {
                JUMP_SPEED_MULT = 6;
            }
            let s = ((Date.now() - (this.startJumpDate + JUMP_CHARGE_TIME)) / 1000) / (JUMP_DURATION);
            this.pos.y = HEIGHT;
            if (s > 0) {
                this.pos.x += JUMP_SPEED_MULT * this.direction * this.currentSpeed * fpsCoefficient / 100;
                this.pos.y = 100 + JUMP_HEIGHT * 4 * (s - 0) * (s - 1);
                if (s > 1) {
                    this.jumpState = 0;
                    this.defEnemyRow = 0;
                    this.atkEnemyRow = 0;
                    this.pos.y = 100;
                    this.state = SpriteCurState.walk;
                    this.currentAnimation = SpriteCurAnim.walk;
                }
            }
        }
        else if (this.isCurSpecAnim) {
            this.pos.x += this.direction * this.currentSpeed * fpsCoefficient / 100;
            // this.setState("walk", -1, "mooove")
            this.state = SpriteCurState.special;
            this.currentAnimation = SpriteCurAnim.special;
        }
        else {
            this.pos.x += this.direction * this.currentSpeed * fpsCoefficient / 100;
            if (this.currentSpeed < 0) {
                console.log("movementspeed is lower than 0: ", this.currentSpeed, "and speed is:", this.speed);
            }
            // this.setState("walk", -1, "mooove")
            this.state = SpriteCurState.walk;
        }
        let secondXPos = this.pos.x;
        if (this.team == 0 && secondXPos < firstXpos) {
            console.log("this unit is moving backwards");
        }
    }
    spriteShootProjectile(shouldTargetNext = false) {
        if (this.siege == true) {
            let projectileType = "ballista";
            let x_pos = this.pos.x;
            let v_y = 0;
            console.log(this.abilities);
            if (this.abilities.includes("cannon")) {
                projectileType = "cannon";
                // y_pos += 3
            }
            game.shootProjectile({ x: x_pos, y: this.pos.y - 2 }, {
                vx: this.range * 10 * this.direction,
                vy: -65
            }, this.team, this.dmg, IS_ONLINE, projectileType);
            return;
        }
        else if (this.abilities.includes("spear")) {
            let vel = { vx: (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * 10 * this.direction, vy: (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * -10 * ARCHER_TRAJECTORY };
            // console.log("shooting spear with vel:", vel)
            game.shootProjectile({ x: this.pos.x, y: this.pos.y - 5 }, {
                vx: vel.vx,
                vy: vel.vy
            }, this.team, this.dmg, IS_ONLINE, "spear");
            return;
        }
        else if (this.abilities.includes("rocket")) {
            let vx = this.range * (Math.random() - 0.5);
            if (shouldTargetNext) {
                vx -= TAU / 6;
                vx = CLOSE_SHOOT_ANGLE;
            }
            game.shootProjectile({ x: this.pos.x + getDirection(this.team) * 3, y: this.pos.y - 6 }, {
                vx: vx,
                vy: 0
            }, this.team, this.dmg, IS_ONLINE, "rocket");
            return;
        }
        else if (this.abilities.includes("flamethrower")) {
            let scaleFactor = 1;
            let effectName = "flame";
            if (this.hasActiveEffect("bigFlame")) {
                scaleFactor = 1;
                effectName = "flamebig";
            }
            game.addEffect(this.pos.x + getDirection(this.team) * 35 * scaleFactor, this.pos.y - 6 * scaleFactor, effectName, 30, this.team, scaleFactor);
            playSoundEffect("flamethrower");
            let directionalPosx = this.pos.x * getDirection(this.team);
            for (var i in game.sprites) {
                if (this.team != game.sprites[i].team) {
                    //console.log("disty:", dist(this.pos, game.sprites[i].pos), game.sprites[i].size);
                    if (directionalPosx < game.sprites[i].pos.x * getDirection(this.team) && dist(this.pos, game.sprites[i].pos) < game.sprites[i].size + 10 * this.range) { // dist(this.pos, game.sprites[i].pos) < game.sprites[i].size + 10) {
                        console.log("uppeldad");
                        // setTimeout(function () { game.sprites[i].takeDmg(this.dmg); }, 200);
                        game.sprites[i].takeDmg(this.dmg);
                    }
                }
            }
            return;
        }
        else if (this.hasActiveEffect("target") || (shouldTargetNext && this.abilities.includes("targetCloseRange"))) {
            let nextEnemy = game.distToNextSprite(this, this.getOtherTeam(), 0, false, true);
            if (nextEnemy.len < 80 && nextEnemy.sprite != null) {
                let { vel_x, vel_y } = calcProjectilePower(this.pos, nextEnemy.sprite.pos, ARCHER_TRAJECTORY);
                game.shootProjectile({ x: this.pos.x, y: this.pos.y - 5 }, { vx: vel_x * this.direction, vy: -vel_y }, this.team, this.dmg, IS_ONLINE, "arrow");
                return;
            }
        }
        // console.log("this point should never be reached. please debug!")
        else {
            game.shootProjectile({ x: this.pos.x, y: this.pos.y - 5 }, {
                vx: (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * 10 * this.direction,
                vy: (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * -10 * ARCHER_TRAJECTORY
            }, this.team, this.dmg, IS_ONLINE, "arrow");
        }
    }
    attack(victim) {
        this.currentSpeed = 0;
        if (this.isWalking) {
            this.isWalking = false;
            this.currentAnimation = SpriteCurAnim.idle;
        }
        //this.setState("attack", -1, "attacking");
        let timeSinceLastAttackCycle = Date.now() - this.lastAtkCycleDate;
        let isRagingButAlsoRanged = (victim == undefined && this.hasActiveEffect("rage")) ? 2 : 1;
        if (timeSinceLastAttackCycle > this.atkSpeed * isRagingButAlsoRanged) { //start attack animation: ;
            this.currentFrame = 0;
            this.currentAnimation = SpriteCurAnim.attack;
            this.lastAtkCycleDate = Date.now();
            this.lastStartOfAtkCycleDate = Date.now();
            if (victim != undefined) {
                if (this.abilities.includes("meleClose")) {
                    this.currentAnimation = SpriteCurAnim.special;
                }
            }
        }
        let timeSinceStartOfAtk = Date.now() - this.lastStartOfAtkCycleDate;
        if (timeSinceStartOfAtk > this.atkDelay && this.lastStartOfAtkCycleDate !== null) { // atks if its enough time since atkstart
            if (this.range > 0) {
                // this.spriteShootProjectile(true)
                console.log(victim);
                if (victim != undefined) {
                    if (this.abilities.includes("meleClose")) {
                        playSoundEffect("sword");
                        this.currentAnimation = SpriteCurAnim.special;
                        victim.takeDmg(this.meleDmg);
                        playSoundEffect("damage");
                    }
                    else if (this.abilities.includes("targetCloseRange")) {
                        this.spriteShootProjectile(true);
                    }
                    else {
                        this.spriteShootProjectile(false);
                    }
                }
                else {
                    this.spriteShootProjectile(false);
                }
            }
            else {
                playSoundEffect("sword");
                victim.takeDmg(this.dmg);
                playSoundEffect("damage");
                if (this.abilities.includes("whirlwind")) {
                    let behindSprite = game.distToNextSprite(this, this.getOtherTeam(), 0, true, false);
                    const BEHIND_EXTRA_RANGE = 5;
                    // console.log("hehe wirlld", behindSprite.len, this.meleRange, BEHIND_EXTRA_RANGE)
                    if (behindSprite.sprite != null && behindSprite.len < this.meleRange + BEHIND_EXTRA_RANGE) {
                        behindSprite.sprite.takeDmg(this.dmg);
                    }
                    // (nextEnemy.len + MELE_RANGE_BUFFER < this.meleRange)
                }
                else if (this.abilities.includes("thor")) {
                    if (!victim.hasActiveEffect("electrocuted")) {
                        game.addEffect(victim.pos.x + getDirection(this.team) * 8, 82, "lightning_blue", 35, 0, 1);
                        victim.activateAbility("electrocuted");
                        let secondVictim = game.distToNextSprite(victim, victim.team, 0, true, true);
                        if (secondVictim.len < 10 && secondVictim.sprite != null) {
                            secondVictim.sprite.activateAbility("electrocuted");
                            secondVictim.sprite.takeDmg(this.dmg);
                        }
                        playSoundEffect("thunder");
                    }
                }
            }
            this.lastStartOfAtkCycleDate = null; //efter denhär så står spriten bara still o vibear
        }
    }
    takeDmg(dmg, haveBouncedPubNub = false) {
        let dmgTaken = dmg;
        if (typeof this.armor !== 'undefined') {
            dmgTaken = Math.max(dmg - this.armor, 0);
            console.log("dmgtaken", dmgTaken, "dmg, this.armor", dmg, this.armor, "recalc", Math.max(dmg - this.armor, 0));
        }
        if (IS_ONLINE && !haveBouncedPubNub) {
            game.damageSprite(this, dmgTaken);
        }
        else {
            this.hp -= dmgTaken;
            this.invincible = false;
            this.lastDmgdTime = Date.now();
        }
    }
    // checks if a unit is dead
    checkDead(game, index) {
        // checks if a unit is dead. 
        if (this.hp <= 0) {
            if (this.deathDate == -1) {
                this.deathDate = Date.now();
            }
        }
        if (this.deathDate != -1 && Date.now() - this.deathDate > DEATH_DELAY) {
            index > -1 ? game.sprites.splice(index, 1) : false; //magic code that kicks sprite from sprite-array
        }
    }
    distFromOwnCastle() {
        let myTeam = this.team;
        let basePos = BASE_POS[myTeam].x;
        let dist = Math.abs(this.pos.x - basePos);
        return dist;
    }
    checkIfAtEnemyCastle(game) {
        let enemyPlayer = this.getOtherTeam();
        let enemyBasePos = BASE_POS[enemyPlayer].x;
        let factor = (2 * this.team - 1); //-1 if team:0, 1 if team:1.
        if (this.pos.x * factor < enemyBasePos * factor) { // -100 < -40 //prolog inte imperativt
            if ((Number(mySide == 0) ^ IS_ONLINE) != 1) {
                game.players[enemyPlayer].attackCastle(this.hp);
                //game.players[this.team].onlineChangeGold(0, 1, true)
            }
            this.deathDate = 100000; // betyder att den tas bort direkt!
            this.hp = 0;
            //remove gold, add gold
        }
    }
    getOtherTeam() {
        if (this.team == 0) {
            return 1;
        }
        else if (this.team == 1) {
            return 0;
        }
        return 2;
    }
    setState(newState, speed, txt) {
        //if (this.name == "archer") { console.log(newState, txt) }
        if (speed == 0 && newState == "walk") {
            newState = "idle";
        }
        if (newState == "walk") {
            if (this.range != 0 && this.siege == true && this.distFromOwnCastle() > BALLISTA_SIEGE_RANGE) {
                // if (this.state)
                // ändra row här
                this.attack(undefined);
                this.state = SpriteCurState.attack;
                // this.setState("attack", -1);
            }
            // else if (this.range != 0) {
            //     pass
            // }
            else {
                this.isWalking = true;
                this.lastStartOfAtkCycleDate = null;
                this.lastAtkCycleDate = START_TIME;
                this.currentSpeed = this.speed;
                this.state = SpriteCurState.walk;
                this.currentAnimation = SpriteCurAnim.walk;
            }
        }
        else if (newState == "idle") {
            if (this.range != 0) {
                this.attack(undefined);
                this.setState("attack", -1, "ping");
            }
            else {
                this.currentSpeed = 0;
                this.state = SpriteCurState.idle;
                this.currentAnimation = SpriteCurAnim.idle;
            }
        }
        else if (newState == "attack") {
            this.state = SpriteCurState.attack;
        }
        else {
            console.log("bad state input");
        }
        if (speed != -1) {
            this.currentSpeed = speed;
        }
        // if(this.name == "archer") {
        //     console.log("newstate:", newState, "from:", txt, "final state:", this.state)
        // }
    }
    jumpOverUnits() {
        console.log("unit have been orderd to jump!");
        this.jumpState = 1;
        this.currentFrame = 0;
        this.frameDelay = 0;
        this.atkEnemyRow = 2;
        this.defEnemyRow = 2;
        this.startJumpDate = Date.now();
    }
    // rows
    // row 0 - den raden alla är i vanligtvis.
    // row 1 - units som springer förbi andra. alltså knights till exempel
    // row -1 - här är det inga som attackerar varandra förhoppningsvis
    // row 2 - här flyger man kanske.
    inRangeDist(otherSprite) {
        if (otherSprite == null) {
            return Infinity;
        }
        return this.meleRange + otherSprite.size + PERSONAL_SPACE;
    }
    canMove(game) {
        let nextFriendSameRow = game.distToNextSprite(this, this.team, this.atkFriendRow);
        let nextEnemySameRow = game.distToNextSprite(this, this.getOtherTeam(), this.atkEnemyRow);
        if (this.name == "knight") {
            console.log(this.atkEnemyRow, this.atkFriendRow, this.defEnemyRow);
        }
        if (nextFriendSameRow.len < nextEnemySameRow.len) { // next unit is a friend, including size in calc.
            // ifall den står bakom en friendly
            if ((nextFriendSameRow.len < this.meleRange)) {
                //eventuellt gör en attack här ifall spriten är ranged. Ja det kommer här:
                if (nextFriendSameRow.len < this.meleRange - 0.1) {
                    this.setState("idle", -1, "idlar");
                }
                else {
                    this.setState("walk", Math.min(nextFriendSameRow.sprite.currentSpeed, this.speed), "stalk");
                }
            }
            else {
                //this.currentSpeed = this.speed
                if (!(this.range != 0 && this.abilities.includes("ballista") && this.distFromOwnCastle() > BALLISTA_SIEGE_RANGE && this.state == SpriteCurState.attack)) {
                    this.setState("walk", -1, "catching up i guess");
                }
                // this.setState("walk", -1, "catching up")
            }
        }
        else { // närmsta unit är en enemy
            if ((nextEnemySameRow.len < this.meleRange)) {
                if (this.abilities.includes("jump") && this.hasJumped != 1 && this.defEnemyRow == 0) {
                    this.hasJumped = 1;
                    console.log("this unit should jump now");
                    this.jumpOverUnits();
                }
                else if (nextEnemySameRow.sprite.defEnemyRow == this.atkEnemyRow) {
                    this.setState("attack", -1, "movetopos mele");
                    this.attack(nextEnemySameRow.sprite);
                }
                if (this.abilities.includes("changeRow")) { // ability that makes you change into correct row when you encounter an enemy
                    this.atkFriendRow = 0;
                    this.defFriendRow = 0;
                    this.atkEnemyRow = 0;
                    this.defEnemyRow = 0;
                }
            }
            else {
                if (!(this.range != 0 && this.siege == true && this.distFromOwnCastle() > BALLISTA_SIEGE_RANGE && this.state == SpriteCurState.attack)) {
                    this.setState("walk", -1, "movetopos ranged");
                }
            }
        }
    }
    getFrame() {
        var currAnim = this.animations[this.currentAnimation];
        this.frameDelay -= fpsCoefficient; //
        if (this.frameDelay <= 0) {
            this.currentFrame += 1;
            // if (WALK_UNIT == this.uniqeId) {
            //     WALK_FRAME_COUNT += 1;
            //     let delta_time = Date.now() - WALK_START_DATE;
            //     console.log("id is", WALK_UNIT, "frames per second (should be 109):", (2 * 60000 / 8) * WALK_FRAME_COUNT / delta_time, "frames and dt:", WALK_FRAME_COUNT, delta_time)
            // }
            if (this.currentFrame > currAnim.getFrameCount() - 1) {
                // console.log("tid per frame:", (Date.now() - this._last0frame) / currAnim.getFrameCount());
                this.currentFrame = 0;
                if (!currAnim.getIfLoop()) {
                    this.currentAnimation = SpriteCurAnim.idle;
                }
                // this._last0frame = Date.now()
            }
            this.frameDelay = this.animations[this.currentAnimation].getFrameRate() + Math.max(-20, this.frameDelay);
            if (this.isWalking) {
                this.frameDelay *= this.animTimeMult;
            }
        }
        else {
            //this.frameDelay--;
        }
        return this.currentFrame;
    }
    /**
     * Draws sprite onto canvas
     */
    draw() {
        let shouldDrawWhiter = this.hasActiveEffect("electrocuted") && Math.floor(Date.now() / 200) % 2 === 0;
        let fiddledWithAlpha = false;
        let frame = Math.min(this.getFrame(), this.animations[this.currentAnimation].getFrameCount() - 1);
        let animation = this.animations[this.currentAnimation].getRow();
        if (this.hasLowOpactity == true || Date.now() - this.lastDmgdTime < INVINCIBLE_DELAY) {
            ctx.globalAlpha = 0.6;
            fiddledWithAlpha = true;
        }
        ctx.drawImage(Images[this.img], this.imageSize * frame, this.imageSize * (animation + this.drawSpriteYOffset), this.imageSize, this.imageSize, (this.pos.x - this.DRAW_SIZE / 2) * S, (this.pos.y + ROW_OFFSET * this.atkFriendRow - this.DRAW_SIZE / 2) * S, // gör så att knight blir lite snyggare
        this.DRAW_SIZE * S, this.DRAW_SIZE * S);
        if (shouldDrawWhiter) {
            // Save the current state of the canvas
            ctx.save();
            // Change the blending mode to 'lighter' and draw the sprite again
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha *= 0.25;
            ctx.drawImage(Images[this.img], this.imageSize * frame, this.imageSize * (animation + this.drawSpriteYOffset), this.imageSize, this.imageSize, (this.pos.x - this.DRAW_SIZE / 2) * S, (this.pos.y + ROW_OFFSET * this.atkFriendRow - this.DRAW_SIZE / 2) * S, this.DRAW_SIZE * S, this.DRAW_SIZE * S);
            ctx.globalAlpha *= 4;
            // Restore the canvas state to default
            ctx.restore();
        }
        if (fiddledWithAlpha) {
            ctx.globalAlpha = 1;
        }
    }
}
// let WALK_START_DATE = -1;
// let WALK_FRAME_COUNT = 0;
// let WALK_UNIT: number;
