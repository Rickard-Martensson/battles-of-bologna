// fpsCoefficient = 144/fps. spelet funkar alltså inte med mer än 144 fps



// // lägg in dehär i tick
// let timeSum = 0;
// for (let i = 0; i < this.tickLengthArray.length; i++) {
//     timeSum += this.tickLengthArray[i];
// }
// let timeAverage = timeSum / 30;
// let fps = 1000 / timeAverage;
// if (fps < 30) {
//     fps = 30;
// }
// fpsCoefficient = 144 / fps;



class sprite2 {
    constructor(x, y, imageName) {
        this.pos = { x: x, y: y }
        this.imageName = imageName;
        this.imageName = "Jumper"

        this.frameDelay = 0;
    }

    getFrame() {

        // fpsCoefficient = 144 / 30
        // this.frameDelay -= fpsCoefficient;
    }

    draw() {
        // let frame = this.getFrame();

        // ctx.drawImage(url("./bilder/ball.png"), 100, 100)
    }
}


function ritabild() {
    // ctx.drawImage(url("./bilder/ball.png"), 100, 100)
};