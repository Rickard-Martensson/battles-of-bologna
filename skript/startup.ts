var canvas;
var background1;
var background2;
var hasInteractedBefore = false

var ctx;
var titleScreen;
var isBootup = false; // wether the bootupscreen is active, aka if the user has clicked

var buttonClass;

var fpsCoefficient = 1;

var aspectRatio = { width: 16, height: 9 }

var game: Game;

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
    updateMenu();

    window.onresize = function () { resizeCanvas(); resizeTitleScreen(); resizeBackgrounds(); };
    loadImages();
    loadSounds();
    loadStats();
    updateSelectedClans();




}

window.onclick = function () {
    if (!hasInteractedBefore) {
        console.log("hehe starting up!")
        showTitleScreen();

        setupAudio();

        toggleTitleBootupScreen()


        playAudio("title");
        hasInteractedBefore = true
    }

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

    let width: string = "0px";
    let height: string = "0px";

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


/**
 * popupThings
 */

var popupShowing = "none"
const CREDITS = "Developer: <br>Rickard Mårtensson <br><br> Art: <br>Rickard Mårtensson<br><br> Music & Sound: <br>Daniel Sterner <br><br>";
const TUTORIAL = "You know how it is"


function toggleCredits() {
    if (popupShowing == "credits") {
        closePopup()
    }
    else {
        popupShowing = "credits"
        document.getElementById("popup").style.visibility = "visible";
        document.getElementById("popupTitle").innerHTML = "&nbsp;Credits";
        document.getElementById("popupData").innerHTML = CREDITS

    }
}

function closePopup() {
    popupShowing = "none"
    document.getElementById("popup").style.visibility = "hidden";

}


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

/**
 * Title screen things
 */
function resizeTitleScreen() {
    titleScreen = document.getElementById("titleScreen");
    let { height, width } = getAspectRatio();
    titleScreen.style.width = width
    titleScreen.style.height = height

    var buttons = document.getElementsByClassName("button");


}

function showTitleScreen() {
    titleScreen.style.zIndex = "1";
    canvas.style.zIndex = "-10";
}

function hideTitleScreen() {
    titleScreen.style.zIndex = "-10";
    canvas.style.zIndex = "1";
}

function toggleTitleBootupScreen() {
    // var titleElements = document.getElementsByClassName('title');
    var titleElements: HTMLElement[] = Array.from(document.getElementsByClassName('title') as HTMLCollectionOf<HTMLElement>)
    console.log(titleElements)
    for (let e = 0; e < titleElements.length; e++) {
        const elem = titleElements[e];
        // elem.setAttribute("style.visibility", isBootup == true ? "hidden" : "visible")
        elem.style.visibility = isBootup == true ? "hidden" : "visible";
    }
    // var bootupElement = document.getElementsByClassName('bootup');
    var bootupElement: HTMLElement[] = Array.from(document.getElementsByClassName('bootup') as HTMLCollectionOf<HTMLElement>)
    console.log(bootupElement)
    for (let e = 0; e < bootupElement.length; e++) {
        const elem = bootupElement[e];
        elem.style.visibility = isBootup == true ? "visible" : "hidden";

    }
    titleScreen.style.backgroundImage = isBootup ? 'url("bilder/bootupScreen.png")' : 'url("bilder/background_wheat.png")';
    isBootup = !isBootup
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







var Images: { [id: string]: HTMLImageElement } = {
};
var imagesLoaded = 0;
function loadImages() {
    for (let i = 0; i < IMAGE_DIRECTORY.length; i++) {
        loadImage(IMAGE_DIRECTORY[i][0], IMAGE_DIRECTORY[i][1]);
    }

}

function loadImage(name: string, src: string) {
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
    Sounds[name] = { name: name, src: src, vol: vol }
}


function loadStats() {
    //console.log(STATS["soldier"].hp)
    // for (let i = 0; i < STATS.length; i++) {
    //     loadStats(STATS)
    // }
}


function updateSelectedClans() {
    for (let playerId = 0; playerId < playerClan.length; playerId++) {
        let clan_buttons = document.getElementsByClassName("clan_player_" + String(playerId))
        for (let btn = 0; btn < clan_buttons.length; btn++) {
            clan_buttons[btn].classList.remove("selected_clan_" + String(playerId))
        }
        let selected_clan = document.getElementById(ClanTypes[playerClan[playerId]] + "_button_" + String(playerId));
        // console.log(ClanTypes[playerClan[playerId]] + "_button_" + String(playerId))
        selected_clan.classList.add("selected_clan_" + String(playerId))
    }

}


function setClan(clan: string, player: number) {

    let newClan = ClanTypes.kingdom
    if (clan == "viking") {
        newClan = ClanTypes.viking
    }
    playerClan[player] = newClan

    updateSelectedClans()

}

function startGame() {
    console.log("tjatja")
    hideTitleScreen()
    game = new Game("bert", "kjell", playerClan[0], playerClan[1], 1, 1);
    game.start()
    activateGameController();
    playAudio("ingame")
}



function clickButton() {
    return;
}


var IS_ONLINE: number;

let local_UI = null;

function startGameLocal() {
    local_UI = new UIHandler([0, 1], false);
    IS_ONLINE = 0
    leaveChannel();
    startGame();
}

function startGameTest() {
    local_UI = new UIHandler([0], true);
    IS_ONLINE = 1
    startGame();
}

function startGameHost() {
    local_UI = new UIHandler([0], true);
    IS_ONLINE = 1
    startGame();

}

function startGameJoin() {
    local_UI = new UIHandler([1], true);
    IS_ONLINE = 1
    startGame();

}



function startGame2(mySide: number) { // mySide = -1 means spectator
    let playerList = []
    console.log("MYSIDE:", mySide)
    if (mySide == -1) {
        playerList = []
    }
    else {
        playerList = [mySide]
    }
    local_UI = new UIHandler(playerList, true);
    IS_ONLINE = 1
    startGame();
}
