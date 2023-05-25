//==========================================================================================================================================================================================================================================================================================================================================================================\\


const IMAGE_DIRECTORY: string[][] = [
    ["buttonBack_img", "./bilder/ui/btnBack.png"],
    ["buttonBack_img_blue", "./bilder/ui/btnBack.png"],
    // kingdom
    ["soldier_img", "./bilder/sprites/soldier2.png"],
    ["archer_img", "./bilder/sprites/archer2.png"],
    ["knight_img", "./bilder/sprites/knight.png"],
    ["veteran_img", "./bilder/sprites/veteran.png"],
    ["ballista_img", "./bilder/sprites/ballista.png"],
    ["soldier_img_blue", "./bilder/sprites/soldier_blue2.png"],
    ["archer_img_blue", "./bilder/sprites/archer_blue2.png"],
    ["knight_img_blue", "./bilder/sprites/knight_blue.png"],
    ["veteran_img_blue", "./bilder/sprites/veteran_blue.png"],
    ["ballista_img_blue", "./bilder/sprites/ballista_blue.png"],
    ["ballista_projectile", "./bilder/sprites/ballista_projectile.png"],
    ["rocket_projectile", "./bilder/sprites/rocket_projectile.png"],
    ["veteran_img_blue", "./bilder/sprites/veteran_blue.png"],
    // viking
    ["viking_img", "./bilder/sprites/viking.png"],
    ["viking_img_blue", "./bilder/sprites/viking_blue.png"],
    ["spearman_img", "./bilder/sprites/spearman.png"],
    ["spearman_img_blue", "./bilder/sprites/spearman_blue.png"],
    ["brute_img", "./bilder/sprites/brute.png"],
    ["brute_img_blue", "./bilder/sprites/brute_blue.png"],
    ["longship_img", "./bilder/sprites/longship.png"],
    ["longship_img_blue", "./bilder/sprites/longship.png"],
    ["barrel_projectile", "./bilder/sprites/viking_barrel.png"],
    ["thor_img_blue", "./bilder/sprites/thor_blue.png"],
    ["thor_img", "./bilder/sprites/thor_blue.png"],
    // eastern
    ["rocketeer_img", "./bilder/sprites/rocketeer.png"],
    ["rocketeer_img_blue", "./bilder/sprites/rocketeer_blue.png"],
    ["warrior_img", "./bilder/sprites/warrior.png"],
    ["warrior_img_blue", "./bilder/sprites/warrior_blue.png"],
    ["fireman_img", "./bilder/sprites/fireguy.png"],
    ["fireman_img_blue", "./bilder/sprites/fireguy_blue.png"],
    ["cannoneer_img", "./bilder/sprites/cannoneer2.png"],
    ["cannoneer_img_blue", "./bilder/sprites/cannoneer2_blue.png"],
    //
    ["exitButton", "./bilder/ui/ExitButton.png"],
    ["button1", "./bilder/ui/button3.png"],
    // buildings
    ["castle_img", "./bilder/sprites/castle.png"],
    ["castle_img_blue", "./bilder/sprites/castle_blue.png"],
    ["stavechurch_img", "./bilder/sprites/stavechurch.png"],
    ["stavechurch_img_blue", "./bilder/sprites/stavechurch_blue.png"],
    ["pagoda_img", "./bilder/sprites/pagoda.png"],
    ["pagoda_img_blue", "./bilder/sprites/pagoda_blue.png"],
    //
    ["background_day", "./bilder/background_1_day.png"],
    ["background_dusk", "./bilder/background_1_dusk.png"],
    ["background_night", "./bilder/background_1_night.png"],
    ["cloud_img", "./bilder/sprites/clouds.png"],
    ["gold", "./bilder/sprites/icons.png"],
    ["icons_img", "./bilder/ui/icons2.png"],
    ["icons_small", "./bilder/ui/icons_small.png"],
    ["heart", "./bilder/ui/heart.png"],
    ["hpBars", "./bilder/ui/hpBars2.png"],
    //effects
    ["explosion", "./bilder/sprites/explode3.png"],
    ["flame", "./bilder/sprites/flame1.png"],
    ["flamebig", "./bilder/sprites/flamebig1.png"],
    ["target_img", "./bilder/sprites/targetAbilitySprite.png"],
    ["cannon_explosion", "./bilder/sprites/cannon_explosion.png"],
    ["lightning_blue", "./bilder/sprites/lightning_blue.png"]
];





const SOUND_DICTIONARY: (string | number)[][] = [
    ["sword", './bilder/audio/zap/sword_strike2.mp3', 0.5],
    ["arrow", './bilder/audio/zap/arrow_fly.mp3', 1],
    ["buy", './bilder/audio/SIDSNARE.wav', 0],
    ["damage", './bilder/audio/zap/body_hit2.mp3', 1],
    ["hurry_up", './bilder/audio/hurry_up.mp3', 1],
    ["btn_press", './bilder/audio/click.wav', 1],
    ["repair", './bilder/audio/hammer3.mp3', 1],
    ["arrow_hit", './bilder/audio/zap/arrow_hit5.mp3', 1],
    ["title", './bilder/audio/musik/title_music.mp3', 1],
    ["ingame", './bilder/audio/musik/ingame_music.mp3', 1],
    ["ingame_hurry", './bilder/audio/musik/ingame_fast.mp3', 1],
    ["win", './bilder/audio/musik/victory_theme.mp3', 1],
    ["defeat", './bilder/audio/musik/defeat_theme.mp3', 1],
    ["credits", './bilder/audio/musik/harvest.mp3', 1],
    ["firework", './bilder/audio/firework2.mp3', 1],
    ["explode", './bilder/audio/explode.mp3', 1],
    ["cannon", './bilder/audio/cannon.mp3', 1],
    ["flamethrower", './bilder/audio/flamethrower2.mp3', 1],
    ["barrel_hit", './bilder/audio/barrel_hit.mp3', 0.1],
    ["cannon_hit", './bilder/audio/cannon_hit2.mp3', 0.1],
    ["ballista_hit", './bilder/audio/ballista_hit.mp3', 0.1],
    ["thunder", './bilder/audio/thunder2.mp3', 1],


    // "C:\Users\ricka\Documents\kod\typescript2\battles-of-bologna-ts/bilder/audio/firework.mp3"
]


const BTN_SIZE = 32



interface EFFECT_INFO_INTERFACE {
    imgSize: { x: number, y: number },
    drawSize: { x: number, y: number },
    framesPerRow: number,
    totalFrames: number
}

