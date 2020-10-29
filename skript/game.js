const bild = document.getElementById('');




var image2 = new Image();
image2.src = "./bilder/jumperblue.png";
var image3 = new Image();
image3.src = "./bilder/entities/soldier.png";

class Animation {
    constructor(row, size, array) {
        this.row = row;
        this.size = size;
        this.array = array;
    }


}

class Sprite {
    constructor(x, y, name, animations, team) {
        this.pos = { x: x, y: y };
        this.imageName = name;
        this.animation = {
            idle: new Animation(0, 32, [(0, 1), (1, 0.5), (2, 0.5), (3, 0.5)]),
            walk: new Animation(0, 0),
            attack: new Animation(0, 0),
        };
        this.frameDelay = 0;
        this.currentFrame = 0;

        this.direction = 1
        this.team = team;
        if (this.team == "red") {
            this.direction = -1
        }
        else if (this.team == "blue") {
            this.direction = 1
        }

        this.name = name
        if (this.name in STATS) {
            this.hp = STATS[this.name].hp;
            this.atkspeed = STATS[this.name].atkspeed;
            this.dmg = STATS[this.name].dmg;
            this.speed = STATS[this.name].speed;
        }

        this.isWalking = true;
        this.isAttacking = false;
        this.isIdle = false;

        this.DRAW_SIZE = 24;
        this.FRAME_RATE = 20;
    }

    move() {
        this.pos.x += this.direction * this.speed * fpsCoefficient / 100;
    }

    canAttack(game) {
        var xpos1 = this.pos.x;
        for (var i in game.sprites) {
            if (Math.abs(game.sprites[i].pos.x - this.pos.x) < 5) {
                if (game.sprites[i] != this) {
                    console.log("BONK");
                }

            }
        }
    }

    getFrame() {
        this.frameDelay -= fpsCoefficient;
        if (this.frameDelay <= 0) {
            this.currentFrame += 1;
            if (this.currentFrame > 7) {
                this.currentFrame = 0;
            }
            this.frameDelay = this.FRAME_RATE
        }
        else {
            this.frameDelay--;
        }
        return this.currentFrame;
    }

    draw() {
        //console.log(this.name)
        let frame = this.getFrame()
        let imageSize = 32
        let leftOrRight = 1
        //console.log(frame)

        ctx.imageSmoothingEnabled = false;  //fett viktig rad
        ctx.drawImage(Images["soldier"],
            imageSize * frame,
            imageSize,
            imageSize,
            imageSize,

            (this.pos.x - this.DRAW_SIZE / 2) * S,
            (this.pos.y - this.DRAW_SIZE / 2) * S,
            this.DRAW_SIZE * S,
            this.DRAW_SIZE * S
        );

    }
}




class Game {
    constructor() {
        this.sprites = [
            new Sprite(80, 100, "soldier", "anim", "red"),
            new Sprite(240, 100, "archer", "anim", "red"),
            new Sprite(200, 100, "block", "anm", "red"),
        ];
        this.killStatus = undefined;

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
        this.drawButton();
        this.debugEveryTick();

        //stuff to do at the end
        this.lastTimestamp = Date.now();
        window.requestAnimationFrame(this.tick.bind(this)); //calls itself


    };

    //sprites
    addSprite(x, y, name, anim) {
        this.sprites.push(new Sprite(x, y, name, anim))
    }
    drawSprites() {

        for (var i in this.sprites) {
            this.sprites[i].draw()
            this.sprites[i].move()
            this.sprites[i].canAttack(this);

        }
    }
    mouseClicked() {
        //this.addSprite(300, 100, "soldier", "anim");
        var buttonPressed = this.checkMouseWithinButton();
        if (buttonPressed != -1) {
            console.log(buttonPressed)

            if (buttonPressed == 1) {
                this.addSprite(300, 100, "soldier", "anim", "blue");
            }


            //vem  anser stud en autin bil vid en olycka .skiljer sig svaren åt sinsemellan de som har körkort och de som inte har de. beror tycker studenterna och beror svaren på med eller utan skrivbord
        }
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
    drawButton() {
        // console.log(Images)
        for (const [index, item] of BUTTON_LAYOUT.entries()) {
            var frame = 0;
            if (this.checkMouseWithinButton() == index) {
                frame = 1
            }

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
        // BUTTON_LAYOUT.forEach(function (item, index) {
        //     //console.log(item, index);
        //     ctx.drawImage(Images.button1,
        //         0 * 0,
        //         0 * 0,
        //         34,
        //         34,
        //         (item.x - BUTTON_SIZE / 2) * S,
        //         (item.y - BUTTON_SIZE / 2) * S,
        //         BUTTON_SIZE * S,
        //         BUTTON_SIZE * S
        //     );
        // });
    }

    debugEveryTick() {
        // console.log(this.mousePos.x + ";" + this.mousePos.y);
    }

}