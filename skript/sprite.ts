const ARROW_CONSTS = {

}




class Effect {
    pos: { x: number; y: number; };
    name: string;
    frame: number;
    dateLastFrame: number;
    // DRAW_SIZE = 30; // sprites ritas med storlek 24, och har bredd 32. denna ritas med 37.5, har bredd 50.
    team: number;
    framerate: number;
    DRAW_SIZE: { x: number; y: number; };
    imgSize: { x: number; y: number; };
    framesPerRow: number;
    totalFrames: number;
    totalRows: number;

    constructor(pos: { x: number, y: number }, name: string, framerate: number, team: number, size: number) {
        this.pos = { x: pos.x, y: pos.y };
        this.name = name;
        this.frame = 0;
        this.framerate = framerate
        this.dateLastFrame = Date.now()
        this.team = team;
        //
        this.DRAW_SIZE = { x: EFFECT_DIRECTORY[name].drawSize.x * size, y: EFFECT_DIRECTORY[name].drawSize.y * size };
        this.imgSize = EFFECT_DIRECTORY[name].imgSize
        this.framesPerRow = EFFECT_DIRECTORY[name].framesPerRow;
        this.totalFrames = EFFECT_DIRECTORY[name].totalFrames;
        this.totalRows = Math.ceil(this.totalFrames / this.framesPerRow)
    }


    checkDead(game: Game, index: number) {
        if (this.frame >= this.totalFrames) {
            index > -1 ? game.effects.splice(index, 1) : false
        }
    }

    draw() {

        let imageSizex = this.imgSize.x;
        let imageSizey = this.imgSize.y;
        if (Date.now() - this.dateLastFrame > this.framerate) {
            this.frame += 1
            this.dateLastFrame = Date.now(); // - (this.dateLastFrame - 300);
            if (this.frame >= this.totalFrames) {
                // console.log(this.frame, Math.floor(this.frame / this.framesPerRow))
                return;
            }
        }
        let frame = this.frame;

        ctx.drawImage(Images[this.name],
            imageSizex * (frame % this.framesPerRow),
            imageSizey * (Math.floor(frame / this.framesPerRow) + this.team * this.totalRows),
            imageSizex,
            imageSizey,

            (this.pos.x - this.DRAW_SIZE.x / 2) * S,
            (this.pos.y - this.DRAW_SIZE.y / 2) * S,
            this.DRAW_SIZE.x * S,
            this.DRAW_SIZE.y * S
        );

    }


}



class Projectile {
    pos: { x: number; y: number; };
    vel: { vx: number; vy: number; };
    team: any;
    type: string;
    dmg: number;
    ARROW_LEN: number[];
    ARROW_COLORS_2: { r: number; g: number; b: number; }[];
    ARROW_SIZE: number;
    DRAW_SIZE: number;
    startPos: number;
    deathFrame: number;
    lastFrame: number;
    dead: boolean;
    frame: number;
    angle: number;
    isDying: boolean;
    constructor(pos: { x: number; y: number; }, vel: { vx: number; vy: number; }, team: number, dmg: number, isUpdate: boolean = false, newData: Projectile | boolean = false, type = "arrow") {
        this.pos = { x: pos.x, y: pos.y };
        this.vel = { vx: vel.vx, vy: vel.vy };
        this.team = team;
        this.dmg = dmg;
        this.type = type;
        if (this.type == "arrow") {

            this.ARROW_LEN = [0.6, 3, 1];
            //this.ARROW_COLORS = ['#DDDDDD', '#8B3F2B', '#FFFFFF'];
            this.ARROW_COLORS_2 = [{ r: 221, g: 221, b: 221 }, { r: 129, g: 63, b: 43 }, { r: 255, g: 255, b: 255 }]
            //this.ARROW_COLORS_3 = ['#DDDDDD', '#6F2B1F', '#8B3F2B', '#8B3F2B', '#FFFFFF'];
            this.ARROW_SIZE = .6;
        }
        if (this.type == "barrel") {
            this.isDying = false;

            this.DRAW_SIZE = 10;
            this.frame = 0;
            this.lastFrame = Date.now();

        }
        else if (this.type == "ballista") {
            this.DRAW_SIZE = 14;
            this.startPos = this.pos.x;
            this.deathFrame = 0
            this.lastFrame = Date.now()
        }
        else if (this.type == "spear") {
            this.ARROW_LEN = [0.9, 7];
            //this.ARROW_COLORS = ['#DDDDDD', '#8B3F2B', '#FFFFFF'];
            this.ARROW_COLORS_2 = [{ r: 221, g: 221, b: 221 }, { r: 129, g: 63, b: 43 }]
            //this.ARROW_COLORS_3 = ['#DDDDDD', '#6F2B1F', '#8B3F2B', '#8B3F2B', '#FFFFFF'];
            this.ARROW_SIZE = .7;

        }
        else if (this.type == "rocket") {
            const TAU = Math.PI * 2
            this.DRAW_SIZE = 10;
            this.frame = 0;
            this.angle = TAU / 4 + this.vel.vx;
            this.deathFrame = 0
            this.lastFrame = Date.now()
        }


        this.dead = false;
        // this.colors = ['#DDDDDD', '#6F2B1F', '#8B3F2B', '#8B3F2B', '#8B3F2B', '#8B3F2B', '#FFFFFF']


        if (isUpdate) { this.updateData(newData) }
        else {
            if (this.type == "rocket") {
                playSoundEffect("firework");
            }
            else {
                playSoundEffect("arrow")
            }
        }
    }

