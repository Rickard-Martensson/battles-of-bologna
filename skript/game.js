const bild = document.getElementById('');
const SPRITE_SIZE = 160;



var image = new Image();
image.src = "./bilder/jumperblue.png";

class Animation {
    constructor(frame_set, delay) {
        this.count = 0;
        this.delay = delay;
        this.frame = 0;
        this.frame_index = 0;
        this.frame_set = frame_set;
    }
}


class Sprite {
    constructor(x, y, name) {
        this.pos = { x: x, y: y };
        this.name = name;
        this.animation = new Animation(0, 0)
        this.frameDelay = 0;
        this.currentFrame = 0;


        this.DRAW_SIZE = 160;
        this.FRAME_RATE = 15;
    }

    getFrame() {

        this.frameDelay -= fpsCoefficient;
        if (this.frameDelay <= 0) {
            this.currentFrame += 1;
            if (this.currentFrame > 3) {
                this.currentFrame = 0;
            }
            this.frameDelay = this.FRAME_RATE
        }
        else {
            this.frameDelay--;
        }

        // return Math.floor(Math.random() * 4)

        return this.currentFrame + 1;

    }


    draw() {
        console.log(this.name)
        let frame = this.getFrame()
        let imageSize = 160
        let leftOrRight = 10

        ctx.drawImage(image,
            imageSize * frame, 0,
            imageSize, imageSize,

            this.pos.x, this.pos.y,
            this.DRAW_SIZE, this.DRAW_SIZE
        )


        // ctx.drawImage(image,

        //     //Source Coordinates
        //     frame * imageSize,
        //     leftOrRight * imageSize,
        //     imageSize,
        //     imageSize,

        //     //Draw Coordinates
        //     (this.pos.x - this.DRAW_SIZE / 2) * S,
        //     (this.pos.y - this.DRAW_SIZE / 2 - this.DRAW_OFFSET_Y) * S,
        //     this.DRAW_SIZE * S,
        //     this.DRAW_SIZE * S

        // )

    }
}


class Engine {
    constructor() {

    }
}

class Game {
    constructor() {
        this.sprites = [
            new Sprite(80, 150, "soldier"),
            new Sprite(240, 150, "archer")
        ];
        this.killStatus = undefined;

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

        this.lastTimestamp = Date.now();
        window.requestAnimationFrame(this.tick.bind(this)); //calls itself


    }

    drawSprites() {

        for (var i in this.sprites) {
            this.sprites[i].draw()
        }
    }

}