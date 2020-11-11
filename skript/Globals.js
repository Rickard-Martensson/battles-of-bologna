//==========================================================================================================================================================================================================================================================================================================================================================================\\

var IMAGE_DIRECTORY = [
    ["soldier_img", "./bilder/sprites/soldier2.png"],
    ["archer_img", "./bilder/sprites/archer2.png"],
    ["knight_img", "./bilder/sprites/knight.png"],
    ["soldier_img_blue", "./bilder/sprites/soldier_blue2.png"],
    ["archer_img_blue", "./bilder/sprites/archer_blue2.png"],
    ["knight_img_blue", "./bilder/sprites/knight_blue.png"],
    ["image_not_found", "./bilder/ui/wtf.png"],
    ["exitButton", "./bilder/ui/ExitButton.png"],
    ["button1", "./bilder/ui/button2.png"],
    ["castle_img", "./bilder/sprites/castle.png"],
    ["castle_img_blue", "./bilder/sprites/castle_blue.png"],
    ["background_day", "./bilder/background_1_day.png"],
    ["background_dusk", "./bilder/background_1_dusk.png"],
    ["background_night", "./bilder/background_1_night.png"],
    ["cloud_img", "./bilder/sprites/clouds.png"],
    ["gold", "./bilder/sprites/icons.png"]
];



const BASE_POS = [{ x: 20, y: 100 }, { x: 300, y: 100 }]
const UI_POS = [
    { gold: { x: 30, y: 20 }, goldPerTurn: { x: 30, y: 15 }, goldIcon: { x: 30, y: 17.2 } },
    { gold: { x: 300, y: 20 }, goldPerTurn: { x: 300, y: 15 }, goldIcon: { x: 300, y: 17.2 } }];
const UI_POS_BTN = { img: { x: 0, y: 2 }, txt: { x: 0, y: -8 }, txt2: { x: 0, y: -5 }, subText: { x: 1, y: 12 }, gold: { x: 1, y: 10.5 } }
const BUTTON_SIZE = 30; //hur stora knapparna är
const ICON_SIZE = 20;   //hur stora ikoner i knapparna
const SPRITE_SIZE = 80; //vet ej
const BUTTON_DELAY = 100;   //hur länge en knapp är 
const NUMBER_OF_BUTTONS = 6;    //antal knappar
const INVINCIBLE_DELAY = 200;   //hur länge en sprite är genomskinlig efter att ha blivit slagen
const GRAVITY = 50; //projektiler
var START_TIME = Date.now();  //när spelet startade
const HEIGHT = 100; //vet ej
const ROW_OFFSET = 1;   //hur många pixlar förskjuten en unit är i en ennan rad

const GAME_WIDTH = 320; //hur brett spelet är

//===Gameplay===\\
const GOLD_INTERVAL = 15;   //hur ofta man får guld
const PERSONAL_SPACE = 1;   //sprite.size + personal_space = avstånd mellan sprites
const MELE_RANGE_BUFFER = 0.1;  //grej som fixar att endast en sprite attackerar åt gången
const RANGE_RANDOMNESS = 0.5    //0.5 = arrows flyger mellan 100% & 150% av rangen.
const INVINCIBLE_DURATION = 2;
const ARCHER_TRAJECTORY = 1.25;  //arctan av detta är vinkeln den skjuts med
const ARCHER_TARGET_MAX_RANGE = 100 // maxrange när archers använder target fire abilityn.

//===DAY NIGHT ===\\
const MAXDARKNESS = 0.5 //hur mörka sprites blir på natten. används endast i graphics_level 1+
const DUSK_TIME = 0.1   //hur lång tid solen tar på sig att gå upp/ner 0-0.25. sätt inte till 0, utan 0.001
const NIGHT_TIME = 0.55 //när det börjar bli natt
const CYCLE_TIME = 30   //hur många sekunder ett dygn tar
var UNIT_DARKNESS_NUMBER = 1; //samm sak som under, fast som ett tal
var UNIT_DARKNESS = 'brightness(100%)'; //när det är natt sätts den till 'brightness(50%)'
var LAST_DRAWN_DARKNESS = 'brightness(100%)';   //här för optimering
const DEFAULT_DARKNESS = 'brightness(100%)';    //kommer ej ihåg

var DUSK_OPACITY = 0;   //används för moln, säger hur dusk-iga molnen ska va 
var IS_NIGHT = false;   //används för moln, säger om det ska va dag eller nattmoln


//=== clouds ===\\
const CLOUD_RATE = 0.00175;  //hur ofta det kommer moln
const CLOUD_SPEED = 0.3;   //hur snabba molnen är
const CLOUD_MIN_HEIGHT = 20;
const CLOUD_MAX_HEIGHT = 40;    //hur långt ner molnen kan skapas
const CLOUD_DIST_FACTOR = 8;      //clouds at y=CLOUD_HEIGHT are X bigger and X faster than those at y=0
const CLOUD_MAX_COUNT = 4; // make an educated guess

//===PERFORMACE===\\\
const CLOUDS_ENABLED = true
const GRAPHICS_LEVEL = 0 //0 is fast, 2 is fancy. 1 = shade sprites, 2 = shade projectiles & sprites.
const DRAW_NEAREST_NEIGHBOUR = true; //blurry or pixly
const DAY_NIGHT_ENABLED = true; //guess
const ARROW_GRAPHICS_LEVEL = 0; //0 for only white lines, 1 for texure, 2 for texture shaded by day/night


class Animation {
    //size of each square, how many rows down in spritesheet, number of frames, frameRate, isAloop(false on atk animations)
    constructor(size, row, frames, frameRate, isALoop) {
        this.size = size;
        this.row = row;
        this.frames = frames;
        this.frameRate = frameRate;
        this.isALoop = isALoop;
    }

