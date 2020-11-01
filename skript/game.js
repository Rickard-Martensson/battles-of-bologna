const bild = document.getElementById('');

class Animation {
    constructor(size, row, frames, frameRate, isALoop) {
        this.size = size;
        this.row = row;
        this.frames = frames;
        this.frameRate = frameRate;
        this.isALoop = isALoop;
    }

    getFrameCount() {
        return this.frames;
    }

    getFrameRate() {
        return this.frameRate;
    }

    getRow() {
        return this.row;
    }

    getIfLoop() {
        return this.isALoop;
    }
}

class Sprite {
    constructor(x, y, name, animations, team) {
        this.pos = { x: x, y: y };
        this.name = name
        this.imageName = this.name;
        this.animations = {
            idle: new Animation(32, 0, 8, 60, true),
            walk: new Animation(32, 1, 8, 20, true),
            attack: new Animation(32, 2, 7, 20, false),
        };
        this.frameDelay = 20;    //how many ms left until next frame
        this.currentFrame = 0;

        this.direction = 1
        this.team = team;

        if (this.name in STATS) {
            this.hp = STATS[this.name].hp;
            this.atkSpeed = STATS[this.name].atkSpeed;
            this.atkDelay = STATS[this.name].atkDelay;
            this.dmg = STATS[this.name].dmg;
            this.meleRange = STATS[this.name].meleRange;
            this.range = STATS[this.name].range;
            this.speed = STATS[this.name].speed;
            this.img = STATS[this.name].img;
            this.imageSize = STATS[this.name].imageSize;
            this.size = STATS[this.name].size;
            this.cost = STATS[this.name].cost;
            this.row = STATS[this.name].row;

            this.abilities = new Set(UNIQE[this.name]);
        }
        else { console.log("unknown sprite") };
        if (this.team == 0) {
            this.direction = 1;
            this.img += "_blue"
        }
        else if (this.team == 1) {
            this.direction = -1
        }

        this.currentAnimation = "walk";
        this.currentSpeed = this.speed
        this.isMoving = true

        this.DRAW_SIZE = 24;
        this.FRAME_RATE = 20;
        this._last0frame = Date.now();  //not important

        this.lastAtkTime = START_TIME
        this.delayAtkTime = null;

        this.lastDmgdTime = START_TIME
        this.invincible = false;
    }

    move() {
        this.pos.x += this.direction * this.currentSpeed * fpsCoefficient / 100;
    }

    attack(victim) {
        this.currentSpeed = 0;
        this.isMoving = false

        if (Date.now() - this.lastAtkTime > this.atkSpeed) {
            if (this.delayAtkTime === null) {
                this.currentAnimation = "attack"
                this.delayAtkTime = Date.now();
                this.currentFrame = 0
            }
            else if (Date.now() - this.delayAtkTime > this.atkDelay) {
                this.lastAtkTime = Date.now();
                this.delayAtkTime = null;
                if (this.range > 0) {
                    game.shootProjectile(this.pos.x, this.pos.y, 30 * this.direction, -40, this.team, this.dmg)
                }
                else { victim.takeDmg(this.dmg) }

            }
        }
        else {
            //this.currentAnimation = "idle"
        }
    }

    isIdle(bool) {
        if (bool) {
            if (this.range > 0) {
                this.attack(self)
                this.currentSpeed = 0;
                this.isMoving = false
            }
            else {
                this.currentAnimation = "idle"
                this.currentSpeed = 0;
                this.isMoving = false
            }
        }
        else {
            this.currentAnimation = "walk"
            this.currentSpeed = this.speed;
            this.isMoving = true;
            this.delayAtkTime = null;
        }
    }

    takeDmg(dmg) {
        this.hp -= dmg
        this.invincible = false; //fixa sen
        this.lastDmgdTime = Date.now()
    }

    checkDead(index) {
        if (this.hp < 0) {
            index > -1 ? game.sprites.splice(index, 1) : false
        }
    }

    canMove(game) {
        var myAtkPos = this.pos.x + (this.meleRange * this.direction / 2);
        let distToNext = game.distToNextSprite(this)
        console.log(distToNext.len, this.meleRange + 1, "kachow")
        if (distToNext.len < this.meleRange + 1) {
            console.log("yea")
            this.currentSpeed = distToNext.sprite.currentSpeed;

        }
        else { this.currentSpeed = this.speed }
        for (var i in game.sprites) {
            let loopSprite = game.sprites[i]
            if (loopSprite != this) {
                if (Math.abs(loopSprite.pos.x - myAtkPos) + .1 < this.meleRange / 2) {
                    if (loopSprite.row == this.row) {
                        if (loopSprite.team != this.team) {
                            this.attack(loopSprite)
                        }
                        else if (loopSprite.team == this.team) {
                            this.isIdle(true)
                        }
                        return;

                    }
                    else if (this.abilities.has("changeRow")) {
                        if (loopSprite.team != this.team) {
                            this.row = 0;
                        }
                        //if this.DRAW_SIZE
                    }
                }
            }
        }
        //this.isIdle(false)
    }

