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
    soldier: { hp: 10, dmg: 3, meleRange: 15, atkSpeed: 1200, atkDelay: 450, speed: 5, img: "soldier_img", imageSize: 32 },    //atkSpeed = 7*40/1000
    archer: { hp: 8, dmg: 2, meleRange: 15, atkSpeed: 1500, atkDelay: 1050, speed: 5, img: "archer_img", imageSize: 32 },
    mage: { hp: 6, dmg: 8, meleRange: 10, atkSpeed: 1, atkDelay: 0.2, speed: 2, img: "soldier_img", imageSize: 32 },
    block: { hp: 20, dmg: 0, meleRange: 10, atkSpeed: 0, atkDelay: 0.2, speed: 0, img: "soldier_img", imageSize: 32 }

}


var BUTTON_LAYOUT = [
    { x: 15, y: 135, key: "q" },
    { x: 45, y: 135, key: "w" },
    { x: 75, y: 135, key: "e" },
    { x: 15, y: 165, key: "a" },
    { x: 45, y: 165, key: "s" },
    { x: 75, y: 165, key: "d" },

    { x: 245, y: 135, key: "u" },
    { x: 275, y: 135, key: "i" },
    { x: 305, y: 135, key: "o" },
    { x: 245, y: 165, key: "j" },
    { x: 275, y: 165, key: "k" },
    { x: 305, y: 165, key: "l" },
]

var BUTTON_DICT = {
    q: 0,
    w: 1,
    e: 2,
    a: 3,
    s: 4,
    d: 5,
    u: 6,
    i: 7,
    o: 8,
    j: 9,
    k: 10,
    l: 11,
}


const BASE_POS = { red: { x: 300, y: 100 }, blue: { x: 20, y: 100 } }
const BUTTON_SIZE = 30;
const SPRITE_SIZE = 80;
const BUTTON_DELAY = 100;
const INVINCIBLE_DELAY = 200;