    getFrameCount() {
        return this.frames;
    }

    getFrameRate() {
        return this.frameRate;
    }

    getRow() {
        return this.row;
    }

    getIfLoop() {
        return this.isALoop;
    }
}


const STATS = {
    soldier: { hp: 10, dmg: 3, meleRange: 12, range: 0, atkSpeed: 1200, atkDelay: 450, speed: 5, cost: 15, row: 0, img: "soldier_img", imageSize: 32, size: 7, animations: { idle: new Animation(32, 0, 8, 60, true), walk: new Animation(32, 1, 8, 20, true), attack: new Animation(32, 2, 7, 20, false) } },
    archer: { hp: 8, dmg: 2, meleRange: 12, range: 3, atkSpeed: 2000, atkDelay: 1000, speed: 5, cost: 10, row: 0, img: "archer_img", imageSize: 32, size: 7, animations: { idle: new Animation(32, 0, 8, 60, true), walk: new Animation(32, 1, 8, 20, true), attack: new Animation(32, 2, 7, 20, false) } },
    knight: { hp: 20, dmg: 2, meleRange: 12, range: 0, atkSpeed: 1200, atkDelay: 450, speed: 12, cost: 35, row: 1, img: "knight_img", imageSize: 32, size: 7, animations: { idle: new Animation(32, 0, 8, 60, true), walk: new Animation(32, 1, 8, 8, true), attack: new Animation(32, 2, 7, 20, false) } },
    sprinter: { hp: 6, dmg: 2, meleRange: 12, range: 0, atkSpeed: 1000, atkDelay: 500, speed: 15, cost: 15, row: 0, img: "archer_img", imageSize: 32, size: 7, animations: { idle: new Animation(32, 0, 8, 60, true), walk: new Animation(32, 1, 8, 20, true), attack: new Animation(32, 2, 7, 20, false) } },
}


// {
//     idle: new Animation(32, 0, 8, 60, true),
//     walk: new Animation(32, 1, 8, 20, true),
//     attack: new Animation(32, 2, 7, 20, false),
// };

const UNIQE = {
    knight: ["coolShoes", "changeRow"],
    archer: ["targetfire"],
}



const UPGRADES = {
    upgGold: { goldIncrease: 5, costIncrease: 5 }
}


const BUTTON_LAYOUT = [
    { x: 15, y: 135, key: "q" },
    { x: 45, y: 135, key: "w" },
    { x: 75, y: 135, key: "e" },
    { x: 15, y: 165, key: "a" },
    { x: 45, y: 165, key: "s" },
    { x: 75, y: 165, key: "d" },

    { x: 305, y: 135, key: "u" },
    { x: 275, y: 135, key: "i" },
    { x: 245, y: 135, key: "o" },
    { x: 305, y: 165, key: "j" },
    { x: 275, y: 165, key: "k" },
    { x: 245, y: 165, key: "l" },
]

const BUTTON_DICT = {
    q: 0,
    w: 1,
    e: 2,
    a: 3,
    s: 4,
    d: 5,
    o: 6,
    i: 7,
    u: 8,
    l: 9,
    k: 10,
    j: 11,
}

const BTN_FOLDER = {
    0: {
        0: { txt: "", action: "hidden", data: -1, img: null },
        1: { txt: "", action: "hidden", data: -1, img: null },
        2: { txt: "", action: "hidden", data: -1, img: null },
        3: { txt: "units", action: "folder", data: 1, img: "soldier_img" },
        4: { txt: "upgrades", action: "folder", data: 2, img: "soldier_img" },
        5: { txt: "abilities", action: "folder", data: 3, img: "soldier_img" },
    },
    1: {    // sprites
        0: { txt: "soldier", subText: "15", action: "buyUnit", data: "soldier", img: "soldier_img" },
        1: { txt: "archer", subText: "10", action: "buyUnit", data: "archer", img: "archer_img" },
        2: { txt: "knight", subText: "35", action: "buyUnit", data: "knight", img: "knight_img" },
        3: { txt: "back", action: "folder", data: 0, img: "soldier_img" },
        4: { txt: "", action: "hidden", data: -1, img: null },
        5: { txt: "", action: "hidden", data: -1, img: null },

    },
    2: {    //upgrades
        0: { txt: "upgrade", txt2: "Gold", subText: "%upgold%", action: "upgrade", data: "upgGold", img: "soldier_img" },
        1: { txt: "archer", action: "upgrade", data: "knight", img: "soldier_img" },
        2: { txt: "unlock", txt2: "Knight", subText: "50", action: "upgrade", data: "knight", img: "knight_img" },
        3: { txt: "soldier", action: "wip", data: -1, img: "soldier_img" },
        4: { txt: "back", action: "folder", data: 0, img: "soldier_img" },
        5: { txt: "soldier", action: "wip", data: -1, img: "soldier_img" },

    },
    3: {
        0: { txt: "Arrows", subText: "3", action: "ability", data: "arrows", btnCooldown: 0, abilityCooldown: 1, img: "soldier_img" },
        1: { txt: "Invincible", subText: "4", action: "ability", data: "invincible", btnCooldown: 0, abilityCooldown: 2, img: "soldier_img" },
        2: { txt: "Target", subText: "4", action: "ability", data: "target", btnCooldown: 0, abilityCooldown: 8, img: "archer_img" },
        3: { txt: "Sprint", subText: "3", action: "ability", data: "sprint", btnCooldown: 0, abilityCooldown: 4, img: "soldier_img" },
        4: { txt: "soldier", action: "wip", data: -1, img: "soldier_img" },
        5: { txt: "back", action: "folder", data: 0, img: "soldier_img" },
    },

}