    updateData(newData) {
        console.log("olddata:", newData)
        for (var i in newData) {
            this[i] = newData[i];
        }
    }

    getData() {
        let data = this;
        console.log("aData:", data)
        console.log("newData:", { pos: this.pos, vel: this.vel, team: this.team, dmg: this.dmg })
        return data;
    }

    moveBal() {
        let a = 10
        let castelHeight = 59
        this.pos.x += this.vel.vx * fpsCoefficient / 100;
        this.pos.y += (castelHeight - this.pos.y) / 40
    }

    moveRocket() {
        this.pos.x += this.vel.vx * fpsCoefficient / 100;
        this.pos.y += this.vel.vy * fpsCoefficient / 100;


        this.vel.vy += (-110 * Math.sin(this.angle) + GRAVITY) * fpsCoefficient / 100;
        this.vel.vx += (1 - 2 * this.team) * (5 + 45 * Math.cos(this.angle)) * fpsCoefficient / 100;
        this.angle -= 1.3 * fpsCoefficient / 100;
        // console.log(this.vel.vy, this.angle)

    }

    move() {
        if (this.type == "ballista") {
            this.moveBal();
            return
        }
        else if (this.type == "rocket") {
            this.moveRocket();
            return
        }
        this.pos.x += this.vel.vx * fpsCoefficient / 100;
        this.pos.y += this.vel.vy * fpsCoefficient / 100;
        this.vel.vy += GRAVITY * fpsCoefficient / 100;
        // console.log("proj loc:", this.pos.x, this.pos.y)

        //this.predictTouchDown()
    }

    checkHitRocket() {
        if (this.pos.y > HEIGHT - 5) {
            this.dead = true;

            playSoundEffect("explode");
            game.addEffect(this.pos.x, HEIGHT, "explosion", 60, this.team, 1)

            for (var i in game.sprites) {
                if (this.team != game.sprites[i].team) {
                    //console.log("disty:", dist(this.pos, game.sprites[i].pos), game.sprites[i].size);
                    if (dist(this.pos, game.sprites[i].pos) - game.sprites[i].size < ROCKET_SPLASH_RADIUS) {
                        // console.log("raketbombad")
                        game.sprites[i].takeDmg(this.dmg)
                    }
                }
            }
        }
    }

    checkHitBallista() {
        if (this.deathFrame == 0) {
            if (this.team == 0 && this.pos.x > 270) {
                game.players[getOtherTeam(this.team)].takeDmg(this.dmg)
                this.ballistaDeathAnim();
            }
            else if (this.team == 1 && this.pos.x < 50) {
                game.players[getOtherTeam(this.team)].takeDmg(this.dmg)
                this.ballistaDeathAnim();
            }
            for (var i in game.projectiles) {
                let target = game.projectiles[i];
                if (target.type == "ballista" && this.team != target.team) {
                    //console.log("disty:", dist(this.pos, game.projectiles[i].pos), game.projectiles[i].size);
                    if (dist(this.pos, target.pos) < 5) {
                        console.log("hejhej")
                        target.ballistaDeathAnim() // kom på nåt sätt så den inte kör hela tiden
                        playSoundEffect("arrow_hit")
                        this.ballistaDeathAnim()
                    }
                }
            }
        }


    }


    ballistaDeathAnim() {
        if (Date.now() - this.lastFrame > 20) {
            this.deathFrame += 1
            this.lastFrame = Date.now()
            if (this.deathFrame > 5) {
                this.dead = true
            }
        }


    }



    checkHit(_index) {
        if (this.type == "ballista") {
            this.checkHitBallista()
            return;
        }
        else if (this.type == "rocket") {
            this.checkHitRocket();
            return;
        }
        else if (this.type == "barrel") {
            this.checkHitBarrel();
            return;
        }
        else if (this.pos.y > HEIGHT - 5) {
            for (var i in game.sprites) {
                if (this.team != game.sprites[i].team) {
                    //console.log("disty:", dist(this.pos, game.sprites[i].pos), game.sprites[i].size);
                    if (dist(this.pos, game.sprites[i].pos) < game.sprites[i].size) {
                        console.log("hejhej")
                        game.sprites[i].takeDmg(this.dmg)
                        playSoundEffect("arrow_hit")
                        this.dead = true;
                        return;
                    }
                }
            }
        }
    }
    checkDead(index) {
        // if (this.dead || this.pos.y > HEIGHT) {
        if (this.dead) {
            index > -1 ? game.projectiles.splice(index, 1) : false
        }
        else if ((this.type == "arrow" || this.type == "spear") && this.pos.y > HEIGHT) {
            index > -1 ? game.projectiles.splice(index, 1) : false

        }
    }


