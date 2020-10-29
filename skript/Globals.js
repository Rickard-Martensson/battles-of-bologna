var IMAGE_DIRECTORY = [
    ["soldier", "./bilder/entities/soldier.png"],
    ["archer", "./bilder/archer.png"],
    ["image_not_found", "./bilder/ui/wtf.png"],
    ["exitButton", "./bilder/ui/ExitButton.png"],
    ["button1", "./bilder/ui/button1.png"],
];


var STATS = {
    soldier: { hp: 10, dmg: 3, atkspeed: 0.5, speed: 5 },
    archer: { hp: 8, dmg: 2, atkspeed: 1, speed: 6 },
    mage: { hp: 6, dmg: 8, atkspeed: 1, speed: 2 },
    block: { hp: 20, dmg: 0, atkspeed: 0, speed: 0 }

}

var BUTTON_LAYOUT = [
    { x: 15, y: 135 },
    { x: 45, y: 135 },
    { x: 75, y: 135 },
    { x: 15, y: 165 },
    { x: 45, y: 165 },
    { x: 75, y: 165 },

    { x: 245, y: 135 },
    { x: 275, y: 135 },
    { x: 305, y: 135 },
    { x: 245, y: 165 },
    { x: 275, y: 165 },
    { x: 305, y: 165 },

]

const BUTTON_SIZE = 30;
const SPRITE_SIZE = 80;