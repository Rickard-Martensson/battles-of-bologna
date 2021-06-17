var canvas;
var background1;
var background2;

var ctx;
var titleScreen;

var buttonClass;

var fpsCoefficient = 1;

var aspectRatio = { width: 16, height: 9 }

var game;

//var audio = new Audio('./bilder/audio/TITLE MUSIC MP3.mp3');


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
    loadSounds();
    loadStats();

    showTitleScreen()

    setupAudio()
    // document.getElementById("titleText").style.left = "0"

    playAudio("title")


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

    document.documentElement.style.setProperty('--S', S + "px");
}

function resizeTitleScreen() {
    titleScreen = document.getElementById("titleScreen");
    let { height, width } = getAspectRatio();
    titleScreen.style.width = width
    titleScreen.style.height = height

    var buttons = document.getElementsByClassName("button");
    // for (var i = 0; i < buttons.length; i++) {
    //     buttons[i].style.height = 30 * S + "px";
    //     buttons[i].style.width = 30 * S + "px";
    // }


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




var Images = {};
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

var Sounds = {};
var soundsLoaded = 0;
function loadSounds() {
    for (let i = 0; i < SOUND_DICTIONARY.length; i++) {
        loadSound(SOUND_DICTIONARY[i][0], SOUND_DICTIONARY[i][1], SOUND_DICTIONARY[i][2])
    }
}
function loadSound(name, src, vol) {
    Sounds[name] = {name: name, src: src, vol: vol}
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
    console.log("tjatja")
    hideTitleScreen()
    game = new Game();
    game.start()
    activateGameController();
    playAudio("ingame")
}



function clickButton() {
    return;
}

let local_UI = null;

function startGameLocal() {
    local_UI = new UIHandler([0, 1], false);
    IS_ONLINE = false
    startGame();
}

function startGameTest() {
    local_UI = new UIHandler([0], true);
    IS_ONLINE = true
    startGame();
}

function startGameHost() {
    local_UI = new UIHandler([0], true);
    IS_ONLINE = true
    startGame();

}

function startGameJoin() {
    local_UI = new UIHandler([1], true);
    IS_ONLINE = true
    startGame();

}



function startGame2(mySide) { // mySide = -1 means spectator
    console.log("MYSIDE:", mySide)
    if (mySide == -1) { playerList = [] }
    else { playerList = [mySide] }
    local_UI = new UIHandler(playerList, true);
    IS_ONLINE = true
    startGame();
}