    getVec() {
        var hyp = Math.sqrt(this.vel.vx * this.vel.vx + this.vel.vy * this.vel.vy)
        return { dx: this.vel.vx / hyp, dy: this.vel.vy / hyp }
    }

    predictTouchDown() {
        var acceleration = GRAVITY / 2
        var t_0 = (- this.vel.vy + Math.sqrt(this.vel.vy * this.vel.vy - 4 * acceleration * (this.pos.y - 100))) / (2 * acceleration)
        console.log(this.vel.vx * t_0 + this.pos.x)
    }


    drawRocket() {

        const TAU = Math.PI * 2
        let frame = (this.frame + 1) % 4;
        this.frame = frame
        let angle = 0;
        let imageSize = 16

        if (this.angle + TAU > TAU * 1.2) {
            angle = 0;
        }
        else if (this.angle + TAU > TAU * 1.10) {
            angle = 1
        }
        else if (this.angle + TAU > TAU * 1.0) {
            angle = 2
        }
        else if (this.angle + TAU > TAU * .95) {
            angle = 3
        }
        else if (this.angle + TAU > TAU * .9) {
            angle = 4
        }
        else if (this.angle + TAU > TAU * .85) {
            angle = 5
        }
        else if (this.angle + TAU > TAU * .8) {
            angle = 5
        }
        else if (this.angle + TAU > TAU * .7) {
            angle = 6
        }
        else {
            angle = 6
        }
        // else if (this.vel.vy < 0.5) {
        //     angle = 2
        // }


        ctx.drawImage(Images["rocket_projectile"],
            imageSize * (frame + this.team * 4),
            imageSize * (angle),
            imageSize,
            imageSize,

            (this.pos.x - this.DRAW_SIZE / 2) * S,
            (this.pos.y - this.DRAW_SIZE / 2) * S,
            this.DRAW_SIZE * S,
            this.DRAW_SIZE * S
        );

    }

    drawBallista() {
        let castelHeight = 59

        let frame = 1
        let imageSize = 16
        let isDying = 0

        if (this.pos.y - castelHeight < 5) {
            frame = 4
        }
        else if (this.pos.y - castelHeight < 12) {
            frame = 3
        }
        else if (this.pos.y - castelHeight < 18) {
            frame = 2
        }
        if (this.deathFrame != 0) {
            frame = this.deathFrame
            console.log("wtf mannen")
            isDying = 32;
            this.ballistaDeathAnim();
        }


        ctx.drawImage(Images["ballista_projectile"],
            imageSize * frame,
            imageSize * (this.team) + isDying,
            imageSize,
            imageSize,

            (this.pos.x - this.DRAW_SIZE / 2) * S,
            (this.pos.y - this.DRAW_SIZE / 2) * S,
            this.DRAW_SIZE * S,
            this.DRAW_SIZE * S
        );

    }

    checkHitBarrel() {
        if (this.pos.y > HEIGHT - 3 && this.isDying == false) {
            this.isDying = true;
            this.frame = 0;
            this.vel = { vx: getDirection(this.team) * 7, vy: -15 }
            playSoundEffect("barrel_hit");
            // game.addEffect(this.pos.x, HEIGHT, "explosion", 60, this.team, 1)
            console.log("impactpoint:", this.pos.x - BASE_POS[this.team].x)
            game.addSprite("viking", this.team, 0, this.pos.x);

        }
        else if (this.isDying == true && this.frame >= 6) {
            this.dead = true;
        }
    }

    drawBarrel() {

        const TAU = Math.PI * 2
        let frame = this.frame;
        if (Date.now() - this.lastFrame > 100) {
            this.lastFrame = Date.now()
            frame = (frame + 1) % 8;
            this.frame = frame
        }


        let imageSize = 16


        ctx.drawImage(Images["barrel_projectile"],
            imageSize * (frame),
            imageSize * (Number(this.isDying) * 3),
            imageSize,
            imageSize,

            (this.pos.x - this.DRAW_SIZE / 2) * S,
            (this.pos.y - this.DRAW_SIZE / 2) * S,
            this.DRAW_SIZE * S,
            this.DRAW_SIZE * S
        );

        if (!this.isDying) {
            ctx.drawImage(Images["barrel_projectile"],
                imageSize * (frame),
                imageSize * 1,
                imageSize,
                imageSize,

                (this.pos.x - this.DRAW_SIZE / 2) * S,
                (103 - this.DRAW_SIZE / 2) * S,
                this.DRAW_SIZE * S,
                this.DRAW_SIZE * S
            );
        }




    }