    getFrame() {
        var currAnim = this.animations[this.currentAnimation];
        this.frameDelay -= fpsCoefficient;
        if (this.frameDelay <= 0) {
            this.currentFrame += 1;
            if (this.currentFrame > currAnim.getFrameCount() - 1) {
                // console.log("tid per frame:", (Date.now() - this._last0frame) / currAnim.getFrameCount());
                this.currentFrame = 0;
                if (!currAnim.getIfLoop()) {
                    this.currentAnimation = "idle"
                }
                this._last0frame = Date.now()
            }
            this.frameDelay = this.animations[this.currentAnimation].getFrameRate();
        }
        else {

            //this.frameDelay--;
        }
        return this.currentFrame;
    }

    draw() {
        //console.log(this.name)
        let frame = this.getFrame()
        let animation = this.animations[this.currentAnimation].getRow()
        //console.log(frame)

        if (DRAW_NEAREST_NEIGHBOUR) { ctx.imageSmoothingEnabled = false } // viktig

        if (Date.now() - this.lastDmgdTime < INVINCIBLE_DELAY) {
            ctx.globalAlpha = 0.6;
        }
        ctx.drawImage(Images[this.img],
            this.imageSize * frame,
            this.imageSize * animation,
            this.imageSize,
            this.imageSize,

            (this.pos.x - this.DRAW_SIZE / 2) * S,
            (this.pos.y - this.DRAW_SIZE / 2) * S,
            this.DRAW_SIZE * S,
            this.DRAW_SIZE * S
        );
        ctx.globalAlpha = 1;

    }
}

class Projectile {
    constructor(x, y, vx, vy, team, dmg) {
        this.pos = { x: x, y: y };
        this.vel = { x: vx, y: vy };
        this.len = 6
        this.size = 0.6
        this.team = team
        this.dead = false;
        this.dmg = dmg
    }

    move() {
        this.pos.x += this.vel.x * fpsCoefficient / 100;
        this.pos.y += this.vel.y * fpsCoefficient / 100;
        this.vel.y += GRAVITY * fpsCoefficient / 100;

        //this.predictTouchDown()
    }

    checkHit(index) {
        if (this.pos.y > HEIGHT - 25) {
            for (var i in game.sprites) {
                if (this.team != game.sprites[i].team) {
                    if (dist(this.pos, game.sprites[i].pos) < game.sprites[i].size) {
                        game.sprites[i].takeDmg(this.dmg)
                        this.dead = true;
                    }
                }
            }
        }
    }
    checkDead(index) {
        if (this.dead || this.pos.y > HEIGHT) {
            index > -1 ? game.projectiles.splice(index, 1) : false
        }
    }


    getVec() {
        var hyp = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y)
        return { dx: this.vel.x / hyp, dy: this.vel.y / hyp }
    }

    predictTouchDown() {
        var acceleration = GRAVITY / 2
        var t_0 = (- this.vel.y + Math.sqrt(this.vel.y * this.vel.y - 4 * acceleration * (this.pos.y - 100))) / (2 * acceleration)
        console.log(this.vel.x * t_0 + this.pos.x)
    }

    draw() {
        ctx.fillStyle = 'white';
        if (DRAW_NEAREST_NEIGHBOUR) { ctx.imageSmoothingEnabled = false } // viktig
        // ctx.fillRect(this.pos.x, this.pos.y, 1 * S, 1 * S);
        var { dx, dy } = this.getVec();
        for (var i = 0; i <= this.len; i++) {
            ctx.fillRect((this.pos.x - dx * i * .5) * S,
                (this.pos.y - dy * i * .5) * S,
                this.size * S,
                this.size * S
            );
        }
    }
}

class Player {
    constructor(name) {
        this.name = name
        this.gold = 50;
        this.goldPerTurn = 30;
        this.team = 0; //0 = blue
        this.currentFolder = 0;
        this.race = "human"
    }

    changeGold(amount) {
        this.gold += amount
    }

    tryBuy(amount) {
        if (this.gold > amount) {
            this.changeGold(-amount);
            return true;
        }
        else { return false; }
    }

    giveGoldPerTurn() {
        this.changeGold(this.goldPerTurn);

    }

    logGoldAmount() {
        console.log(this.gold, "gold")
    }