const EFFECT_DIRECTORY: { [key: string]: EFFECT_INFO_INTERFACE } = {
    explosion: { imgSize: { x: 50, y: 100 }, drawSize: { x: 30, y: 60 }, framesPerRow: 7, totalFrames: 28 },
    flame: { imgSize: { x: 100, y: 50 }, drawSize: { x: 60, y: 30 }, framesPerRow: 5, totalFrames: 23 },
    flamebig: { imgSize: { x: 100, y: 50 }, drawSize: { x: 60, y: 30 }, framesPerRow: 6, totalFrames: 27 },
    cannon_explosion: { imgSize: { x: 50, y: 100 }, drawSize: { x: 30, y: 60 }, framesPerRow: 5, totalFrames: 10 },
    lightning_blue: { imgSize: { x: 32, y: 100 }, drawSize: { x: 16, y: 50 }, framesPerRow: 13, totalFrames: 13 },
}


var ICON_DIRECTORY = { //legacy
    target: { x: 0, y: 1 },
    invis: { x: 0, y: 0 },
    castle: { x: 0, y: 0 },
}

const ICON_SS_POS = {
    target: { x: 0, y: 0 },
    invincible: { x: 1, y: 0 },
    sprint: { x: 2, y: 0 },
    goldUpg: { x: 3, y: 0 },
    castleUpg: { x: 4, y: 0 },
    repair: { x: 5, y: 0 },
    heal: { x: 6, y: 0 },
    arrows: { x: 7, y: 0 },
    churchUpg: { x: 4, y: 2 },
    churchRepair: { x: 5, y: 2 },
    jump: { x: 7, y: 2 },
    rage: { x: 6, y: 2 },
    vikingBarrel: { x: 2, y: 2 },
    question: { x: 3, y: 2 },
    pagodaUpg: { x: 4, y: 4 },
    pagodaRepair: { x: 5, y: 4 },
    shield: { x: 3, y: 4 },
    bigFlame: { x: 2, y: 4 },

}

const ICON_SMALL_POS = {
    queue: { x: 0, y: 0 },
    queueFull: { x: 1, y: 0 },
    heart: { x: 2, y: 0 },
}



const BASE_POS = [{ x: 20, y: 100, minx: 10, maxx: 30, startx: 0 }, { x: 300, y: 100, minx: 310, maxx: 290, startx: 320 }]
const UI_POS = [
    {
        winScreen: { x: 160, y: 90 }, gold: { x: 33, y: 23 }, goldPerTurn: { x: 33, y: 18 }, goldIcon: { x: 33, y: 20.2 }, queueIcon: { x: 10, y: 18 },
        hp: { x: 30, y: 25 }, hpIcon: { x: 30, y: 22.2 }, heart: { x: 35, y: 15 }, hpBar: { x: 11.6, y: 26.2 },
        statsBox: { topleft: { x: 10, y: 10 }, botright: { x: 40, y: 30 } },
        chatBox: { chat: { pos1: { x: 230, y: 135 }, pos2: { x: 315, y: 175 } }, input: { x: 205, y: 160 } }
    },
    {
        winScreen: { x: 160, y: 90 }, gold: { x: 303, y: 23 }, goldPerTurn: { x: 303, y: 18 }, goldIcon: { x: 303, y: 20.2 }, queueIcon: { x: 305.5, y: 18 },
        hp: { x: 300, y: 25 }, hpIcon: { x: 300, y: 22.2 }, heart: { x: 305, y: 15 }, hpBar: { x: 281.6, y: 26.2 },
        statsBox: { topleft: { x: 310, y: 10 }, botright: { x: 280, y: 30 } },
        chatBox: { chat: { pos1: { x: 5, y: 135 }, pos2: { x: 90, y: 175 } }, input: { x: 10, y: 160 } }
    }];
const UI_POS_BTN = { img: { x: 0, y: 1.5 }, txt: { x: 0, y: -8 }, txt2: { x: 0, y: -5 }, subText: { x: 0, y: 10.7 }, gold: { x: 1, y: 9.2 } }
const BUTTON_SIZE = 30; //hur stora knapparna är
const ICON_SIZE = 20;   //hur stora ikoner i knapparna
const SPRITE_SIZE = 80; //vet ej
const BUTTON_DELAY = 100;   //hur länge en knapp är i millisekunder
const NUMBER_OF_BUTTONS = 6;    //antal knappar
const INVINCIBLE_DELAY = 200;   //hur länge en sprite är genomskinlig efter att ha blivit slagen
const GRAVITY = 50; //projektiler
const ABILITY_MAX_LVL = 4; //max lvl för abilities 
const CASTLE_MAX_LVL = 3; //max lvl för slottet
var START_TIME = Date.now();  //när spelet startade
const HEIGHT = 100; //hur högt upp alla units är kanske
const ROW_OFFSET = 1;   //hur många pixlar förskjuten en unit är i en ennan rad

const GAME_WIDTH = 320; //hur brett spelet är

//===Gameplay===\\
const GOLD_INTERVAL = 15;   //hur ofta man får guld
const START_GOLD = 200;     // starting gold
const PERSONAL_SPACE = 1;   //sprite.size + personal_space = avstånd mellan sprites
const MELE_RANGE_BUFFER = 0.1;  //grej som fixar att endast en sprite attackerar åt gången
const RANGE_RANDOMNESS = 0.5    //0.5 = arrows flyger mellan 100% & 150% av rangen.
const INVINCIBLE_DURATION = 2;
const ARCHER_TRAJECTORY = 1.25;  //arctan av detta är vinkeln den skjuts med
const ARCHER_TARGET_MAX_RANGE = 100 // maxrange när archers använder target fire abilityn.
const SPRINT_ABILITY_SPEED = 10.2;
const BALLISTA_UNLOCK_DAY = 3; //how many days pass before ballista is unlocked.
const BALLISTA_SIEGE_RANGE = 120 //how far away from own castle the ballista should start shooting
const ROCKET_SPLASH_RADIUS = 6
const DEATH_DELAY = 100 // how long between a units gets to 0 hp until it gets deleted. higher values makes desyncs and race conditions less likely. milliseconds
var IS_DEBUGGING: boolean = true //låser upp allting


//===DAY NIGHT ===\\
const MAXDARKNESS = 0.5 //hur mörka sprites blir på natten. används endast i graphics_level 1+
const DUSK_TIME = 0.1   //hur lång tid solen tar på sig att gå upp/ner 0-0.25. sätt inte till 0, utan 0.001
const NIGHT_TIME = 0.55 //när det börjar bli natt
const CYCLE_TIME = 30   //                          hur många sekunder ett dygn tar
var UNIT_DARKNESS_NUMBER = 1; //                    samm sak som under, fast som ett tal
var UNIT_DARKNESS = 'brightness(100%)'; //          när det är natt sätts den till 'brightness(50%)'
var LAST_DRAWN_DARKNESS = 'brightness(100%)';   //  här för optimering
const DEFAULT_DARKNESS = 'brightness(100%)';    //  kommer ej ihåg

var DUSK_OPACITY = 0;   //                  används för moln, säger hur dusk-iga molnen ska va 
var IS_NIGHT: number = 0;   //              används för moln, säger om det ska va dag eller nattmoln

//===VISUAL ===\\
const DRAW_ICONS_SMOOTH = false //          if the icons on buttons sghould be drawn smoothly