    draw() {
        if (this.type == "ballista") {
            this.drawBallista();
            return
        }
        else if (this.type == "rocket") {
            this.drawRocket()
            return
        }
        else if (this.type == "barrel") {
            this.drawBarrel();
            return
        }
        let lastPos = { x: this.pos.x, y: this.pos.y }
        let { dx, dy } = this.getVec();
        ctx.lineWidth = this.ARROW_SIZE * S;
        if (ARROW_GRAPHICS_LEVEL != 0) {
            for (var i = 0; i < this.ARROW_LEN.length; i++) {
                ctx.beginPath();
                if (ARROW_GRAPHICS_LEVEL > 1) { ctx.strokeStyle = getShadedColorCode(this.ARROW_COLORS_2[i].r, this.ARROW_COLORS_2[i].g, this.ARROW_COLORS_2[i].b) }
                else { ctx.strokeStyle = getColorCode(this.ARROW_COLORS_2[i].r, this.ARROW_COLORS_2[i].g, this.ARROW_COLORS_2[i].b) };
                // ctx.strokeStyle = this.ARROW_COLORS[i]
                ctx.moveTo(lastPos.x * S, lastPos.y * S);
                let endPos = {
                    x: lastPos.x - dx * this.ARROW_LEN[i], y: lastPos.y - dy * this.ARROW_LEN[i]
                };
                ctx.lineTo(endPos.x * S, endPos.y * S);
                lastPos = { x: endPos.x, y: endPos.y };
                ctx.stroke();
            }
        }
        else {
            let totARROW_LEN = this.ARROW_LEN.reduce((a, b) => a + b, 0)
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.moveTo(lastPos.x * S, lastPos.y * S);
            let endPos = { x: lastPos.x - dx * totARROW_LEN, y: lastPos.y - dy * totARROW_LEN };
            ctx.lineTo(endPos.x * S, endPos.y * S);
            ctx.stroke();
        }

    }
}





class Sprite {
    pos: { x: any; y: any; };
    name: string;
    imageName: string;
    uniqeId: number;
    frameDelay: number;
    currentFrame: number;
    animTimeMult: number;
    direction: number;
    team: any;
    currentAnimation: SpriteCurAnim;
    currentSpeed: number;
    speed: number;
    state: SpriteCurState;
    isWalking: boolean;
    DRAW_SIZE: number;

    // ATTACK
    lastAtkCycleDate: number;
    lastStartOfAtkCycleDate: any;
    lastDmgdTime: number;
    hasLowOpactity: any;
    drawInvisible: boolean;
    invincible: boolean;
    // activeEffects: Set<string>;
    activeEffList: String[];
    animations: { [key in SpriteCurAnim]: SpriteAnimation };
    // animations: { [key in SpriteCurAnim]: SpriteAnimation };
    atkDelay: any;
    img: string;
    abilities: any;
    dmg: any;
    range: number;
    atkSpeed: number;
    meleDmg: any;
    hp: any;
    meleRange: number;
    row: number;

    // abilities
    drawSpriteYOffset: number;
    startJumpDate: number;
    imageSize: number;
    size: number;
    jumpState: number;
    hasJumped: number;
    armor: number;
    isCurSpecAnim: boolean;
    deathDate: number;
    constructor(x: number, y: number, name: string, team: any, isUpdate: boolean, newData: any) {
        //console.log(x, y, name, team, isUpdate, "newdata:", newData)
        if (isUpdate) { this.updateData(newData); }
        else {
            this.pos = { x: x, y: y };
            this.name = name
            this.imageName = this.name;
            this.uniqeId = Math.floor(100000000 * Math.random());
            this.animations = STATS[this.name].animations;
            // this.animations = {
            //     idle: new Animation(32, 0, 8, 60, true),
            //     walk: new Animation(32, 1, 8, 20, true),
            //     attack: new Animation(32, 2, 7, 20, false),
            // };
            this.frameDelay = 20;    //how many ms left until next frame
            this.currentFrame = 0;
            this.animTimeMult = 1;  //makes sprint look better

            this.direction = 1
            this.team = team;
            //jahaaaa. det låter ju svinkul. Men då kan man väll bekosta sig en tävlingsgrimma. Eller åt minstonde


            this.setStats();

            this.currentAnimation = SpriteCurAnim.idle
            this.currentSpeed = this.speed
            this.state = SpriteCurState.idle

            this.isWalking = false //helps to make atk anim better

            this.DRAW_SIZE = 24 * (this.imageSize / 32);
            // this._last0frame = Date.now();  //not important, debugging

            //attack
            this.lastAtkCycleDate = START_TIME;
            this.lastStartOfAtkCycleDate = null;

            this.lastDmgdTime = START_TIME
            this.hasLowOpactity = null;
            this.drawInvisible = false;
            this.invincible = false;
            this.drawSpriteYOffset = 0;
            this.deathDate = -1;

            this.activeEffList = []
            // this.activeEffects = new Set();
            for (var abilityIdx in game.players[this.team].activeAbilities) {
                var abilityName = game.players[this.team].activeAbilities[abilityIdx]
                this.activateAbility(abilityName)
            }
            // if (game.players[this.team].checkAbility("sprint")) {
            //     this.activateAbility("sprint")
            // }
            // if (game.players[this.team].checkAbility("rage")) {
            //     this.activateAbility("rage")
            // }
            // this.speed *= 5
        }

    }

    updateData(newData: { [x: string]: any; activeEffects: any; }) {
        console.log("newData:", newData)
        for (var i in newData) {
            this[i] = newData[i];
        }

        this.animations = STATS[this.name].animations;

        // this.activeEffects = new Set();
        // for (var i in newData.activeEffects) {
        //     this.activeEffects.add(i)
        // }
    }