    changeFolder(folder) {
        this.currentFolder = folder;
    }
}


class Game {
    constructor() {
        this.players = [
            new Player("kjelle"),
            new Player("bert"),
        ]
        this.sprites = [
            //new Sprite(80, 100, "soldier", "anim", "red"),
            //new Sprite(240, 100, "soldier", "anim", "red"),
            //new Sprite(200, 100, "block", "anm", "red"),
            //new Sprite(300, 100, "soldier", "anim", "red"),
        ];
        this.projectiles = [
            //new Projectile(80, 100, 20, -40),
        ]
        this.killStatus = undefined;
        this.activeButtons = {};

        this.mousePos = { x: 0, y: 0 };

        this.lastTimestamp = Date.now();
        this.tickLengthArray = [];
        this.startTime = Date.now();
        this.timeSinceLastGold = Date.now();
    }

    start() {
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = 20 * S + "px 'Press Start 2P'";
        ctx.fillText("Laddar...", 160 * S, 100 * S);
        let self = this;

        window.setTimeout(function () {
            self.tick();

        }, 1000)
    }

    tick() {
        if (this.killStatus == "KILL") { return };
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        let lastTickLength = Date.now() - this.lastTimestamp;
        this.lastTimestamp = Date.now();
        this.tickLengthArray.push(lastTickLength);
        if (this.tickLengthArray.length > 30) {
            this.tickLengthArray.splice(0, 1);
        }

        //how long did the last 30 frames take?
        let timeSum = 0;
        for (let i = 0; i < this.tickLengthArray.length; i++) {
            timeSum += this.tickLengthArray[i];
        }

        let timeAverage = timeSum / 30;
        let fps = 1000 / timeAverage;
        if (fps < 30) {
            fps = 30;
        }

        fpsCoefficient = 144 / fps;

        //draw stuff
        this.drawSprites()
        this.drawButtons();
        this.drawUI(fps);
        this.drawProjectiles();
        this.giveGold();


        //stuff to do at the end
        //this.lastTimestamp = Date.now();
        window.requestAnimationFrame(this.tick.bind(this)); //calls itself
    }

    getMillisecondsPlayed() {
        let currentTime = new Date();
        let getMillisecondsPassed = currentTime - this.startTime;
        return getMillisecondsPassed;
    }

    giveGold() {
        if (Date.now() - this.timeSinceLastGold > GOLD_INTERVAL * 1000) {
            this.timeSinceLastGold = Date.now();
            for (var i in this.players) {
                this.players[i].giveGoldPerTurn()
            }

        }
    }
    shootProjectile(x, y, vx, vy, team, dmg) {
        this.projectiles.push(new Projectile(x, y, vx, vy, team, dmg))

    }
    drawUI(fps) {
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = 5 * S + "px 'Press Start 2P'";
        ctx.fillText(Math.floor(GOLD_INTERVAL + 1 + (this.timeSinceLastGold - Date.now()) / 1000), 160 * S, 20 * S)
        ctx.fillText(Math.floor(fps), 300 * S, 60 * S);

        for (var key in this.players) {
            var player = this.players[key]
            ctx.fillText(Math.floor(player.gold),
                (UI_POS.gold.x + key * (GAME_WIDTH - 2 * UI_POS.gold.x)) * S,
                UI_POS.gold.y * S
            );

            ctx.fillText(Math.floor(player.goldPerTurn),
                (UI_POS.goldPerTurn.x + key * (GAME_WIDTH - 2 * UI_POS.goldPerTurn.x)) * S,
                UI_POS.goldPerTurn.y * S
            );


        }

    }

    distToNextSprite(sprite) {
        let bestCandidate = null;
        let bestCanLen = Infinity;
        let spriteDir = sprite.direction
        for (var i in this.sprites) {
            let loopSprite = this.sprites[i]
            if (sprite.team == loopSprite.team) {   //jafan
                //console.log(spriteDir * sprite.pos.x, spriteDir * loopSprite.pos.x, "comp")
                if (spriteDir * sprite.pos.x < spriteDir * loopSprite.pos.x) {
                    let loopDist = Math.abs(sprite.pos.x - loopSprite.pos.x)
                    //console.log(loopDist, "loopDist")
                    if (loopDist < bestCanLen) {
                        bestCanLen = loopDist
                        bestCandidate = loopSprite
                    }
                }
            }

        }
        return ({ sprite: bestCandidate, len: bestCanLen });
        //console.log(bestCanLen)
    }

