//==========================================================================================================================================================================================================================================================================================================================================================================\\


var IMAGE_DIRECTORY = [
    ["buttonBack_img", "./bilder/ui/btnBack.png"],
    ["buttonBack_img_blue", "./bilder/ui/btnBack.png"],
    ["soldier_img", "./bilder/sprites/soldier2.png"],
    ["archer_img", "./bilder/sprites/archer2.png"],
    ["knight_img", "./bilder/sprites/knight.png"],
    ["veteran_img", "./bilder/sprites/veteran.png"],
    ["soldier_img_blue", "./bilder/sprites/soldier_blue2.png"],
    ["archer_img_blue", "./bilder/sprites/archer_blue2.png"],
    ["knight_img_blue", "./bilder/sprites/knight_blue.png"],
    ["veteran_img_blue", "./bilder/sprites/veteran_blue.png"],
    //["image_not_found", "./bilder/ui/wtf.png"],
    ["exitButton", "./bilder/ui/ExitButton.png"],
    ["button1", "./bilder/ui/button3.png"],
    ["castle_img", "./bilder/sprites/castle.png"],
    ["castle_img_blue", "./bilder/sprites/castle_blue.png"],
    ["background_day", "./bilder/background_1_day.png"],
    ["background_dusk", "./bilder/background_1_dusk.png"],
    ["background_night", "./bilder/background_1_night.png"],
    ["cloud_img", "./bilder/sprites/clouds.png"],
    ["gold", "./bilder/sprites/icons.png"],
    ["icons_img", "./bilder/ui/icons2.png"],
    ["heart", "./bilder/ui/heart.png"],
    ["hpBars", "./bilder/ui/hpBars2.png"]

];

const BTN_SIZE = 32

var ICON_DIRECTORY = {
    target: { x: 0, y: 1 },
    invis: { x: 0, y: 0 },
    castle: { x: 0, y: 0 },
    invis: { x: 0, y: 0 },

}

const ICON_SS_POS = {
    target: { x: 0, y: 0 },
    invincible: { x: 1, y: 0 },
    sprint: { x: 2, y: 0 },
    goldUpg: { x: 3, y: 0 },
    castleUpg: { x: 4, y: 0 },
    repair: { x: 5, y: 0 },
}




const BASE_POS = [{ x: 20, y: 100 }, { x: 300, y: 100 }]
const UI_POS = [
    {
        winScreen: { x: 160, y: 90 }, gold: { x: 30, y: 23 }, goldPerTurn: { x: 30, y: 18 }, goldIcon: { x: 30, y: 20.2 },
        hp: { x: 30, y: 25 }, hpIcon: { x: 30, y: 22.2 }, heart: { x: 35, y: 15 }, hpBar: { x: 14.6, y: 25 },
        statsBox: {topleft: {x: 10, y: 10}, botright: {x: 40, y: 30}},
        chatBox: { chat: { pos1: { x: 230, y: 135 }, pos2: { x: 315, y: 175 } }, input: { x: 205, y: 160 } }
    },
    {
        winScreen: { x: 160, y: 90 }, gold: { x: 300, y: 23 }, goldPerTurn: { x: 300, y: 18 }, goldIcon: { x: 300, y: 20.2 },
        hp: { x: 300, y: 25 }, hpIcon: { x: 300, y: 22.2 }, heart: { x: 305, y: 15 }, hpBar: { x: 284.6, y: 25 },
        statsBox: {topleft: {x: 310, y: 10}, botright: {x: 280, y: 30}},
        chatBox: { chat: { pos1: { x: 5, y: 135 }, pos2: { x: 90, y: 175 } }, input: { x: 10, y: 160 } }
    }];
