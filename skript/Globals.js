var IMAGE_DIRECTORY = [
    ["soldier_img", "./bilder/sprites/soldier.png"],
    ["archer_img", "./bilder/sprites/archer.png"],
    ["soldier_img_blue", "./bilder/sprites/soldier_blue.png"],
    ["archer_img_blue", "./bilder/sprites/archer_blue.png"],
    ["image_not_found", "./bilder/ui/wtf.png"],
    ["exitButton", "./bilder/ui/ExitButton.png"],
    ["button1", "./bilder/ui/button1.png"],
    ["castle_img", "./bilder/sprites/castle.png"],
    ["castle_img_blue", "./bilder/sprites/castle_blue.png"],
    ["background_day", "./bilder/background_1_day.png"],
    ["background_dusk", "./bilder/background_1_dusk.png"],
    ["background_night", "./bilder/background_1_night.png"],
];

const STATS = {
    soldier: { hp: 10, dmg: 3, meleRange: 15, range: 0, atkSpeed: 1200, atkDelay: 450, speed: 5, cost: 15, row: 0, img: "soldier_img", imageSize: 32, size: 7 },    //range: 0, atkSpeed = 7*40/1000
    archer: { hp: 8, dmg: 2, meleRange: 15, range: 10, atkSpeed: 2000, atkDelay: 1000, speed: 5, cost: 10, row: 0, img: "archer_img", imageSize: 32, size: 7 },
    knight: { hp: 20, dmg: 2, meleRange: 15, range: 0, atkSpeed: 1200, atkDelay: 450, speed: 10, cost: 30, row: 1, img: "soldier_img", imageSize: 32, size: 7 },
    sprinter: { hp: 6, dmg: 2, meleRange: 15, range: 0, atkSpeed: 1000, atkDelay: 500, speed: 15, cost: 15, row: 0, img: "archer_img", imageSize: 32, size: 7 },
    block: { hp: 20, dmg: 0, meleRange: 10, range: 0, atkSpeed: 0, atkDelay: 0.2, speed: 0, cost: 15, row: 0, img: "soldier_img", imageSize: 32, size: 7 }
}

const UNIQE = {
    knight: ["coolShoes", "changeRow"],
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
    1: {
        0: { txt: "soldier", action: "buyUnit", data: "soldier", img: "soldier_img" },
        1: { txt: "archer", action: "buyUnit", data: "archer", img: "archer_img" },
        2: { txt: "knight", action: "buyUnit", data: "knight", img: "soldier_img" },
        3: { txt: "sprinter", action: "buyUnit", data: "sprinter", img: "archer_img" },
        4: { txt: "soldier", action: "wip", data: -1, img: "soldier_img" },
        5: { txt: "back", action: "folder", data: 0, img: "soldier_img" },
    },
    2: {
        0: { txt: "upgrade gold", action: "upgrade", data: "upgGold", img: "soldier_img" },
        1: { txt: "archer", action: "wip", data: -1, img: "archer_img" },
        2: { txt: "soldier", action: "wip", data: -1, img: "soldier_img" },
        3: { txt: "soldier", action: "wip", data: -1, img: "soldier_img" },
        4: { txt: "soldier", action: "wip", data: -1, img: "soldier_img" },
        5: { txt: "back", action: "folder", data: 0, img: "soldier_img" },
    },
    3: {
        0: { txt: "Arrows", action: "ability", data: "arrows", cooldown: 3, img: "soldier_img" },
        1: { txt: "archer", action: "wip", data: -1, img: "archer_img" },
        2: { txt: "soldier", action: "wip", data: -1, img: "soldier_img" },
        3: { txt: "soldier", action: "wip", data: -1, img: "soldier_img" },
        4: { txt: "soldier", action: "wip", data: -1, img: "soldier_img" },
        5: { txt: "back", action: "folder", data: 0, img: "soldier_img" },
    },

}

const BASE_POS = [{ x: 20, y: 100 }, { x: 300, y: 100 }]
const UI_POS = { gold: { x: 20, y: 20 }, goldPerTurn: { x: 20, y: 30 } }
const BUTTON_SIZE = 30;
const ICON_SIZE = 20;
const SPRITE_SIZE = 80;
const BUTTON_DELAY = 100;
const NUMBER_OF_BUTTONS = 6;
const INVINCIBLE_DELAY = 200;
const GRAVITY = 50;
const START_TIME = Date.now();
const HEIGHT = 100;
const DRAW_NEAREST_NEIGHBOUR = false;
const ROW_OFFSET = 1;

const GAME_WIDTH = 320;

//===Gameplay===\\
const GOLD_INTERVAL = 15;
const PERSONAL_SPACE = 1;
const MELE_RANGE_BUFFER = 0.1;

//===DAY NIGHT ===\\
const DUSK_TIME = 0.1
const NIGHT_TIME = 0.55
const CYCLE_TIME = 30
const NIGHT_BRIGHTNESS = 1.0;
var UNITDARKNESS = 'brightness(50%)';