    getData() {
        let data = this;
        return data;
    }

    setStats() {
        if (this.name in STATS) {
            for (var stat in STATS[this.name]) {
                this[stat] = STATS[this.name][stat]
            }
            // this.abilities = new Set(UNIQE[this.name])
        }
        else { console.log("unknown sprite", this.name) };
        this.atkDelay = (IS_ONLINE) ? this.atkDelay - ATK_DELAY_REDUCED_ONLINE : this.atkDelay;


        if (this.team == 0) {
            this.direction = 1;
            this.img += "_blue"
        }
        else if (this.team == 1) {
            this.direction = -1
        }
    }

    addActiveEffects(name: string) {
        if (this.activeEffList.includes(name)) {
            console.log("the sprite already has this effect")
        }
        else {
            this.activeEffList.push(name)
        }
    }

    hasActiveEffect(name: string) {
        return this.activeEffList.includes(name);
    }

    removeActiveEffects(name: string) {
        if (this.activeEffList.includes(name)) {
            this.activeEffList = this.activeEffList.filter(e => e !== name);
            // var index = this.activeEffList.indexOf(name);
            // if (index !== -1) {
            //     this.activeEffList.splice(index, 1);
            // }
        }
        else {
            console.log("could not remove effect since unit does not have it")
        }
    }



    activateAbility(name: string) {
        if (name == "invincible") {
            this.armor = 99;
            this.hasLowOpactity = true;
        }
        else if (name == "target") {
        }
        else if (name == "sprint") {
            this.speed += 10.1
            this.animTimeMult /= 2
        }
        else if (name == "rage") {
            this.atkSpeed *= 0.5
            this.drawSpriteYOffset = 4;
            this.armor = -1;
        }
        else if (name == "shield") {
            this.currentFrame = 0;
            this.isCurSpecAnim = true;
            this.armor = 2;
            this.atkDelay = 9999;
            this.speed = 0;
        }
        else if (name == "bigFlame") {
            this.range *= 1.8;
        }
        else {
            console.log("this effect:", name, "is not known, and cannot be added")
            return
        }
        this.addActiveEffects(name)
    }

    deactivateAbility(name: string) {
        if (!this.hasActiveEffect(name)) {
            console.log("the effect", name, "was asked to be removed from a", this.name, "sprite. however we only have effects", this.activeEffList, "so nothing happens. weird.")
            return;
        }
        // if (!this.activeEffects.has(name)) {
        //     console.log("the effect", name, "was asked to be removed from a", this.name, "sprite. however we only have effects", this.activeEffects, "so nothing happens. weird.")
        //     // return
        // }
        // this.activeEffects.delete(name)
        if (name == "invincible") {
            this.armor = 0;
            this.hasLowOpactity = false;
        }
        else if (name == "target") {
        }
        else if (name == "sprint") {
            this.speed = STATS[this.name].speed;
            this.animTimeMult *= 2
        }
        else if (name == "rage") {
            this.atkSpeed *= 2
            this.drawSpriteYOffset = 0;
            this.armor = 0;
        }
        else if (name == "shield") {
            this.isCurSpecAnim = false;
            this.armor = 0;
            this.atkDelay = STATS[this.name].atkDelay;
            this.speed = STATS[this.name].speed;
        }
        else if (name == "bigFlame") {
            this.range /= 1.8;
        }
        else {
            console.log("this effect:", name, "is not known, and cannot be removed")
            return
        }
        this.removeActiveEffects(name)
    }



    move() {
        let firstXpos = this.pos.x


        if (this.jumpState == 1) {
            this.state = SpriteCurState.special;
            this.currentAnimation = SpriteCurAnim.special;
            const JUMP_HEIGHT = 20
            const JUMP_CHARGE_TIME = 300 // milliseconds
            const JUMP_DURATION = 1.3 // adjust animation speed aswell in SpriteCurAnim.jump in globals
            var JUMP_SPEED_MULT = 3.5
            if (this.hasActiveEffect("rage")) {
                JUMP_SPEED_MULT = 6
            }
            let s = ((Date.now() - (this.startJumpDate + JUMP_CHARGE_TIME)) / 1000) / (JUMP_DURATION)
            this.pos.y = HEIGHT;
            if (s > 0) {
                this.pos.x += JUMP_SPEED_MULT * this.direction * this.currentSpeed * fpsCoefficient / 100;
                this.pos.y = 100 + JUMP_HEIGHT * 4 * (s - 0) * (s - 1);
                if (s > 1) {
                    this.jumpState = 0;
                    this.row = 0;
                    this.pos.y = 100;
                    this.state = SpriteCurState.walk;
                    this.currentAnimation = SpriteCurAnim.walk;
                }
            }

        }

        else if (this.isCurSpecAnim) {
            this.pos.x += this.direction * this.currentSpeed * fpsCoefficient / 100;
            // this.setState("walk", -1, "mooove")
            this.state = SpriteCurState.special
            this.currentAnimation = SpriteCurAnim.special
        }
        else {
            this.pos.x += this.direction * this.currentSpeed * fpsCoefficient / 100;
            if (this.currentSpeed < 0) {
                console.log("movementspeed is lower than 0: ", this.currentSpeed, "and speed is:", this.speed);

            }
            // this.setState("walk", -1, "mooove")
            this.state = SpriteCurState.walk
        }
        let secondXPos = this.pos.x
        if (this.team == 0 && secondXPos < firstXpos) {
            console.log("this unit is moving backwards")
        }

    }

