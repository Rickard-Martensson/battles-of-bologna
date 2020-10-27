const bild = document.getElementById('');




var image2 = new Image();
image2.src = "./bilder/jumperblue.png";
var image3 = new Image();
image3.src = "./bilder/entities/soldier.png";

class Animation {
    constructor(frame_set, delay) {
        this.count = 0;
        this.delay = delay;
        this.frame = 0;
        this.frame_index = 0;
        this.frame_set = frame_set;
    }
}

class Animation2 {
    constructor(frames, delays) { //frame indexes, how many ms per fram
        this.frames = frames;
        this.delays = delays;
    }
}

class Entity {
    constructor(name, x, y) {
        this.name = name;
        this.pos = { x: x, y: y };
        var animation = new Animation()
        this.sprite = new Sprite(this.pos.x, this.pos.y, this.name, "anim")
        this.hp = 0;
        this.speed
    }

    move() {
        this.pos.x += STATS.soldier.speed * fpsCoefficient / 1000;
    }
}

class Sprite {
    constructor(x, y, name, image, animation) {
        this.pos = { x: x, y: y };
        this.imageName = name;
        this.animation = new Animation(0, 0)
        this.frameDelay = 0;
        this.currentFrame = 0;


        this.DRAW_SIZE = 24;
        this.FRAME_RATE = 100;
    }

    move() {
        this.pos.x += STATS.soldier.speed * fpsCoefficient / 100;
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

        return this.currentFrame;

    }


    draw() {
        //console.log(this.name)
        let frame = this.getFrame()
        let imageSize = 24
        let leftOrRight = 0
        console.log(frame)

        ctx.imageSmoothingEnabled = false;  //fett viktig rad
        ctx.drawImage(Images["soldier"],
            imageSize * frame,
            imageSize * leftOrRight,
            imageSize,
            imageSize,

            (this.pos.x - this.DRAW_SIZE / 2) * S,
            (this.pos.y - this.DRAW_SIZE / 2) * S,
            this.DRAW_SIZE * S,
            this.DRAW_SIZE * S
        );


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
        this.entityarray = []
    }

    addEntity(x) {
        this.entityarray.push(x)
    }
}

class Game {
    constructor() {
        this.sprites = [
            new Sprite(80, 150, "soldier", "anim"),
            new Sprite(240, 150, "archer", "anim")
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

        //stuff to do at the end
        this.lastTimestamp = Date.now();
        window.requestAnimationFrame(this.tick.bind(this)); //calls itself


    };

    drawSprites() {

        for (var i in this.sprites) {
            this.sprites[i].draw()
            console.log("hej")
            this.sprites[i].move()
        }
    }

}