const UI_POS_BTN = { img: { x: 0, y: 1.5 }, txt: { x: 0, y: -8 }, txt2: { x: 0, y: -5 }, subText: { x: 0, y: 10.7 }, gold: { x: 1, y: 9.2 } }
const BUTTON_SIZE = 30; //hur stora knapparna är
const ICON_SIZE = 20;   //hur stora ikoner i knapparna
const SPRITE_SIZE = 80; //vet ej
const BUTTON_DELAY = 100;   //hur länge en knapp är 
const NUMBER_OF_BUTTONS = 6;    //antal knappar
const INVINCIBLE_DELAY = 150;   //hur länge en sprite är genomskinlig efter att ha blivit slagen
const GRAVITY = 50; //projektiler
const ABILITY_MAX_LVL = 4; //max lvl för abilities 
const CASTLE_MAX_LVL = 3; //max lvl för slottet
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
const SPRINT_ABILITY_SPEED = 4;

const CASTLE_ARROW_DELAY = [NaN, 15, 10, 10]

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

//===VISUAL ===\\
const DRAW_ICONS_SMOOTH = false // if the icons on buttons sghould be drawn smoothly

//=== clouds ===\\
const CLOUD_RATE = 0.00175;  //hur ofta det kommer moln
const CLOUD_SPEED = 0.3;   //hur snabba molnen är
const CLOUD_MIN_HEIGHT = 0;
const CLOUD_MAX_HEIGHT = 50;    //hur långt ner molnen kan skapas
const CLOUD_DIST_FACTOR = 3;      //clouds at y=CLOUD_HEIGHT are X bigger and X faster than those at y=0
const CLOUD_MAX_COUNT = 8; // make an educated guess

//===PERFORMACE===\\\
const CLOUDS_ENABLED = true
const GRAPHICS_LEVEL = 0 //0 is fast, 2 is fancy. 1 = shade sprites, 2 = shade projectiles & sprites.
const DRAW_NEAREST_NEIGHBOUR = true; //blurry or pixly
const DAY_NIGHT_ENABLED = true; //guess
const ARROW_GRAPHICS_LEVEL = 1; //0 for only white lines, 1 for texure, 2 for texture shaded by day/night


//===ONLINE===\\
const SYNC_INTERVAL = 30;   //how ofter we sync the entire game
var LAST_GLOBAL_UPDATE = Date.now(); // we dont want the game to sync right after someone used an ability
const GLOBAL_UPDATE_MARGIN = 250; // how long time of no actions are needed for global updates to pass trough
const SYNC_PROJECTILES = false // wethero r not to update projectile position when syncing. should be set to false
const LOBBY_CODE_LEN = 4

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

// let disabledBtns = new Set([{ "a": 1, "b": 2 }, { "a": 1, "b": 2 }
// ])

// if (disabledBtns.has({ "a": 1, "b": 2 })) { console.log("ja") }
// else {
//     console.log("nej")
// }


