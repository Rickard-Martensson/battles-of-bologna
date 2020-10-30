var IMAGE_DIRECTORY = [
    ["soldier_img", "./bilder/sprites/soldier.png"],
    ["archer_img", "./bilder/sprites/archer.png"],
    ["soldier_img_blue", "./bilder/sprites/soldier_blue.png"],
    ["archer_img_blue", "./bilder/sprites/archer_blue.png"],
    ["image_not_found", "./bilder/ui/wtf.png"],
    ["exitButton", "./bilder/ui/ExitButton.png"],
    ["button1", "./bilder/ui/button1.png"],
];


var STATS = {
    soldier: { hp: 10, dmg: 3, meleRange: 15, range: 0, atkSpeed: 1200, atkDelay: 450, speed: 5, cost: 15, img: "soldier_img", imageSize: 32, size: 7 },    //range: 0, atkSpeed = 7*40/1000
    archer: { hp: 8, dmg: 2, meleRange: 15, range: 10, atkSpeed: 1500, atkDelay: 900, speed: 5, cost: 15, img: "archer_img", imageSize: 32, size: 7 },
    mage: { hp: 6, dmg: 8, meleRange: 10, range: 0, atkSpeed: 1, atkDelay: 0.2, speed: 2, cost: 15, img: "soldier_img", imageSize: 32, size: 7 },
    block: { hp: 20, dmg: 0, meleRange: 10, range: 0, atkSpeed: 0, atkDelay: 0.2, speed: 0, cost: 15, img: "soldier_img", imageSize: 32, size: 7 }

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

const BUTTON_BUY = {
    0: "soldier",
    1: "archer",
    2: "soldier",
    3: "soldier",
    4: null,
    5: null,
}

const BUTTON_BUY3 = {
    0: {
        0: null,
        1: null,
        2: null,
        3: 1,
        4: 2,
        5: 3,
    },
    1: {
        0: "soldier",
        1: "archer",
        2: "soldier",
        3: "soldier",
        4: "soldier",
        5: "soldier",
    }

}

const BASE_POS = { red: { x: 300, y: 100 }, blue: { x: 20, y: 100 } }
const UI_POS = { gold: { x: 20, y: 20 }, goldPerTurn: { x: 20, y: 30 } }
const BUTTON_SIZE = 30;
const SPRITE_SIZE = 80;
const BUTTON_DELAY = 100;
const INVINCIBLE_DELAY = 200;
const GRAVITY = 50;
const START_TIME = Date.now();
const HEIGHT = 100;
const DRAW_NEAREST_NEIGHBOUR = false;
const NUMBER_OF_BUTTONS = 6;
const GAME_WIDTH = 320;

//===Gameplay===\\
const GOLD_INTERVAL = 15;