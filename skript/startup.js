var canvas;
var ctx;
var titleScreen;
var Images = {};

var fpsCoefficient = 1;





/***********************
 *   Startar spelet    *
 **********************/

window.onload = function () {
    getCanvas();
    resizeCanvas();

    window.onresize = function () { resizeCanvas(); ritabild() };
    loadImages();

}



function getCanvas() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    ctx.translate(0.5, 0.5);
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
};

var S;
function resizeCanvas() {
    var screenHeight = window.innerHeight
    var screenWidth = window.innerWidth

    var aspectRatio = { width: 16, height: 9 }
    var uiSize = 0

    if (screenHeight / aspectRatio.height * aspectRatio.width < screenWidth) {
        canvas.width = screenHeight / aspectRatio.height * aspectRatio.width
        canvas.height = screenHeight * (1 - uiSize)
    }
    else {
        canvas.width = screenWidth
        canvas.height = screenWidth / aspectRatio.width * aspectRatio.height * (1 - uiSize)
    }

    S = canvas.width / 320;
}



var imagesLoaded = 0;
function loadImages() {
    for (let i = 0; i < IMAGE_DIRECTORY.length; i++) {
        loadImage(IMAGE_DIRECTORY[i][0], IMAGE_DIRECTORY[i][1]);
    }
}

function loadImage(name, src) {
    var img = new Image();   // Create new img element
    img.addEventListener('load', function () {
        Images[name] = img;
    }, false);
    img.src = src; // Set source path   
}


function showTitleScreen() {
    titleScreen.style.zIndex = "1";
}


function startGame() {
    game = new Game();
    game.start()
}