const STATS = {
    soldier: {
        hp: 10, dmg: 3, meleRange: 12, range: 0, atkSpeed: 1200, atkDelay: 450, speed: 4,
        abilities: [], row: 0, img: "soldier_img", imageSize: 32, size: 7,
        animations: { idle: new Animation(32, 0, 8, 60, true), walk: new Animation(32, 1, 8, 19.1804, true), attack: new Animation(32, 2, 7, 20, false) }
    },
    archer: {
        hp: 8, dmg: 2, meleRange: 12, range: 3, atkSpeed: 2000, atkDelay: 1000, speed: 4,
        abilities: ["targetfire"], row: 0, img: "archer_img", imageSize: 32, size: 7,
        animations: { idle: new Animation(32, 0, 8, 60, true), walk: new Animation(32, 1, 8, 19.1804, true), attack: new Animation(32, 2, 7, 20, false) }
    },
    knight: {
        hp: 15, dmg: 3, meleRange: 12, range: 0, atkSpeed: 1200, atkDelay: 450, speed: 10,
        abilities: ["coolShoes", "changeRow"], row: 1, img: "knight_img", imageSize: 32, size: 7,
        animations: { idle: new Animation(32, 0, 8, 60, true), walk: new Animation(32, 1, 8, 8, true), attack: new Animation(32, 2, 7, 20, false) }
    }, //speed ska va 10
    veteran: {
        hp: 15, dmg: 10, meleRange: 12, range: 0, atkSpeed: 2200, atkDelay: 1100, speed: 4,
        abilities: [], row: 0, img: "veteran_img", imageSize: 32, size: 7,
        animations: { idle: new Animation(32, 0, 8, 60, true), walk: new Animation(32, 1, 8, 19.1804, true), attack: new Animation(32, 2, 12, 18, false) }
    },
    sprinter: {
        hp: 6, dmg: 2, meleRange: 12, range: 0, atkSpeed: 1000, atkDelay: 500, speed: 15,
        abilities: [], row: 0, img: "soldier_img", imageSize: 32, size: 7,
        animations: { idle: new Animation(32, 0, 8, 60, true), walk: new Animation(32, 1, 8, 19.1804, true), attack: new Animation(32, 2, 7, 20, false) }
    },
    wizard: {
        hp: Infinity, dmg: 3, meleRange: 12, range: 0, atkSpeed: 1200, atkDelay: 450, speed: 4,
        abilities: ["zap"], row: 0, img: "soldier_img", imageSize: 32, size: 7,
        animations: { idle: new Animation(32, 0, 8, 60, true), walk: new Animation(32, 1, 8, 19.1804, true), attack: new Animation(32, 2, 7, 20, false) }
    },

}



// {
//     idle: new Animation(32, 0, 8, 60, true),
//     walk: new Animation(32, 1, 8, 20, true),
//     attack: new Animation(32, 2, 7, 20, false),
// };

const UNIQE = {
    knight: ["coolShoes", "changeRow"],
    archer: ["targetfire"],
    wizard: ["zap"]
}
//antingen finns statementet i box, eller nån i barnen
//vi kan patternmatcha
//hur scope funkar är att säg att vi står o chillar här
// [O, O, o, o, o, o]
//     v
// [O, O, O, O, O, o, o]
//              v
// [O, O, O, O, O, O, o]
//                 ^
//stora O är i scope, små o är inte i scope

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

const BTN_LAYOUT = {
    0: [
        { x: 15, y: 135, key: "q" },
        { x: 45, y: 135, key: "w" },
        { x: 75, y: 135, key: "e" },
        { x: 15, y: 165, key: "a" },
        { x: 45, y: 165, key: "s" },
        { x: 75, y: 165, key: "d" },
    ],
    1: [
        { x: 305, y: 135, key: "u" },
        { x: 275, y: 135, key: "i" },
        { x: 245, y: 135, key: "o" },
        { x: 305, y: 165, key: "j" },
        { x: 275, y: 165, key: "k" },
        { x: 245, y: 165, key: "l" },
    ]
}

const BUTTON_DICT = {
    q: { team: 0, id: 0 },
    w: { team: 0, id: 1 },
    e: { team: 0, id: 2 },
    a: { team: 0, id: 3 },
    s: { team: 0, id: 4 },
    d: { team: 0, id: 5 },
    o: { team: 1, id: 0 },
    i: { team: 1, id: 1 },
    u: { team: 1, id: 2 },
    l: { team: 1, id: 3 },
    k: { team: 1, id: 4 },
    j: { team: 1, id: 5 },
}

