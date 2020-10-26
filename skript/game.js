

class Sprite {
    constructor() {

    }
}

class Game {
    constructor() {
        this.sprites = [
            new Sprite(80, 150, "soldier")
        ];
        this.killStatus = undefined;

        this.lastTimestamp = Date.now();
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
        console.log("hej")


        //draw stuff
    }

}