    //===sprites===\\
    addSprite(x, y, name, anim, team) {
        this.sprites.push(new Sprite(x, y, name, anim, team))
    }
    drawSprites() {
        for (var i in this.sprites) {
            let hej = this.distToNextSprite(this.sprites[i])
            //console.log(hej.sprite, hej.len, "yo")
            this.sprites[i].canMove(this);
            this.sprites[i].move()
            this.sprites[i].draw()
            this.sprites[i].checkDead(i)

        }
    }
    drawProjectiles() {
        for (var i in this.projectiles) {
            this.projectiles[i].move()
            this.projectiles[i].draw()
            this.projectiles[i].checkHit(this, i)
            this.projectiles[i].checkDead(i)
        }
    }
    mouseClicked() {
        //this.addSprite(300, 100, "soldier", "anim");
        var buttonPressed = this.checkMouseWithinButton();
        if (buttonPressed != -1) {
            this.buttonAction(buttonPressed)
            //vem  anser stud en autin bil vid en olycka .skiljer sig svaren åt sinsemellan de som har körkort och de som inte har de. beror tycker studenterna och beror svaren på med eller utan skrivbord
        }
    }

    buyUnit(unitName, team) {
        if (this.players[team].tryBuy(STATS[unitName].cost)) {
            this.addSprite(BASE_POS[team].x, BASE_POS[team].y, unitName, "anim", team);
        }
    }
    buyUpgrade(upgradeName, player) {
        if (upgradeName == "upgGold") {
            let cost = this.players[player].goldPerTurn + UPGRADES["upgGold"].costIncrease;
            console.log(cost)
            if (this.players[player].tryBuy(cost)) {
                console.log("tja")
                this.players[player].goldPerTurn += UPGRADES["upgGold"].goldIncrease;
            }
        }
    }

    buttonAction(id) {
        let team = Math.floor(id / NUMBER_OF_BUTTONS);
        let curFolder = this.players[team].currentFolder;

        var mod_id = id % NUMBER_OF_BUTTONS;
        let btnAction = BTN_FOLDER[curFolder][mod_id].action;
        let btnData = BTN_FOLDER[curFolder][mod_id].data;

        if (btnAction == "hidden") {   //typeof null === 'object'
            console.log("how the fuck did you press a non-existent button")
        }
        else if (btnAction == 'folder') {
            this.players[team].changeFolder(btnData)
        }
        else if (btnAction === 'buyUnit') {
            this.buyUnit(btnData, team);
        }
        else if (btnAction === 'upgrade') {
            console.log(btnData, team)
            this.buyUpgrade(btnData, team);
        }
        this.activeButtons[id] = Date.now();

    }

    checkMouseWithinButton() {
        for (const [index, item] of BUTTON_LAYOUT.entries()) {
            if (Math.abs(item.x * S - this.mousePos.x) < BUTTON_SIZE && Math.abs(item.y * S - this.mousePos.y) < BUTTON_SIZE) {
                return index;
            }
        }
        return -1;
    }
    drawButtons() {
        for (const [index, item] of BUTTON_LAYOUT.entries()) {
            let mod_id = index % NUMBER_OF_BUTTONS
            let team = Math.floor(index / NUMBER_OF_BUTTONS);

            var frame = 0;

            let curFolder = this.players[team].currentFolder;
            let btnAction = BTN_FOLDER[curFolder][mod_id].action
            let btnText = BTN_FOLDER[curFolder][mod_id].txt
            let btnImg = BTN_FOLDER[curFolder][mod_id].img


            if (this.checkMouseWithinButton() == index) {
                frame = 1
            }
            if (index in this.activeButtons) {
                frame = 1
                if (Date.now() - this.activeButtons[index] > BUTTON_DELAY) {
                    delete this.activeButtons[index]
                }
            }

            if (DRAW_NEAREST_NEIGHBOUR) { ctx.imageSmoothingEnabled = false }

            if (btnAction != "hidden") {
                ctx.drawImage(Images.button1,
                    34 * frame,
                    0 * 0,
                    34,
                    34,
                    (item.x - BUTTON_SIZE / 2) * S,
                    (item.y - BUTTON_SIZE / 2) * S,
                    BUTTON_SIZE * S,
                    BUTTON_SIZE * S
                );

                ctx.drawImage(Images[btnImg],
                    32 * 0, //frame
                    0 * 0,
                    32,
                    32,
                    (item.x - ICON_SIZE / 2) * S,
                    (item.y + 5 - ICON_SIZE / 2) * S,
                    ICON_SIZE * S,
                    ICON_SIZE * S
                );

                ctx.textAlign = "center";
                ctx.fillStyle = "#ffffff";
                ctx.font = 3 * S + "px 'Press Start 2P'";
                ctx.fillText(btnText,
                    (item.x) * S,
                    (item.y - 5) * S,
                );
            }

        }
    }
}