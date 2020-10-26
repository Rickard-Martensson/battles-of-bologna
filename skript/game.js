

class Sprite {
    constructor() {

    }
}

class Game {
    constructor() {
        this.sprites = [
            new Sprite(80, 150, "soldier")
        ];
    }

    start() {
        ctx.fillStyle("white")
    }

    tick() {
        if (this.killStatus == "KILL") return;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        let lastTickLength = Date.now() - this.lastTimestamp;
        this.tickLengthArray.push(lastTickLength);
        if (this.tickLengthArray.length > 30) {
            this.tickLengthArray.splice(0, 1);
        }

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
    }
}