    spriteShootProjectile(shouldTargetNext = false) {

        if (this.abilities.includes("ballista")) {
            game.shootProjectile(
                { x: this.pos.x, y: this.pos.y - 5 },
                {
                    vx: this.range * 10 * this.direction,
                    vy: this.range * -10
                },
                this.team, this.dmg,
                IS_ONLINE, "ballista");
            return
        }
        else if (this.abilities.includes("spear")) {
            let vel = { vx: (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * 10 * this.direction, vy: (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * -10 * ARCHER_TRAJECTORY }
            // console.log("shooting spear with vel:", vel)
            game.shootProjectile(
                { x: this.pos.x, y: this.pos.y - 5 },
                {
                    vx: vel.vx,
                    vy: vel.vy
                },
                this.team, this.dmg,
                IS_ONLINE, "spear");
            return
        }
        else if (this.abilities.includes("rocket")) {
            let vx = this.range * (Math.random() - 0.5)
            if (shouldTargetNext) {
                vx -= TAU / 6
                vx = CLOSE_SHOOT_ANGLE
            }
            game.shootProjectile(
                { x: this.pos.x + getDirection(this.team) * 3, y: this.pos.y - 6 },
                {
                    vx: vx,
                    vy: 0
                },
                this.team, this.dmg,
                IS_ONLINE, "rocket");
            return
        }
        else if (this.abilities.includes("flamethrower")) {
            let scaleFactor = 1;
            let effectName = "flame";
            if (this.hasActiveEffect("bigFlame")) { scaleFactor = 1; effectName = "flamebig"; }
            game.addEffect(this.pos.x + getDirection(this.team) * 35 * scaleFactor, this.pos.y - 6 * scaleFactor, effectName, 30, this.team, scaleFactor);
            playSoundEffect("flamethrower");
            let directionalPosx = this.pos.x * getDirection(this.team)
            for (var i in game.sprites) {
                if (this.team != game.sprites[i].team) {
                    //console.log("disty:", dist(this.pos, game.sprites[i].pos), game.sprites[i].size);
                    if (directionalPosx < game.sprites[i].pos.x * getDirection(this.team) && dist(this.pos, game.sprites[i].pos) < game.sprites[i].size + 10 * this.range) {// dist(this.pos, game.sprites[i].pos) < game.sprites[i].size + 10) {
                        console.log("uppeldad")
                        // setTimeout(function () { game.sprites[i].takeDmg(this.dmg); }, 200);
                        game.sprites[i].takeDmg(this.dmg)
                    }
                }
            }
            return
        }
        else if (this.hasActiveEffect("target") || (shouldTargetNext && this.abilities.includes("targetCloseRange"))) {
            let nextEnemy = game.distToNextSprite(this, this.getOtherTeam())
            if (nextEnemy.len < 80) {
                let { vel_x, vel_y } = calcProjectilePower(this.pos, nextEnemy.sprite.pos, ARCHER_TRAJECTORY);
                game.shootProjectile(
                    { x: this.pos.x, y: this.pos.y - 5 },
                    { vx: vel_x * this.direction, vy: -vel_y },
                    this.team, this.dmg,
                    IS_ONLINE, "arrow"
                )
                return;
            }
        }
        // console.log("this point should never be reached. please debug!")
        else {
            game.shootProjectile(
                { x: this.pos.x, y: this.pos.y - 5 },
                {
                    vx: (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * 10 * this.direction,
                    vy: (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * -10 * ARCHER_TRAJECTORY
                },
                this.team, this.dmg,
                IS_ONLINE, "arrow");

        }

    }





    attack(victim: Sprite) {
        this.currentSpeed = 0;
        if (this.isWalking) {
            this.isWalking = false;
            this.currentAnimation = SpriteCurAnim.idle
        }
        //this.setState("attack", -1, "attacking");

        let timeSinceLastAttackCycle = Date.now() - this.lastAtkCycleDate;
        let isRagingButAlsoRanged = (victim == undefined && this.hasActiveEffect("rage")) ? 2 : 1;
        if (timeSinceLastAttackCycle > this.atkSpeed * isRagingButAlsoRanged) { //start attack animation: ;
            this.currentFrame = 0;
            this.currentAnimation = SpriteCurAnim.attack
            this.lastAtkCycleDate = Date.now();
            this.lastStartOfAtkCycleDate = Date.now();
            if (victim != undefined) {
                if (this.abilities.includes("meleClose")) {
                    this.currentAnimation = SpriteCurAnim.special
                }
            }
        }

        let timeSinceStartOfAtk = Date.now() - this.lastStartOfAtkCycleDate;
        if (timeSinceStartOfAtk > this.atkDelay && this.lastStartOfAtkCycleDate !== null) { // atks if its enough time since atkstart
            if (this.range > 0) {
                // this.spriteShootProjectile(true)
                console.log(victim)
                if (victim != undefined) {
                    if (this.abilities.includes("meleClose")) {
                        playSoundEffect("sword")
                        this.currentAnimation = SpriteCurAnim.special
                        victim.takeDmg(this.meleDmg)
                        playSoundEffect("damage");
                    }
                    else if (this.abilities.includes("targetCloseRange")) {
                        this.spriteShootProjectile(true);
                    }
                    else {
                        this.spriteShootProjectile(false);
                    }
                }
                else {
                    this.spriteShootProjectile(false);
                }
            }
            else {
                playSoundEffect("sword")
                victim.takeDmg(this.dmg)
                playSoundEffect("damage");
                if (this.abilities.includes("whirlwind")) {
                    let behindSprite = game.distToNextSprite(this, this.getOtherTeam(), true)
                    const BEHIND_EXTRA_RANGE = 5
                    console.log("hehe wirlld", behindSprite.len, this.meleRange, BEHIND_EXTRA_RANGE)
                    if (behindSprite.len < this.meleRange + BEHIND_EXTRA_RANGE) {
                        behindSprite.sprite.takeDmg(this.dmg)
                        console.log("BEHIND ATTACK!!!");
                    }

                    // (nextEnemy.len + MELE_RANGE_BUFFER < this.meleRange)
                }
            }
            this.lastStartOfAtkCycleDate = null //efter denhär så står spriten bara still o vibear
        }
    }

    takeDmg(dmg: number, haveBouncedPubNub = false) {
        let dmgTaken = dmg
        if (typeof this.armor !== 'undefined') {
            dmgTaken = Math.max(dmg - this.armor, 0)
            console.log("dmgtaken", dmgTaken, "dmg, this.armor", dmg, this.armor, "recalc", Math.max(dmg - this.armor, 0))
        }

        if (IS_ONLINE && !haveBouncedPubNub) {
            game.damageSprite(this, dmgTaken)
        }
        else {
            this.hp -= dmgTaken
            this.invincible = false;
            this.lastDmgdTime = Date.now()
        }



    }

    checkDead(game: Game, index: number) {
        // if (Date.now() - this.hasLowOpactity > INVINCIBLE_DURATION * 1000) {
        //     this.hasLowOpactity = null
        // }
        if (this.hp <= 0) {
            if (this.deathDate == -1) {
                this.deathDate = Date.now()
            }
        }
        if (this.deathDate != -1 && Date.now() - this.deathDate > DEATH_DELAY) {
            index > -1 ? game.sprites.splice(index, 1) : false  //magic code that kicks sprite from sprite-array
        }
    }

    distFromOwnCastle() {
        let myTeam = this.team
        let basePos = BASE_POS[myTeam].x
        let dist = Math.abs(this.pos.x - basePos)
        return dist
    }

    checkIfAtEnemyCastle(game) {
        let enemyPlayer = this.getOtherTeam();
        let enemyBasePos = BASE_POS[enemyPlayer].x
        let factor = (2 * this.team - 1) //-1 if team:0, 1 if team:1.

        if (this.pos.x * factor < enemyBasePos * factor) { // -100 < -40 //prolog inte imperativt
            if ((Number(mySide == 0) ^ IS_ONLINE) != 1) {
                game.players[enemyPlayer].attackCastle(this.hp)
                //game.players[this.team].onlineChangeGold(0, 1, true)
            }

            this.hp = 0
            //remove gold, add gold
        }
    }

    getOtherTeam() {
        if (this.team == 0) { return 1; }
        else if (this.team == 1) { return 0; }
        return -1;
    }

    setState(newState: string, speed: number, txt: string) {
        //if (this.name == "archer") { console.log(newState, txt) }
        if (speed == 0 && newState == "walk") {
            newState = "idle";
        }
        if (newState == "walk") {
            if (this.range != 0 && this.abilities.includes("ballista") && this.distFromOwnCastle() > BALLISTA_SIEGE_RANGE) {
                // if (this.state)
                // ändra row här
                this.attack(undefined);
                this.state = SpriteCurState.attack;
                // this.setState("attack", -1);
            }
            // else if (this.range != 0) {
            //     pass
            // }
            else {
                this.isWalking = true;
                this.lastStartOfAtkCycleDate = null;
                this.lastAtkCycleDate = START_TIME;
                this.currentSpeed = this.speed
                this.state = SpriteCurState.walk;
                this.currentAnimation = SpriteCurAnim.walk;
            }


        }
        else if (newState == "idle") {
            if (this.range != 0) {
                this.attack(undefined);
                this.setState("attack", -1, "ping");
            }
            else {
                this.currentSpeed = 0
                this.state = SpriteCurState.idle;
                this.currentAnimation = SpriteCurAnim.idle;
            }
        }
        else if (newState == "attack") {
            this.state = SpriteCurState.attack
        }
        else {
            console.log("bad state input")
        }
        if (speed != -1) {
            this.currentSpeed = speed
        }
        // if(this.name == "archer") {
        //     console.log("newstate:", newState, "from:", txt, "final state:", this.state)

        // }

    }

    jumpOverUnits() {
        console.log("unit have been orderd to jump!")
        this.jumpState = 1
        this.currentFrame = 0;
        this.frameDelay = 0;
        this.row = -1;
        this.startJumpDate = Date.now()

    }

    canMove(game: Game) {
        let nextFriend = game.distToNextSprite(this, this.team)
        let nextEnemy = game.distToNextSprite(this, this.getOtherTeam())
        if (nextFriend.len < nextEnemy.len && this.row == 0) {
            // ifall den står bakom en friendly
            if (nextFriend.len < this.meleRange + PERSONAL_SPACE && nextFriend.sprite.row == 0) {
                //eventuellt gör en attack här ifall spriten är ranged. Ja det kommer här:
                if (nextFriend.len < this.meleRange) {
                    this.setState("idle", -1, "idlar");
                }
                else {
                    this.setState("walk", Math.min(nextFriend.sprite.currentSpeed, this.speed), "stalk")
                }
            }
            else {
                //this.currentSpeed = this.speed
                if (!(this.range != 0 && this.abilities.includes("ballista") && this.distFromOwnCastle() > BALLISTA_SIEGE_RANGE && this.state == SpriteCurState.attack)) {
                    this.setState("walk", -1, "catching up i guess")
                }
                // this.setState("walk", -1, "catching up")
            }
        }
        else {
            //ifall mitt emot en enemy
            if (nextEnemy.len + MELE_RANGE_BUFFER < this.meleRange) {
                if (this.abilities.includes("jump") && this.hasJumped != 1 && this.row == 0) {
                    this.hasJumped = 1;
                    console.log("this unit should jump now")
                    this.jumpOverUnits();
                }
                else if (nextEnemy.sprite.row == this.row) {
                    this.setState("attack", -1, "movetopos mele")
                    this.attack(nextEnemy.sprite)
                }
                else if (this.abilities.includes("changeRow")) {
                    console.log("what the fucc", this.abilities)
                    this.row = 0;
                }

            }
            else {
                // console.log("this fukin state is", this.state)
                if (!(this.range != 0 && this.abilities.includes("ballista") && this.distFromOwnCastle() > BALLISTA_SIEGE_RANGE && this.state == SpriteCurState.attack)) {
                    // console.log(this.range != 0, this.abilities.includes("ballista") , this.pos.x > BALLISTA_SIEGE_RANGE , this.state == "attack")
                    this.setState("walk", -1, "movetopos ranged")
                }
            }
        }
    }


    getFrame() { //usually this crashes if sprite is undefined
        // if (this.currentAnimation == SpriteCurAnim.walk && WALK_START_DATE == -1) {
        //     WALK_UNIT = this.uniqeId
        //     WALK_START_DATE = Date.now()
        // }
        var currAnim = this.animations[this.currentAnimation];
        this.frameDelay -= fpsCoefficient; //
        if (this.frameDelay <= 0) {
            this.currentFrame += 1;
            // if (WALK_UNIT == this.uniqeId) {
            //     WALK_FRAME_COUNT += 1;
            //     let delta_time = Date.now() - WALK_START_DATE;
            //     console.log("id is", WALK_UNIT, "frames per second (should be 109):", (2 * 60000 / 8) * WALK_FRAME_COUNT / delta_time, "frames and dt:", WALK_FRAME_COUNT, delta_time)
            // }

            if (this.currentFrame > currAnim.getFrameCount() - 1) {
                // console.log("tid per frame:", (Date.now() - this._last0frame) / currAnim.getFrameCount());
                this.currentFrame = 0;
                if (!currAnim.getIfLoop()) {
                    this.currentAnimation = SpriteCurAnim.idle;
                }
                // this._last0frame = Date.now()
            }
            this.frameDelay = this.animations[this.currentAnimation].getFrameRate() + Math.max(-20, this.frameDelay)
            if (this.isWalking) { this.frameDelay *= this.animTimeMult }
        }
        else {

            //this.frameDelay--;
        }
        return this.currentFrame;
    }

    draw() {
        let fiddledWithAlpha = false
        let frame = Math.min(this.getFrame(), this.animations[this.currentAnimation].getFrameCount() - 1)
        let animation = this.animations[this.currentAnimation].getRow()

        if (this.hasLowOpactity == true || Date.now() - this.lastDmgdTime < INVINCIBLE_DELAY) {
            ctx.globalAlpha = 0.6;
            fiddledWithAlpha = true;
        }
        ctx.drawImage(Images[this.img],
            this.imageSize * frame,
            this.imageSize * (animation + this.drawSpriteYOffset),
            this.imageSize,
            this.imageSize,

            (this.pos.x - this.DRAW_SIZE / 2) * S,
            (this.pos.y + ROW_OFFSET * this.row - this.DRAW_SIZE / 2) * S,
            this.DRAW_SIZE * S,
            this.DRAW_SIZE * S
        );
        if (fiddledWithAlpha) { ctx.globalAlpha = 1; }

    }
}


// let WALK_START_DATE = -1;
// let WALK_FRAME_COUNT = 0;
// let WALK_UNIT: number;