//=== clouds ===\\
const CLOUD_RATE = 0.003;  //               hur ofta det kommer moln
const CLOUD_SPEED = 0.3;   //               hur snabba molnen är
const CLOUD_MIN_HEIGHT = 0;
const CLOUD_MAX_HEIGHT = 50;    //          hur långt ner molnen kan skapas
const CLOUD_DIST_FACTOR = 3;      //        clouds at y=CLOUD_HEIGHT are X bigger and X faster than those at y=0
const CLOUD_MAX_COUNT = 8; //               make an educated guess

//===PERFORMACE===\\\
const CLOUDS_ENABLED = true
const GRAPHICS_LEVEL = 0 //                 0 is fast, 2 is fancy. 1 = shade sprites, 2 = shade projectiles & sprites.
const DRAW_NEAREST_NEIGHBOUR = true; //     blurry or pixly
const DAY_NIGHT_ENABLED = true; //          guess
var ARROW_GRAPHICS_LEVEL = 1; //            0 for only white lines, 1 for texure, 2 for texture shaded by day/night


//===ONLINE===\\
const SYNC_INTERVAL = 10;   //              how ofter we sync the entire game
var LAST_GLOBAL_UPDATE = Date.now(); //     we dont want the game to sync right after someone used an ability
const GLOBAL_UPDATE_MARGIN = 250; //        how long time of no actions are needed for global updates to pass trough
const SYNC_PROJECTILES = false //           wethero r not to update projectile position when syncing. should be set to false
const LOBBY_CODE_LEN = 4
const ATK_DELAY_REDUCED_ONLINE = 150 // units dash out their damage quicker online. If it takes 0.25 seconds for a package to arrive, and this is set to 250 then it should be good 


//===STARTUP===\\
enum ClanTypes {
    "kingdom",
    "viking",
    "eastern",
    "wip",
}

var player1Name = "alice";
var player2Name = "bob";
var playerClan: ClanTypes[] = [ClanTypes.kingdom, ClanTypes.kingdom]

