var canvas;
var background1;
var background2;
var hasInteractedBefore = false

var ctx: { drawImage: (arg0: HTMLImageElement, arg1: number, arg2: number, arg3: number, arg4: number, arg5: number, arg6: number, arg7: number, arg8: number) => void; globalAlpha: number; fillStyle: string; fillRect: (arg0: number, arg1: number, arg2: number, arg3: number) => void; strokeStyle: string; lineWidth: number; lineJoin: string; strokeRect: (arg0: number, arg1: number, arg2: number, arg3: number) => void; textAlign: string; font: string; fillText: (arg0: string | number, arg1: number, arg2: number) => void; imageSmoothingEnabled: boolean; clearRect: (arg0: number, arg1: number, arg2: number, arg3: number) => void; filter: string; beginPath: () => void; moveTo: (arg0: number, arg1: number) => void; lineTo: (arg0: number, arg1: number) => void; stroke: () => void; translate: (arg0: number, arg1: number) => void; webkitImageSmoothingEnabled: boolean; mozImageSmoothingEnabled: boolean; scale: (arg0: number, arg1: number) => void; };
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
        console.log("hehe ssssssssssssfef up!")
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
const CREDITS = "Developer: <br>Rickard Mårtensson <br><br> Art: <br>Rickard Mårtensson<br><br> Music & Sound: <br>Daniel Sterner <br><br>In the future this text might scroll slowly<br><br>that would fit with the music";
const TUTORIAL = "You know how it is"


function toggleCredits() {
    if (popupShowing == "credits") {
        closePopup()

    }
    else {
        playAudio("credits");
        popupShowing = "credits"
        document.getElementById("popup").style.visibility = "visible";
        document.getElementById("popupTitle").innerHTML = "&nbsp;Credits";
        document.getElementById("popupData").innerHTML = CREDITS

    }
}

function closePopup() {
    popupShowing = "none"
    playAudio("title");
    document.getElementById("popup").style.visibility = "hidden";

}


var S: number;
function resizeCanvas() {

    var screenHeight = window.innerHeight
    var screenWidth = window.innerWidth
    var uiSize = 0
    var ratio = window.devicePixelRatio;
    console.log("device pixel ratio", ratio)
    var local_width = 1
    var local_height = 1

    if (screenHeight / aspectRatio.height * aspectRatio.width < screenWidth) {
        local_width = (screenHeight / aspectRatio.height * aspectRatio.width) * SCREEN_SIZE //Math.round((screenHeight / aspectRatio.height * aspectRatio.width) * SCREEN_SIZE)
        local_height = (screenHeight * (1 - uiSize)) * SCREEN_SIZE //Math.round((screenHeight * (1 - uiSize)) * SCREEN_SIZE)
    }
    else {
        local_width = screenWidth * SCREEN_SIZE // Math.round(screenWidth * SCREEN_SIZE)
        local_height = (screenWidth / aspectRatio.width * aspectRatio.height * (1 - uiSize)) * SCREEN_SIZE // Math.round((screenWidth / aspectRatio.width * aspectRatio.height * (1 - uiSize)) * SCREEN_SIZE)
    }

    //hehe

    // https://gist.github.com/callumlocke/cc258a193839691f60dd saviour

    // set the 'real' canvas size to the higher width/height
    canvas.width = local_width * ratio;
    canvas.height = local_height * ratio;

    // ...then scale it back down with CSS
    canvas.style.width = local_width + 'px';
    canvas.style.height = local_height + 'px';

    ctx.scale(ratio, ratio);
    // const size = 200;
    // canvas.style.width = `${320}px`;
    // canvas.style.height = `${200}px`;


    S = (canvas.width / (ratio * 320));

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


interface SOUND_TYPE {
    name: string,
    src: string,
    vol: number
}

var Sounds: { [key: string]: SOUND_TYPE } = {};
var soundsLoaded = 0;
function loadSounds() {
    for (let i = 0; i < SOUND_DICTIONARY.length; i++) {
        loadSound(String(SOUND_DICTIONARY[i][0]), String(SOUND_DICTIONARY[i][1]), Number(SOUND_DICTIONARY[i][2]))
    }
}
function loadSound(name: string, src: string, vol: number) {
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



var elem = document.documentElement;


function toggleFullscreen() {
    var elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    }
    else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    resizeCanvas()

    window.setTimeout(function () {
        resizeCanvas()
    }, 500)
}

function setClan(clan: string, player: number) {

    let newClan: ClanTypes = ClanTypes.kingdom
    if (Object.values(ClanTypes).includes(clan)) {
        newClan = ClanTypes[clan];

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

let local_UI: UIHandler;

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
