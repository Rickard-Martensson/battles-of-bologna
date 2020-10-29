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
            this.speed = STATS[this.name].speed;
            this.img = STATS[this.name].img;
            this.imageSize = STATS[this.name].imageSize;
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

        this.lastAtkTime = Date.now();
        this.delayAtkTime = null;

        this.lastDmgdTime = Date.now();
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
                this.lastAtkTime = Date.now()
                //this.currentFrame = 1
                victim.takeDmg(this.dmg)
                this.delayAtkTime = null;
            }
        }
    }

    isIdle(bool) {
        if (bool) {
            this.currentAnimation = "idle"
            this.currentSpeed = 0;
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

        ctx.imageSmoothingEnabled = false;  //fett viktig rad

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




class Game {
    constructor() {
        this.sprites = [
            new Sprite(80, 100, "soldier", "anim", "red"),
            //new Sprite(240, 100, "soldier", "anim", "red"),
            //new Sprite(200, 100, "block", "anm", "red"),
        ];
        this.killStatus = undefined;
        this.activeButtons = {};

        this.mousePos = { x: 0, y: 0 };

        this.lastTimestamp = Date.now();
        this.tickLengthArray = [];
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
        this.debugEveryTick();
        this.drawUI(fps);

        //stuff to do at the end
        this.lastTimestamp = Date.now();
        window.requestAnimationFrame(this.tick.bind(this)); //calls itself


    }

    shootProjectile() {

    }
    drawUI(fps) {
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = 5 * S + "px 'Press Start 2P'";
        ctx.fillText(Math.floor(fps), 160 * S, 20 * S);
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
    mouseClicked() {
        //this.addSprite(300, 100, "soldier", "anim");
        var buttonPressed = this.checkMouseWithinButton();
        if (buttonPressed != -1) {
            console.log(buttonPressed)
            this.buttonAction(buttonPressed)

            //vem  anser stud en autin bil vid en olycka .skiljer sig svaren åt sinsemellan de som har körkort och de som inte har de. beror tycker studenterna och beror svaren på med eller utan skrivbord
        }
    }

    buttonAction(id) {
        var team = "none"
        if (id <= 5) {
            team = "blue"
        }
        else if (id >= 6) {
            team = "red"
        }
        if (id == 0) {
            this.addSprite(BASE_POS[team].x, BASE_POS[team].y, "soldier", "anim", team);
        }
        if (id == 1) {
            this.addSprite(BASE_POS[team].x, BASE_POS[team].y, "archer", "anim", team);
        }

        if (id == 7) {
            this.addSprite(BASE_POS[team].x, BASE_POS[team].y, "archer", "anim", team);
        }

        if (id == 8) {
            this.addSprite(BASE_POS[team].x, BASE_POS[team].y, "soldier", "anim", team);
        }

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
        // console.log(Images)
        for (const [index, item] of BUTTON_LAYOUT.entries()) {
            var frame = 0;
            if (this.checkMouseWithinButton() == index) {
                frame = 1
            }

            if (index in this.activeButtons) {
                //console.log("tjiho")
                frame = 1
                if (Date.now() - this.activeButtons[index] > BUTTON_DELAY) {
                    delete this.activeButtons[index]
                }
            }
            //console.log(this.activeButtons[index].time)

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
        }

    }

    debugEveryTick() {
        // console.log(this.mousePos.x + ";" + this.mousePos.y);
    }

}