class SpriteAnimation {
    size: number;
    row: number;
    frames: number;
    frameRate: number;
    isALoop: boolean;
    //size of each square, how many rows down in spritesheet, number of frames, frameRate, isAloop(false on atk animations)
    constructor(size: number, row: number, frames: number, frameRate: number, isALoop: boolean) {
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

const UPGRADES = {
    upgGold: { goldIncrease: 5, costDelta: 10 },
    upgAbility: { costDelta: 5 }
}



enum SpriteCurAnim {
    "idle",
    "attack",
    "walk",
    "special",
}

enum SpriteCurState {
    "idle",
    "walk",
    "attack",
    "special",
    "jump",
}

enum Teams {
    "blue",
    "red"
}





interface EFFECT_INFO_INTERFACE {
    imgSize: { x: number, y: number },
    drawSize: { x: number, y: number },
    framesPerRow: number,
    totalFrames: number,
}

const EFFECT_DIRECTORY_2: { [key: string]: EFFECT_INFO_INTERFACE } = {
    explosion: { imgSize: { x: 50, y: 100 }, drawSize: { x: 30, y: 60 }, framesPerRow: 7, totalFrames: 28 },
    flame: { imgSize: { x: 100, y: 50 }, drawSize: { x: 75, y: 37.5 }, framesPerRow: 5, totalFrames: 23 }
}




interface SPRITE_STATS_INTERFACE {
    hp: number,
    dmg: number,
    speed: number,
    meleRange: number,
    range: number,
    atkSpeed: number,
    atkDelay: number
    meleDmg?: number,
    //
    abilities: string[],
    row: number,
    img: string,
    imageSize: number,
    size: number,
    armor?: number,
    animations: { [key in SpriteCurAnim]: SpriteAnimation }
    siege?: boolean;
}



const STATS: { [key: string]: SPRITE_STATS_INTERFACE } = {
    soldier: {
        hp: 11, dmg: 3, meleRange: 6, range: 0, atkSpeed: 1200, atkDelay: 450, speed: 4,
        abilities: [], row: 0, img: "soldier_img", imageSize: 32, size: 5,
        animations: { [SpriteCurAnim.idle]: new SpriteAnimation(32, 0, 8, 60, true), [SpriteCurAnim.walk]: new SpriteAnimation(32, 1, 8, 19.73, true), [SpriteCurAnim.attack]: new SpriteAnimation(32, 2, 7, 20, false), [SpriteCurAnim.special]: new SpriteAnimation(32, 0, 8, 60, true), }
    },
    archer: {
        hp: 8, dmg: 2, meleDmg: -1, meleRange: 5, range: 3, atkSpeed: 2000, atkDelay: 1000, speed: 4,
        abilities: ["targetfire", "targetCloseRange"], row: 0, img: "archer_img", imageSize: 32, size: 5,
        animations: { [SpriteCurAnim.idle]: new SpriteAnimation(32, 0, 8, 60, true), [SpriteCurAnim.walk]: new SpriteAnimation(32, 1, 8, 19.7, true), [SpriteCurAnim.attack]: new SpriteAnimation(32, 2, 7, 20, false), [SpriteCurAnim.special]: new SpriteAnimation(32, 0, 8, 60, true), }
    },
    knight: {
        hp: 15, dmg: 3, meleDmg: -1, meleRange: 7, range: 0, atkSpeed: 1200, atkDelay: 450, speed: 10,
        abilities: ["coolShoes", "changeRow"], row: 1, img: "knight_img", imageSize: 32, size: 7,
        animations: { [SpriteCurAnim.idle]: new SpriteAnimation(32, 0, 8, 60, true), [SpriteCurAnim.walk]: new SpriteAnimation(32, 1, 8, 19.7 / 2, true), [SpriteCurAnim.attack]: new SpriteAnimation(32, 2, 7, 20, false), [SpriteCurAnim.special]: new SpriteAnimation(32, 0, 8, 60, true), }
    }, //speed ska va 10
    veteran: {
        hp: 18, dmg: 12, meleDmg: -1, meleRange: 6, range: 0, atkSpeed: 2200, atkDelay: 1100, speed: 4,
        abilities: [], row: 0, img: "veteran_img", imageSize: 32, size: 5,
        animations: { [SpriteCurAnim.idle]: new SpriteAnimation(32, 0, 8, 60, true), [SpriteCurAnim.walk]: new SpriteAnimation(32, 1, 8, 19.7, true), [SpriteCurAnim.attack]: new SpriteAnimation(32, 2, 12, 18, false), [SpriteCurAnim.special]: new SpriteAnimation(32, 0, 8, 60, true), }
    },
    ballista: {
        hp: 12, dmg: 1, meleDmg: -1, meleRange: 9, range: 5, atkSpeed: 4000, atkDelay: 400, speed: 2.5,
        abilities: ["ballista"], row: 0, img: "ballista_img", imageSize: 32, size: 9, siege: true,
        animations: { [SpriteCurAnim.idle]: new SpriteAnimation(32, 0, 8, 60, true), [SpriteCurAnim.walk]: new SpriteAnimation(32, 1, 8, 19.7 * 1.5, true), [SpriteCurAnim.attack]: new SpriteAnimation(32, 2, 8, 18, false), [SpriteCurAnim.special]: new SpriteAnimation(32, 0, 8, 60, true), }
    },
    sprinter: {
        hp: 6, dmg: 2, meleDmg: -1, meleRange: 12, range: 0, atkSpeed: 1000, atkDelay: 500, speed: 15,
        abilities: [], row: 0, img: "soldier_img", imageSize: 32, size: 6.5,
        animations: { [SpriteCurAnim.idle]: new SpriteAnimation(32, 0, 8, 60, true), [SpriteCurAnim.walk]: new SpriteAnimation(32, 1, 8, 19.7, true), [SpriteCurAnim.attack]: new SpriteAnimation(32, 2, 7, 20, false), [SpriteCurAnim.special]: new SpriteAnimation(32, 0, 8, 60, true), }
    },
    // wizard: {
    //     hp: Infinity, dmg: 3, meleDmg: -1, meleRange: 12, range: 0, atkSpeed: 1200, atkDelay: 450, speed: 4,
    //     abilities: ["zap"], row: 0, img: "soldier_img", imageSize: 32, size: 6.5,
    //     animations: { [SpriteCurAnim.idle]: new SpriteAnimation(32, 0, 8, 60, true), [SpriteCurAnim.walk]: new SpriteAnimation(32, 1, 8, 19.7, true), [SpriteCurAnim.attack]: new SpriteAnimation(32, 2, 7, 20, false), [SpriteCurAnim.special]: new SpriteAnimation(32, 0, 8, 60, true), }
    // },
    //vikings
    viking: {
        hp: 9, dmg: 4, meleDmg: -1, meleRange: 6, range: 0, atkSpeed: 1200, atkDelay: 500, speed: 6,
        abilities: ["rage"], row: 0, img: "viking_img", imageSize: 32, size: 5,
        animations: { [SpriteCurAnim.idle]: new SpriteAnimation(32, 0, 8, 60, true), [SpriteCurAnim.walk]: new SpriteAnimation(32, 1, 8, 19.7, true), [SpriteCurAnim.attack]: new SpriteAnimation(32, 2, 7, 21, false), [SpriteCurAnim.special]: new SpriteAnimation(32, 0, 8, 60, true), }
    },
    spearman: {
        hp: 8, dmg: 2, meleDmg: 4, meleRange: 6, range: 2.5, atkSpeed: 2000, atkDelay: 650, speed: 6,
        abilities: ["spear", "meleClose", "rage"], row: 0, img: "spearman_img", imageSize: 32, size: 5,
        animations: { [SpriteCurAnim.idle]: new SpriteAnimation(32, 0, 8, 60, true), [SpriteCurAnim.walk]: new SpriteAnimation(32, 1, 8, 19.16, true), [SpriteCurAnim.attack]: new SpriteAnimation(32, 3, 8, 18, false), [SpriteCurAnim.special]: new SpriteAnimation(32, 2, 9, 22, false) }
    },
    brute: {
        hp: 13, dmg: 3, meleDmg: -1, meleRange: 7, range: 0, atkSpeed: 2000, atkDelay: 500, speed: 6,
        abilities: ["jump", "whirlwind", "rage"], row: 0, img: "brute_img", imageSize: 32, size: 6,
        animations: { [SpriteCurAnim.idle]: new SpriteAnimation(32, 0, 8, 60, true), [SpriteCurAnim.walk]: new SpriteAnimation(32, 1, 8, 19.6, true), [SpriteCurAnim.attack]: new SpriteAnimation(32, 2, 11, 10, false), [SpriteCurAnim.special]: new SpriteAnimation(32, 3, 12, 25, false) }
    },
    thor: {
        hp: 18, dmg: 4, meleDmg: -1, meleRange: 6, range: 0, atkSpeed: 1300, atkDelay: 1000, speed: 4,
        abilities: ["thor"], row: 0, img: "thor_img", imageSize: 32, size: 5,
        animations: { [SpriteCurAnim.idle]: new SpriteAnimation(32, 0, 8, 60, true), [SpriteCurAnim.walk]: new SpriteAnimation(32, 1, 8, 19.7, true), [SpriteCurAnim.attack]: new SpriteAnimation(32, 3, 11, 18, false), [SpriteCurAnim.special]: new SpriteAnimation(32, 0, 8, 60, true), }
    },
    longship: {
        hp: 13, dmg: 1, meleDmg: -1, meleRange: 13, range: 5, atkSpeed: 3000, atkDelay: 500, speed: 3,
        abilities: ["ballista"], row: 0, img: "longship_img", imageSize: 48, size: 13, siege: true,
        animations: { [SpriteCurAnim.idle]: new SpriteAnimation(32, 0, 2, 60, true), [SpriteCurAnim.walk]: new SpriteAnimation(32, 1, 8, 19.6, true), [SpriteCurAnim.attack]: new SpriteAnimation(32, 0, 1, 20, false), [SpriteCurAnim.special]: new SpriteAnimation(32, 0, 1, 25, false) }
    },
    //eastern
    warrior: {
        hp: 11, dmg: 2, meleDmg: -1, armor: 0, meleRange: 5, range: 0, atkSpeed: 1200, atkDelay: 450, speed: 4,
        abilities: ["shield"], row: 0, img: "warrior_img", imageSize: 32, size: 5,
        animations: { [SpriteCurAnim.idle]: new SpriteAnimation(32, 0, 8, 60, true), [SpriteCurAnim.walk]: new SpriteAnimation(32, 1, 8, 19.73, true), [SpriteCurAnim.attack]: new SpriteAnimation(32, 2, 7, 20, false), [SpriteCurAnim.special]: new SpriteAnimation(32, 3, 8, 60, true), }
    },
    rocketeer: {
        hp: 12, dmg: 1, meleDmg: -1, meleRange: 8, range: 0.8, atkSpeed: 2400, atkDelay: 1200, speed: 4,
        abilities: ["rocket", "targetCloseRange"], row: 0, img: "rocketeer_img", imageSize: 32, size: 7,
        animations: { [SpriteCurAnim.idle]: new SpriteAnimation(32, 0, 8, 60, true), [SpriteCurAnim.walk]: new SpriteAnimation(32, 3, 8, 19.7, true), [SpriteCurAnim.attack]: new SpriteAnimation(32, 2, 8, 28, false), [SpriteCurAnim.special]: new SpriteAnimation(32, 0, 8, 60, true), }
    },
    fireman: {
        hp: 8, dmg: 1, meleDmg: -1, meleRange: 5, range: 3.5, atkSpeed: 1500, atkDelay: 900, speed: 4,
        abilities: ["flamethrower", "bigFlame"], row: 0, img: "fireman_img", imageSize: 32, size: 6,
        animations: { [SpriteCurAnim.idle]: new SpriteAnimation(32, 0, 8, 60, true), [SpriteCurAnim.walk]: new SpriteAnimation(32, 1, 8, 20, true), [SpriteCurAnim.attack]: new SpriteAnimation(32, 2, 8, 30, false), [SpriteCurAnim.special]: new SpriteAnimation(32, 0, 8, 70, true), }
    },
    cannoneer: {
        hp: 12, dmg: 1, meleDmg: -1, meleRange: 9, range: 5, atkSpeed: 4000, atkDelay: 1000, speed: 2.5,
        abilities: ["ballista", "cannon"], row: 0, img: "cannoneer_img", imageSize: 32, size: 9, siege: true,
        animations: { [SpriteCurAnim.idle]: new SpriteAnimation(32, 0, 8, 60, true), [SpriteCurAnim.walk]: new SpriteAnimation(32, 3, 8, 19.7, true), [SpriteCurAnim.attack]: new SpriteAnimation(32, 1, 11, 22, false), [SpriteCurAnim.special]: new SpriteAnimation(32, 0, 8, 60, true), }
    },

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


// const BUTTON_LAYOUT = [
//     { x: 15, y: 135, key: "q" },
//     { x: 45, y: 135, key: "w" },
//     { x: 75, y: 135, key: "e" },
//     { x: 15, y: 165, key: "a" },
//     { x: 45, y: 165, key: "s" },
//     { x: 75, y: 165, key: "d" },

//     { x: 305, y: 135, key: "u" },
//     { x: 275, y: 135, key: "i" },
//     { x: 245, y: 135, key: "o" },
//     { x: 305, y: 165, key: "j" },
//     { x: 275, y: 165, key: "k" },
//     { x: 245, y: 165, key: "l" },
// ]

interface BTN_LAYOUT_INTERFACE {
    x: number,
    y: number,
    key: string,
}

const BTN_LAYOUT: { [key: number]: BTN_LAYOUT_INTERFACE[] } = {
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

interface BTN_DICT_INTERFACE {
    team: number,
    id: number
}

const BUTTON_DICT: { [key: string]: BTN_DICT_INTERFACE } = {
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





interface CLAN_INFO_INTERFACE {
    base_img: string,
    arrow_delay: number[],
    ballista_delay: number[],
    projectile_type: string,
    siege_proj_type: string,
    projectile_dmg: number,
    projectile_speed: { vx: number, vy: number },
    projectile_randomness: { rx: number, ry: number },
}


const CLAN_INFO: { [key in ClanTypes]: CLAN_INFO_INTERFACE } = {
    [ClanTypes.kingdom]: {
        base_img: "castle_img",
        arrow_delay: [NaN, 10, 5, 5],
        ballista_delay: [NaN, NaN, NaN, 12],
        projectile_type: "arrow",
        siege_proj_type: "ballista",

        projectile_dmg: 3,
        projectile_speed: { vx: 25, vy: -40 },
        projectile_randomness: { rx: 55, ry: -35 },
    },
    [ClanTypes.viking]: {
        base_img: "stavechurch_img",
        arrow_delay: [NaN, 16, 8, 8],
        ballista_delay: [NaN, NaN, NaN, 12],
        projectile_type: "spear",
        siege_proj_type: "ballista",
        projectile_dmg: 5,
        projectile_speed: { vx: 20, vy: -30 },
        projectile_randomness: { rx: 45, ry: -35 },
    },
    [ClanTypes.eastern]: {
        base_img: "pagoda_img",
        arrow_delay: [NaN, 16, 8, 8],
        ballista_delay: [NaN, NaN, NaN, 12],
        projectile_type: "rocket",
        siege_proj_type: "cannon",

        projectile_dmg: 1,
        projectile_speed: { vx: -.5, vy: -1 },
        projectile_randomness: { rx: 1, ry: 0 },
    },
    [ClanTypes.wip]: {
        base_img: "castle_img",
        arrow_delay: [NaN, 10, 5, 5],
        ballista_delay: [NaN, NaN, NaN, 12],
        projectile_type: "arrow",
        siege_proj_type: "cannon",

        projectile_dmg: 3,
        projectile_speed: { vx: 25, vy: -40 },
        projectile_randomness: { rx: 55, ry: -35 },
    },

}

interface CONTROL_BTN_INTERFACE {
    //text osv
    txt: string,
    txt2?: string,
    subText?: string
    info: string,
    // bild
    img: string,
    icon?: string,
    // saker som händer
    action: string,
    cost?: number | string,
    data: number | string,
    upgrade?: string,
    abilityCooldown?: number,
    lvl?: number,
}

interface BTN_FOLDER_INTERFACE {
    [key: number]: CONTROL_BTN_INTERFACE
}

const BTN_FOLDER: { [key in ClanTypes]: { [key: number]: BTN_FOLDER_INTERFACE } } = {
    [ClanTypes.kingdom]: {
        0: {
            0: { txt: "", action: "hidden", data: -1, img: "", info: "" },
            1: { txt: "", action: "hidden", data: -1, img: "", info: "" },
            2: { txt: "", action: "hidden", data: -1, img: "", info: "" },
            3: { txt: "units", action: "folder", data: 1, img: "soldier_img", info: "buy units" },
            4: { txt: "upgrades", action: "folder", data: 2, img: "soldier_img", icon: "castleUpg", info: "upgrade your castle" },
            5: { txt: "abilities", action: "folder", data: 3, img: "soldier_img", icon: "target", info: "research and use abilities" },
        },
        1: {    // sprites
            0: { txt: "soldier", cost: 15, action: "buyUnit", data: "soldier", img: "soldier_img", info: "solders are basic mele units" },
            // 1: { txt: "viking", cost: 15, action: "buyUnit", data: "viking", img: "viking_img", info: "vikings are basic mele units" },
            1: { txt: "archer", cost: 10, action: "buyUnit", data: "archer", img: "archer_img", info: "archers are ranged units that \nshoot 3 - 6 units forward" },
            2: { txt: "knight", cost: 35, action: "buyUnit", data: "knight", upgrade: "upgKnight", img: "knight_img", info: "knights are fast and strong,\nand will run past all your units\nto the front of the battlefield" }, // require: "upgKnight",
            3: { txt: "back", action: "folder", data: 0, img: "buttonBack_img", info: "go back to the previous folder" },
            4: { txt: "veteran", cost: 50, action: "buyUnit", data: "veteran", upgrade: "upgVeteran", img: "veteran_img", info: "the vetaran is a very strong\nunit that one-shots most enemies" },
            5: { txt: "ballista", cost: 30, action: "buyUnit", data: "ballista", upgrade: "upgBallista", img: "ballista_img", info: "ballistas bombard the enemy castle" }


        },
        2: {    //upgrades
            0: { txt: "upgrade", txt2: "gold", cost: "%upggold%", action: "upgrade", upgrade: "maxGold", data: "upgGold", img: "knight_img", icon: "goldUpg", info: "increases the gold you get every \n15 seconds\nthe cost increases for each \nupgrade" },
            1: { txt: "repair", txt2: "castle", cost: "%repaircastle%", action: "upgrade", upgrade: "repairCastle", data: "repairCastle", img: "knight_img", icon: "repair", info: "repairs the castle with 15 hp\nthe cost increases for each \nrepair" },
            2: { txt: "unlock", txt2: "knight", cost: 50, subText: "50", action: "upgrade", upgrade: "upgKnight", data: "upgKnight", img: "knight_img", info: "unlocks the knight, a fast and \nstrong unit that rushes to\nthe front" },
            3: { txt: "upgrade", txt2: "castle", cost: "%upgcastle%", action: "upgrade", upgrade: "upgCastle", data: "upgCastle", img: "knight_img", icon: "castleUpg", info: "upgrades the castle in three \nlevels, making it shoot projectiles \nat enemy troops and castle" },
            4: { txt: "back", action: "folder", data: 0, img: "buttonBack_img", info: "go back to the previous folder" },
            5: { txt: "unlock", txt2: "veteran", cost: 50, subText: "50", action: "upgrade", upgrade: "upgVeteran", data: "upgVeteran", img: "veteran_img", info: "unlocks the veteran, a very \nstrong unit that one-shots \nmost enemies" },
        },
        3: {
            0: { txt: "Take Dmg", cost: 1, action: "ability", data: "takedmg", abilityCooldown: 0, lvl: 2, img: "soldier_img", info: "makes your own tower take dmg \ngood if youre debugging" },
            // 0: { txt: "Arrows", cost: 2, action: "ability", data: "arrows", abilityCooldown: 1, lvl: 2, img: "soldier_img", icon: "arrows", info: "Shoots 7 arrows from the \ncastle onto the battlefield" },
            1: { txt: "Invincible", cost: 4, action: "ability", data: "invincible", abilityCooldown: 6, lvl: 3, img: "icons_img", icon: "invincible", info: "makes your units invincible for \na short while. \ntime it well!" },
            2: { txt: "Target", cost: 4, action: "ability", data: "target", abilityCooldown: 12, lvl: 4, img: "archer_img", icon: "target", info: "makes your archers shoot with \npin-point accuracy for a while" },
            3: { txt: "heal", cost: 3, action: "ability", data: "heal", abilityCooldown: 12, lvl: 1, img: "soldier_img", icon: "heal", info: "heal all units to max health" },
            4: { txt: "Sprint", cost: 3, action: "ability", data: "sprint", abilityCooldown: 8, lvl: 0, img: "soldier_img", icon: "sprint", info: "makes all units sprint across\nthe battlefield" },
            5: { txt: "back", action: "folder", data: 0, img: "buttonBack_img", info: "go back to the previous folder" },
            6: { txt: "upgrade", txt2: "ability", cost: "%upgability%", action: "upgrade", upgrade: "upgAbility", data: "upgAbility", img: "archer_img", icon: "castleUpg", info: "unlocks another ability \n(%abilitylevel%/5 unlocked) " },

        }
    },
    [ClanTypes.viking]: {
        0: {
            0: { txt: "", action: "hidden", data: -1, img: "", info: "" },
            1: { txt: "", action: "hidden", data: -1, img: "", info: "" },
            2: { txt: "", action: "hidden", data: -1, img: "", info: "" },
            3: { txt: "units", action: "folder", data: 1, img: "viking_img", info: "buy units to fight for you" },
            4: { txt: "upgrades", action: "folder", data: 2, img: "soldier_img", icon: "churchUpg", info: "upgrade your church, income and\nunlock new units" },
            5: { txt: "abilities", action: "folder", data: 3, img: "soldier_img", icon: "rage", info: "research and use abilities" },
        },
        1: {    // sprites
            0: { txt: "viking", cost: 15, action: "buyUnit", data: "viking", img: "viking_img", info: "vikings are basic mele units" },
            1: { txt: "spearman", cost: 15, action: "buyUnit", data: "spearman", img: "spearman_img", info: "Spearmen are ranged, but \nwith good mele attacks aswell" },
            2: { txt: "brute", cost: 35, action: "buyUnit", data: "brute", upgrade: "upgBrute", img: "brute_img", info: "brutes are rugged mele units\nwho will jump over the first\nenemy they encounter" }, // require: "upgKnight",
            3: { txt: "back", action: "folder", data: 0, img: "buttonBack_img", info: "go back to the previous folder" },
            4: { txt: "thor", cost: 50, action: "buyUnit", data: "thor", img: "thor_img", info: "veterans are very strong and \none-hits most units" },
            5: { txt: "longship", cost: 30, action: "buyUnit", data: "longship", img: "longship_img", upgrade: "upgBallista", info: "roll a longship onto the battlefield.\nLongships shoot at the enemy castle\nand hide vikings within." }
        },
        2: {    //upgrades
            0: { txt: "upgrade", txt2: "gold", cost: "%upggold%", action: "upgrade", upgrade: "maxGold", data: "upgGold", img: "knight_img", icon: "goldUpg", info: "will increase the gold you get \nevery 15 seconds. \nthe cost of this ability increases" },
            1: { txt: "repair", txt2: "church", cost: "%repaircastle%", action: "upgrade", upgrade: "repairCastle", data: "repairCastle", img: "knight_img", icon: "churchRepair", info: "repairs the church with 15 hp\nthe cost increases for each \nrepair" },
            2: { txt: "unlock", txt2: "brute", cost: 50, subText: "50", action: "upgrade", upgrade: "upgBrute", data: "upgBrute", img: "brute_img", info: "unlocks the brute, a strong mele \nunit that can jump over enemies" },
            3: { txt: "upgrade", txt2: "church", cost: "%upgcastle%", action: "upgrade", upgrade: "upgCastle", data: "upgCastle", img: "knight_img", icon: "churchUpg", info: "upgrades the stave church in \nthree levels, making it shoot \nprojectiles at enemy troops and \ncastle" },
            4: { txt: "back", action: "folder", data: 0, img: "buttonBack_img", info: "go back to the previous folder" },
            5: { txt: "unlock", txt2: "veteran", cost: 50, subText: "50", action: "upgrade", upgrade: "upgVeteran", data: "upgVeteran", img: "veteran_img", info: "work in progress \nshould be a viking unit here" },
            // 5: { txt: "Empty", cost: 2, action: "ability", data: "empty", abilityCooldown: 1, lvl: 0, img: "soldier_img", icon: "question", info: "nothing here yet" },

        },
        3: {
            // 0: { txt: "Take Dmg", cost: 1, action: "ability", data: "takedmg", abilityCooldown: 0, lvl: 2, img: "soldier_img", info: "makes your own tower take dmg \ngood if youre debugging" },
            0: { txt: "Throw", txt2: "viking", cost: 4, action: "posAbility", data: "viking_barrel", abilityCooldown: 1, lvl: 2, img: "soldier_img", icon: "vikingBarrel", info: "throw a barrel with a viking\nanywhere on the battlefireld" },
            1: { txt: "Lightning", cost: 1, action: "ability", data: "lightning", abilityCooldown: 1, lvl: 3, img: "soldier_img", icon: "question", info: "thunder!" },
            2: { txt: "Empty", cost: 2, action: "ability", data: "empty", abilityCooldown: 12, lvl: 4, img: "archer_img", icon: "question", info: "nothing here yet" },
            3: { txt: "Double", txt2: "Jump", cost: 3, action: "ability", data: "doublejump", abilityCooldown: 12, lvl: 1, img: "soldier_img", icon: "jump", info: "make your brutes jump again" },
            4: { txt: "Rage", cost: 4, action: "ability", data: "rage", abilityCooldown: 8, lvl: 0, img: "soldier_img", icon: "rage", info: "makes your vikings go\nberserk. Increases mele\nattack speed and jump\nlength." },
            5: { txt: "back", action: "folder", data: 0, img: "buttonBack_img", info: "go back to the previous folder" },
            6: { txt: "upgrade", txt2: "ability", cost: "%upgability%", action: "upgrade", upgrade: "upgAbility", data: "upgAbility", img: "archer_img", icon: "churchUpg", info: "unlocks another ability \n(%abilitylevel%/5 unlocked) " },

        }
    },
    [ClanTypes.eastern]: {
        0: {
            0: { txt: "", action: "hidden", data: -1, img: "", info: "" },
            1: { txt: "", action: "hidden", data: -1, img: "", info: "" },
            2: { txt: "", action: "hidden", data: -1, img: "", info: "" },
            3: { txt: "units", action: "folder", data: 1, img: "rocketeer_img", info: "buy units to fight for you" },
            4: { txt: "upgrades", action: "folder", data: 2, img: "soldier_img", icon: "pagodaUpg", info: "upgrade your pagoda, income and\nunlock new units" },
            5: { txt: "abilities", action: "folder", data: 3, img: "soldier_img", icon: "bigFlame", info: "research and use abilities" },
        },
        1: {    // sprites
            0: { txt: "warrior", cost: 10, action: "buyUnit", data: "warrior", img: "warrior_img", info: "warriors are basic mele units" },
            1: { txt: "firethrower", cost: 20, action: "buyUnit", data: "fireman", img: "fireman_img", info: "firethrowers carry a \nflamethrower and damage \nmultiple enemies at a time." }, // require: "upgKnight",
            2: { txt: "rocketeer", cost: 15, action: "buyUnit", data: "rocketeer", upgrade: "upgRocketeer", img: "rocketeer_img", info: "Rocketmen are ranged \nand shoot rockets." },
            3: { txt: "back", action: "folder", data: 0, img: "buttonBack_img", info: "go back to the previous folder" },
            4: { txt: "cannon2", cost: 50, action: "buyUnit", data: "cannoneer", img: "cannoneer_img", info: "veterans are very strong and \none-hits most units" },
            5: { txt: "cannon", cost: 50, action: "buyUnit", data: "cannoneer", upgrade: "upgBallista", img: "cannoneer_img", info: "veterans are very strong and \none-hits most units" },
        },
        2: {    //upgrades
            0: { txt: "upgrade", txt2: "gold", cost: "%upggold%", action: "upgrade", upgrade: "maxGold", data: "upgGold", img: "knight_img", icon: "goldUpg", info: "will increase the gold you get \nevery 15 seconds. \nthe cost of this ability increases" },
            1: { txt: "repair", txt2: "pagoda", cost: "%repaircastle%", action: "upgrade", upgrade: "repairCastle", data: "repairCastle", img: "knight_img", icon: "pagodaRepair", info: "repairs the church with 15 hp\nthe cost increases for each \nrepair" },
            2: { txt: "unlock", txt2: "rocketeer", cost: 50, subText: "50", action: "upgrade", upgrade: "upgRocketeer", data: "upgRocketeer", img: "rocketeer_img", info: "unlocks the rocketeer, a strong \nunit that can shoot rockets and\ndeal splash damage from afar" },
            3: { txt: "upgrade", txt2: "pagoda", cost: "%upgcastle%", action: "upgrade", upgrade: "upgCastle", data: "upgCastle", img: "knight_img", icon: "pagodaUpg", info: "upgrades the stave church in \nthree levels, making it shoot \nprojectiles at enemy troops and \ncastle" },
            4: { txt: "back", action: "folder", data: 0, img: "buttonBack_img", info: "go back to the previous folder" },
            5: { txt: "unlock", txt2: "veteran", cost: 50, subText: "50", action: "upgrade", upgrade: "upgVeteran", data: "upgVeteran", img: "veteran_img", info: "work in progress \nshould be a viking unit here" },
            // 5: { txt: "Empty", cost: 2, action: "ability", data: "empty", abilityCooldown: 1, lvl: 0, img: "soldier_img", icon: "question", info: "nothing here yet" },

        },
        3: {
            // 0: { txt: "Take Dmg", cost: 1, action: "ability", data: "takedmg", abilityCooldown: 0, lvl: 2, img: "soldier_img", info: "makes your own tower take dmg \ngood if youre debugging" },
            0: { txt: "Empty", cost: 2, action: "ability", data: "empty", abilityCooldown: 1, lvl: 2, img: "soldier_img", icon: "question", info: "nothing here yet" },
            1: { txt: "Empty", cost: 2, action: "ability", data: "empty", abilityCooldown: 1, lvl: 3, img: "soldier_img", icon: "question", info: "nothing here yet" },
            2: { txt: "Empty", cost: 2, action: "ability", data: "empty", abilityCooldown: 12, lvl: 4, img: "archer_img", icon: "question", info: "nothing here yet" },
            3: { txt: "bigger", txt2: "flame", cost: 4, action: "ability", data: "bigFlame", abilityCooldown: 8, lvl: 1, img: "soldier_img", icon: "bigFlame", info: "temporarly increases the range\nof your firethrowers" },
            4: { txt: "warrior", txt2: "shield", cost: 2, action: "ability", data: "shield", abilityCooldown: 8, lvl: 0, img: "soldier_img", icon: "shield", info: "Makes your warriors immobile,\nbut they take less damage" },
            5: { txt: "back", action: "folder", data: 0, img: "buttonBack_img", info: "go back to the previous folder" },
            6: { txt: "upgrade", txt2: "ability", cost: "%upgability%", action: "upgrade", upgrade: "upgAbility", data: "upgAbility", img: "archer_img", icon: "pagodaUpg", info: "unlocks another ability \n(%abilitylevel%/5 unlocked) " },
        }
    },
    [ClanTypes.wip]: {
        0: {
            0: { txt: "", action: "hidden", data: -1, img: "", info: "" },
            1: { txt: "", action: "hidden", data: -1, img: "", info: "" },
            2: { txt: "", action: "hidden", data: -1, img: "", info: "" },
            3: { txt: "units", action: "folder", data: 1, img: "rocketeer_img", info: "buy units" },
            4: { txt: "upgrades", action: "folder", data: 2, img: "soldier_img", icon: "pagodaUpg", info: "upgrade castle" },
            5: { txt: "abilities", action: "folder", data: 3, img: "soldier_img", icon: "bigFlame", info: "research and use abilities" },
        },
        1: {    // sprites
            0: { txt: "warrior", cost: 10, action: "buyUnit", data: "warrior", img: "warrior_img", info: "warriors are basic mele units" },
            1: { txt: "firethrower", cost: 20, action: "buyUnit", data: "fireman", img: "fireman_img", info: "brutes are rugged mele units\nwho will jump over the first\nenemy they encounter" }, // require: "upgKnight",
            2: { txt: "rocketeer", cost: 15, action: "buyUnit", data: "rocketeer", upgrade: "upgRocketeer", img: "rocketeer_img", info: "Rocketmen are ranged \nand shoot rockets." },
            3: { txt: "back", action: "folder", data: 0, img: "buttonBack_img", info: "go back to the previous folder" },
            4: { txt: "veteran", cost: 50, action: "buyUnit", data: "veteran", upgrade: "upgVeteran", img: "veteran_img", info: "veterans are very strong and \none-hits most units" },
            5: { txt: "ballista", cost: 30, action: "buyUnit", data: "ballista", upgrade: "upgBallista", img: "ballista_img", info: "ballistas shooty at castle" }
        },
        2: {    //upgrades
            0: { txt: "upgrade", txt2: "gold", cost: "%upggold%", action: "upgrade", upgrade: "maxGold", data: "upgGold", img: "knight_img", icon: "goldUpg", info: "will increase the gold you get \nevery 15 seconds. \nthe cost of this ability increases" },
            1: { txt: "repair", txt2: "pagoda", cost: "%repaircastle%", action: "upgrade", upgrade: "repairCastle", data: "repairCastle", img: "knight_img", icon: "pagodaRepair", info: "repairs the church with 15 hp\nthe cost increases for each \nrepair" },
            2: { txt: "unlock", txt2: "rocketeer", cost: 50, subText: "50", action: "upgrade", upgrade: "upgRocketeer", data: "upgRocketeer", img: "rocketeer_img", info: "unlocks the rocketeer, a strong \nunit that can shoot rockets and\ndeal splash damage from afar" },
            3: { txt: "upgrade", txt2: "pagoda", cost: "%upgcastle%", action: "upgrade", upgrade: "upgCastle", data: "upgCastle", img: "knight_img", icon: "pagodaUpg", info: "upgrades the stave church in \nthree levels, making it shoot \nprojectiles at enemy troops and \ncastle" },
            4: { txt: "back", action: "folder", data: 0, img: "buttonBack_img", info: "go back to the previous folder" },
            5: { txt: "unlock", txt2: "veteran", cost: 50, subText: "50", action: "upgrade", upgrade: "upgVeteran", data: "upgVeteran", img: "veteran_img", info: "work in progress \nshould be a viking unit here" },
            // 5: { txt: "Empty", cost: 2, action: "ability", data: "empty", abilityCooldown: 1, lvl: 0, img: "soldier_img", icon: "question", info: "nothing here yet" },

        },
        3: {
            // 0: { txt: "Take Dmg", cost: 1, action: "ability", data: "takedmg", abilityCooldown: 0, lvl: 2, img: "soldier_img", info: "makes your own tower take dmg \ngood if youre debugging" },
            0: { txt: "Empty", cost: 2, action: "ability", data: "empty", abilityCooldown: 1, lvl: 2, img: "soldier_img", icon: "question", info: "nothing here yet" },
            1: { txt: "Empty", cost: 2, action: "ability", data: "empty", abilityCooldown: 1, lvl: 3, img: "soldier_img", icon: "question", info: "nothing here yet" },
            2: { txt: "Empty", cost: 2, action: "ability", data: "empty", abilityCooldown: 12, lvl: 4, img: "archer_img", icon: "question", info: "nothing here yet" },
            3: { txt: "Empty", cost: 2, action: "ability", data: "empty", abilityCooldown: 12, lvl: 1, img: "soldier_img", icon: "question", info: "nothing here yet" },
            4: { txt: "Empty", cost: 2, action: "ability", data: "empty", abilityCooldown: 8, lvl: 0, img: "soldier_img", icon: "question", info: "nothing here yet" },
            5: { txt: "back", action: "folder", data: 0, img: "buttonBack_img", info: "go back to the previous folder" },
            6: { txt: "upgrade", txt2: "ability", cost: "%upgability%", action: "upgrade", upgrade: "upgAbility", data: "upgAbility", img: "archer_img", icon: "pagodaUpg", info: "unlocks another ability \n(%abilitylevel%/5 unlocked) " },
        }
    }
}


let minProp: keyof Sprite;

// let minprop2 = Object.



const POS_ABILITY = [
    {
        startPos: 260,
        min: 20,
        max: 260,
    },
    {
        startPos: 20,
        min: 60,
        max: 300,
    }
]




interface ABILITY_INTERFACE {
    duration: number,
    affectNewlySpawnedUnits: boolean,
    needAbility: boolean,
    requiredAbility: string,
    hasEffect: boolean,
    posAbility: boolean,
    targetOtherTeam?: boolean,
}

const ABILITIES_LIST: { [key: string]: ABILITY_INTERFACE } = {
    lightning: {
        duration: 8,
        affectNewlySpawnedUnits: false,
        needAbility: false,
        requiredAbility: "",
        hasEffect: false,
        posAbility: false,
        targetOtherTeam: true,
    },
    viking_barrel: {
        duration: -1,
        affectNewlySpawnedUnits: false,
        needAbility: false,
        requiredAbility: "",
        hasEffect: false,
        posAbility: true,
    },
    invincible: {
        duration: 8,
        affectNewlySpawnedUnits: true,
        needAbility: false,
        requiredAbility: "",
        hasEffect: false,
        posAbility: false
    },
    target: {
        duration: 8,
        affectNewlySpawnedUnits: true,
        needAbility: true,
        requiredAbility: "targetfire",
        hasEffect: false,
        posAbility: false,
    },
    sprint: {
        duration: 8,
        affectNewlySpawnedUnits: true,
        needAbility: false,
        requiredAbility: "",
        hasEffect: false,
        posAbility: false,
    },
    rage: {
        duration: 8,
        affectNewlySpawnedUnits: true,
        needAbility: true,
        requiredAbility: "rage",
        hasEffect: false,
        posAbility: false,
    },
    shield: {
        duration: 8,
        affectNewlySpawnedUnits: false,
        needAbility: true,
        requiredAbility: "shield",
        hasEffect: false,
        posAbility: false,
    },
    bigFlame: {
        duration: 8,
        affectNewlySpawnedUnits: true,
        needAbility: true,
        requiredAbility: "bigFlame",
        hasEffect: false,
        posAbility: false,
    },
}