const bild = document.getElementById('');




var image2 = new Image();
image2.src = "./bilder/jumperblue.png";
var image3 = new Image();
image3.src = "./bilder/entities/soldier.png";

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
        }
        else { console.log("unknown sprite") };
        if (this.team == "red") {
            this.direction = -1
        }
        else if (this.team == "blue") {
            this.direction = 1
            this.img += "_blue"
        }

        this.currentAnimation = "walk";
        this.currentSpeed = this.speed

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
            }
            else {
                this.currentAnimation = "idle"
                this.currentSpeed = 0;
            }
        }
        else {
            this.currentAnimation = "walk"
            this.currentSpeed = this.speed;
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
        for (var i in game.sprites) {
            if (game.sprites[i] != this) {
                if (Math.abs(game.sprites[i].pos.x - myAtkPos) + .1 < this.meleRange / 2) {
                    if (game.sprites[i].team != this.team) {
                        this.attack(game.sprites[i])
                    }
                    else if (game.sprites[i].team == this.team) {
                        this.isIdle(true)
                    }
                    return;

                }
            }
        }
        this.isIdle(false)
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
                        console.log("ouch")
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
        this.team = "blue"
        this.currentFolder = 1;
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
}


class Game {
    constructor() {
        this.players = {
            blue: new Player("kjelle"),
            red: new Player("bert"),
        }
        this.players2 = [
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
            new Projectile(80, 100, 20, -40),
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
            for (var i in this.players2) {
                this.players2[i].giveGoldPerTurn()
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

        for (var key in this.players2) {
            var player = this.players2[key]
            ctx.fillText(Math.floor(player.gold),
                (UI_POS.gold.x + key * (GAME_WIDTH - 2 * UI_POS.gold.x)) * S,
                UI_POS.gold.y * S
            );

            ctx.fillText(Math.floor(player.goldPerTurn),
                (UI_POS.goldPerTurn.x + key * (GAME_WIDTH - 2 * UI_POS.goldPerTurn.x)) * S,
                UI_POS.goldPerTurn.y * S
            );


        }


        // for (var playerName in this.players) {
        //     let player_gold = this.players[playerName].gold
        //     console.log(index)
        //     ctx.fillText(Math.floor(player_gold), UI_POS[gold].x * S, UI_POS[gold].y * S);
        //     ctx.fillText(Math.floor(player_gold), UI_POS[goldPerTurn].x * S, UI_POS[goldPerTurn].y * S);
        // }
        // let gold_blue = this.players.blue.gold
        // let gold_red = this.players.red.gold


    }

    //sprites
    addSprite(x, y, name, anim, team) {
        this.sprites.push(new Sprite(x, y, name, anim, team))
    }
    drawSprites() {
        for (var i in this.sprites) {
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
            console.log(buttonPressed)
            this.buttonAction(buttonPressed)
            //vem  anser stud en autin bil vid en olycka .skiljer sig svaren åt sinsemellan de som har körkort och de som inte har de. beror tycker studenterna och beror svaren på med eller utan skrivbord
        }
    }

    buyUnit(unitName, team) {
        if (this.players[team].tryBuy(15)) {
            this.addSprite(BASE_POS[team].x, BASE_POS[team].y, unitName, "anim", team);
        }
    }

    buttonAction(id) {
        var team;
        let team_id = Math.floor(id / NUMBER_OF_BUTTONS);

        if (team_id == 0) { team = "blue" }
        else if (team_id == 1) { team = "red" }

        var mod_id = id % NUMBER_OF_BUTTONS
        this.buyUnit(BUTTON_BUY3[1][mod_id], team);
        this.activeButtons[id] = Date.now();
    }

    checkMouseWithinButton() {
        for (const [index, item] of BUTTON_LAYOUT.entries()) {
            if (Math.abs(item.x * S - this.mousePos.x) < BUTTON_SIZE && Math.abs(item.y * S - this.mousePos.y) < BUTTON_SIZE) {
                // console.log(index)
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
            var currentFolder;
            var currentButton;
            if (team == 0) {
                currentFolder = this.players.blue.currentFolder;
                currentButton = BUTTON_BUY3[currentFolder][index]
            }

            if (this.checkMouseWithinButton() == index) {
                frame = 1
            }
            if (index in this.activeButtons) {
                frame = 1
                if (Date.now() - this.activeButtons[index] > BUTTON_DELAY) {
                    delete this.activeButtons[index]
                }
            }

            if (currentButton !== null) {
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

                ctx.textAlign = "center";
                ctx.fillStyle = "#ffffff";
                ctx.font = 3 * S + "px 'Press Start 2P'";
                ctx.fillText(currentButton,
                    (item.x) * S,
                    (item.y - 5) * S,
                );
            }

        }
    }
}