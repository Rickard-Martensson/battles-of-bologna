var canvas;
var background1;
var background2;

var ctx;
var titleScreen;
var Images = {};

var fpsCoefficient = 1;

var aspectRatio = { width: 16, height: 9 }

var game;



/***********************
 *   Startar spelet    *
 **********************/

window.onload = function () {
    getCanvas();
    getBackgrounds();
    resizeCanvas();
    resizeTitleScreen();
    resizeBackgrounds();

    window.onresize = function () { resizeCanvas(); resizeTitleScreen(); resizeBackgrounds(); };
    loadImages();
    loadStats();

    showTitleScreen()

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

function getBackgrounds() {
    background2 = document.getElementById("bg2");
    background1 = document.getElementById("bg1");
}

function getAspectRatio() {
    var screenHeight = window.innerHeight;
    var screenWidth = window.innerWidth;

    let width = 0;
    let height = 0;

    if (screenHeight / aspectRatio.height * aspectRatio.width < screenWidth) {
        width = (screenHeight / aspectRatio.height * aspectRatio.width) * SCREEN_SIZE + "px";
        height = screenHeight * SCREEN_SIZE + "px";
        document.body.style.fontSize = SCREEN_SIZE * screenHeight / 45 + "px";
    }
    else {
        width = screenWidth * SCREEN_SIZE + "px";
        height = (screenWidth / aspectRatio.width * aspectRatio.height) * SCREEN_SIZE + "px";
        document.body.style.fontSize = SCREEN_SIZE * screenWidth / 80 + "px";
    }

    return { height: height, width: width };
}


const SCREEN_SIZE = 1





var S;
function resizeCanvas() {
    var screenHeight = window.innerHeight
    var screenWidth = window.innerWidth
    var uiSize = 0

    if (screenHeight / aspectRatio.height * aspectRatio.width < screenWidth) {
        canvas.width = (screenHeight / aspectRatio.height * aspectRatio.width) * SCREEN_SIZE
        canvas.height = (screenHeight * (1 - uiSize)) * SCREEN_SIZE
    }
    else {
        canvas.width = screenWidth * SCREEN_SIZE
        canvas.height = (screenWidth / aspectRatio.width * aspectRatio.height * (1 - uiSize)) * SCREEN_SIZE
    }

    S = (canvas.width / 320);
}

function resizeTitleScreen() {
    titleScreen = document.getElementById("titleScreen");
    let { height, width } = getAspectRatio();
    titleScreen.style.width = width
    titleScreen.style.height = height

}

function resizeBackgrounds() {
    var screenHeight = window.innerHeight;
    var screenWidth = window.innerWidth;

    let { height, width } = getAspectRatio();
    background1.style.height = height
    background1.style.width = width
    background2.style.height = height
    background2.style.width = width
}

function showTitleScreen() {
    titleScreen.style.zIndex = "1";
    canvas.style.zIndex = "-10";
}

function hideTitleScreen() {
    titleScreen.style.zIndex = "-10";
    canvas.style.zIndex = "1";
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

function loadStats() {
    //console.log(STATS["soldier"].hp)
    // for (let i = 0; i < STATS.length; i++) {
    //     loadStats(STATS)
    // }
}


function showTitleScreen() {
    titleScreen.style.zIndex = "1";
}


function startGame() {
    hideTitleScreen()
    game = new Game();
    game.start()
    activateGameController()
}


function clickButton() {
    return;
}