const BTN_FOLDER = {
    0: {
        0: { txt: "", action: "hidden", data: -1, img: null },
        1: { txt: "", action: "hidden", data: -1, img: null },
        2: { txt: "", action: "hidden", data: -1, img: null },
        3: { txt: "units", action: "folder", data: 1, img: "soldier_img" },
        4: { txt: "upgrades", action: "folder", data: 2, img: "soldier_img", icon: "castleUpg" },
        5: { txt: "abilities", action: "folder", data: 3, img: "soldier_img", icon: "target" },
    },
    1: {    // sprites
        0: { txt: "soldier", cost: 15, action: "buyUnit", data: "soldier", img: "soldier_img", info: "solders are basic mele units" },
        1: { txt: "archer", cost: 10, action: "buyUnit", data: "archer", img: "archer_img", info: "archers are ranged units that \nshoot 3 - 6 units forward" },
        2: { txt: "knight", cost: 35, action: "buyUnit", data: "knight", upgrade: "upgKnight", img: "knight_img", info: "knights are fast and strong,\nand will run past all your units\nto the front of the battlefield" }, // require: "upgKnight",
        3: { txt: "back", action: "folder", data: 0, img: "buttonBack_img" },
        4: { txt: "veteran", cost: 50, action: "buyUnit", data: "veteran", upgrade: "upgVeteran", img: "veteran_img", info: "veterans are very strong and \none-hits most units" },
        5: { txt: "", action: "hidden", data: -1, img: null },

    },
    2: {    //upgrades
        0: { txt: "upgrade", txt2: "gold", cost: "%upggold%", action: "upgrade", upgrade: "maxGold", data: "upgGold", img: "knight_img", icon: "goldUpg", info: "will increase the gold you get \nevery 15 seconds. \nthe cost of this ability increases" },
        1: { txt: "repair", txt2: "castle", cost: "%repaircastle%", action: "upgrade", upgrade: "repairCastle", data: "repairCastle", img: "knight_img", icon: "repair" , info: "will repair the castle by 15 hp. \nthe cost of this ability increases"},
        2: { txt: "unlock", txt2: "knight", cost: 50, subText: "50", action: "upgrade", upgrade: "upgKnight", data: "upgKnight", img: "knight_img" , info: "unlocks the knight, a fast and \nstrong frontline unit that runs \npast the battlefield"},
        3: { txt: "upgrade", txt2: "castle", cost: "%upgcastle%", action: "upgrade", upgrade: "upgCastle", data: "upgCastle", img: "knight_img", icon: "castleUpg", info: "upgrades the castle, making it \nshoot projectiles at the enemy\nhas 3 levels."},
        4: { txt: "back", action: "folder", data: 0, img: "buttonBack_img" },
        5: { txt: "unlock", txt2: "veteran", cost: 50, subText: "50", action: "upgrade", upgrade: "upgVeteran", data: "upgVeteran", img: "veteran_img", info: "unlocks the knight, a very \nstrong mele unit that one hits \nmost enemies"},
    },
    3: {
        0: { txt: "Take Dmg", cost: 1, action: "ability", data: "takedmg", abilityCooldown: 0, lvl: 2, img: "soldier_img" },
        // 0: { txt: "Arrows", cost: 2, action: "ability", data: "arrows", abilityCooldown: 1, lvl: 2, img: "soldier_img" },
        1: { txt: "Invincible", cost: 4, action: "ability", data: "invincible", abilityCooldown: 6, lvl: 3, img: "icons_img", icon: "invincible", info: "makes your units invincible for \na short while. \ntime it well!" },
        2: { txt: "Target", cost: 4, action: "ability", data: "target", abilityCooldown: 8, lvl: 4, img: "archer_img", icon: "target", info: "makes your archers shoot with \npin-point accuracy for a while" },
        3: { txt: "Sprint", cost: 3, action: "ability", data: "sprint", abilityCooldown: 4, lvl: 1, img: "soldier_img" },
        4: { txt: "Sprint", cost: 3, action: "ability", data: "sprint", abilityCooldown: 4, lvl: 0, img: "soldier_img", icon: "sprint", info: "makes all units on the battlefield \n sprint forward"},
        5: { txt: "back", action: "folder", data: 0, img: "buttonBack_img" },
        6: { txt: "upgrade", txt2: "ability", cost: "%upgability%", action: "upgrade", upgrade: "upgAbility", data: "upgAbility", img: "archer_img", info: "unlocks another ability"},

    },

}

