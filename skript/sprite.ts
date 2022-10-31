const ARROW_CONSTS = {

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
    lastDeathFrame: number;
    dead: boolean;
    constructor(pos, vel, team, dmg, isUpdate: boolean = false, newData: Projectile | boolean = false, type = "arrow") {
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
        else if (this.type == "ballista") {
            this.DRAW_SIZE = 14;
            this.startPos = this.pos.x;
            this.deathFrame = 0
            this.lastDeathFrame = Date.now()
        }
        else if (this.type == "spear") {
            this.ARROW_LEN = [0.9, 7];
            //this.ARROW_COLORS = ['#DDDDDD', '#8B3F2B', '#FFFFFF'];
            this.ARROW_COLORS_2 = [{ r: 221, g: 221, b: 221 }, { r: 129, g: 63, b: 43 }]
            //this.ARROW_COLORS_3 = ['#DDDDDD', '#6F2B1F', '#8B3F2B', '#8B3F2B', '#FFFFFF'];
            this.ARROW_SIZE = .7;

        }


        this.dead = false;
        // this.colors = ['#DDDDDD', '#6F2B1F', '#8B3F2B', '#8B3F2B', '#8B3F2B', '#8B3F2B', '#FFFFFF']


        if (isUpdate) { this.updateData(newData) }
        else { playSoundEffect("arrow") }
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

    move() {
        if (this.type == "ballista") {
            this.moveBal();
            return
        }
        this.pos.x += this.vel.vx * fpsCoefficient / 100;
        this.pos.y += this.vel.vy * fpsCoefficient / 100;
        this.vel.vy += GRAVITY * fpsCoefficient / 100;

        //this.predictTouchDown()
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
        if (Date.now() - this.lastDeathFrame > 0.02 * 1000) {
            this.deathFrame += 1
            this.lastDeathFrame = Date.now()
            if (this.deathFrame > 5) {
                this.dead = true
            }
        }


    }

    checkHit(index) {
        if (this.type == "ballista") {
            this.checkHitBallista()
            return;
        }
        if (this.pos.y > HEIGHT - 5) {
            for (var i in game.sprites) {
                if (this.team != game.sprites[i].team) {
                    //console.log("disty:", dist(this.pos, game.sprites[i].pos), game.sprites[i].size);
                    if (dist(this.pos, game.sprites[i].pos) < game.sprites[i].size) {
                        console.log("hejhej")
                        game.sprites[i].takeDmg(this.dmg)
                        playSoundEffect("arrow_hit")
                        this.dead = true;
                    }
                }
            }
        }
    }
    checkDead(index) {
        if (this.dead || this.pos.y > HEIGHT) {
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

    draw() {
        if (this.type == "ballista") {
            this.drawBallista();
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
    startInvincibleDate: any;
    drawInvisible: boolean;
    invincible: boolean;
    activeEffects: any;
    animations: { [key in SpriteCurAnim]: SpriteAnimation };
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
    isJumping: boolean;
    startJumpDate: number;
    imageSize: number;
    size: number;
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

            this.DRAW_SIZE = 24;
            // this._last0frame = Date.now();  //not important, debugging

            //attack
            this.lastAtkCycleDate = START_TIME;
            this.lastStartOfAtkCycleDate = null;

            this.lastDmgdTime = START_TIME
            this.startInvincibleDate = null;
            this.drawInvisible = false;
            this.invincible = false;

            this.activeEffects = new Set();
            console.log(game.players[this.team].activeAbilities)
            if (game.players[this.team].checkAbility("sprint")) {
                this.activateAbility("sprint")
            }
            // this.speed *= 5
        }

    }

    updateData(newData) {
        console.log("newData:", newData)
        for (var i in newData) {
            this[i] = newData[i];
        }

        this.animations = STATS[this.name].animations;

        this.activeEffects = new Set();
        for (var i in newData.activeEffects) {
            this.activeEffects.add(i)
        }
    }

    getData() {
        let data = this;
        // data.animations = null;
        // //data.activeEffects = Array.from(this.activeEffects);
        // console.log("set is now", data.activeEffects);
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

    activateAbility(name) {
        if (name == "sprint") {
            this.activeEffects.add("sprint")
            this.speed += SPRINT_ABILITY_SPEED
            this.animTimeMult /= 2
        }
    }



    move() {
        this.pos.x += this.direction * this.currentSpeed * fpsCoefficient / 100;
        // this.setState("walk", -1, "mooove")
        this.state = SpriteCurState.walk
    }

    spriteShootProjectile(shouldTargetNext = false) {
        if (this.activeEffects.has("target") || (shouldTargetNext && this.abilities.includes("targetCloseRange"))) {
            let nextEnemy = game.distToNextSprite(this, this.getOtherTeam())
            if (nextEnemy.len < 80) {
                let { vel_x, vel_y } = calcProjectilePower(this.pos, nextEnemy.sprite.pos, ARCHER_TRAJECTORY);
                game.shootProjectile(
                    { x: this.pos.x, y: this.pos.y - 5 },
                    { vx: vel_x * this.direction, vy: -vel_y },
                    this.team, this.dmg,
                    IS_ONLINE
                )
                return;
            }
        }
        if (this.abilities.includes("ballista")) {
            game.shootProjectile(
                { x: this.pos.x, y: this.pos.y - 5 },
                {
                    vx: (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * 10 * this.direction,
                    vy: (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * -10 * ARCHER_TRAJECTORY
                },
                this.team, this.dmg,
                IS_ONLINE, "ballista");
            return
        }
        else if (this.abilities.includes("spear")) {
            game.shootProjectile(
                { x: this.pos.x, y: this.pos.y - 5 },
                {
                    vx: (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * 10 * this.direction,
                    vy: (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * -10 * ARCHER_TRAJECTORY
                },
                this.team, this.dmg,
                IS_ONLINE, "spear");
            return

        }
        game.shootProjectile(
            { x: this.pos.x, y: this.pos.y - 5 },
            {
                vx: (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * 10 * this.direction,
                vy: (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * -10 * ARCHER_TRAJECTORY
            },
            this.team, this.dmg,
            IS_ONLINE);
    }





    attack(victim) {
        this.currentSpeed = 0;
        if (this.isWalking) {
            this.isWalking = false;
            this.currentAnimation = SpriteCurAnim.idle
        }
        //this.setState("attack", -1, "attacking");

        let timeSinceLastAttackCycle = Date.now() - this.lastAtkCycleDate;
        if (timeSinceLastAttackCycle > this.atkSpeed) { //start attack animation
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
            }
            this.lastStartOfAtkCycleDate = null //efter denhär så står spriten bara still o vibear
        }
    }

    takeDmg(dmg, haveBouncedPubNub = false) {
        if (this.startInvincibleDate == null) {
            if (IS_ONLINE && !haveBouncedPubNub) {
                game.damageSprite(this, dmg)
            }
            else {
                this.hp -= dmg
                this.invincible = false;
                this.lastDmgdTime = Date.now()
            }
        }


    }

    checkDead(game, index) {
        // if (Date.now() - this.startInvincibleDate > INVINCIBLE_DURATION * 1000) {
        //     this.startInvincibleDate = null
        // }
        if (this.hp <= 0) {
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
            console.log("chening at enemy castle")

            this.hp = 0
            //remove gold, add gold
        }
    }

    getOtherTeam() {
        if (this.team == 0) { return 1; }
        else if (this.team == 1) { return 0; }
        return -1;
    }

    setState(newState, speed, txt) {
        //if (this.name == "archer") { console.log(newState, txt) }
        if (speed == 0 && newState == "walk") {
            newState = "idle";
        }
        if (newState == "walk") {
            if (this.range != 0 && this.abilities.includes("ballista") && this.distFromOwnCastle() > BALLISTA_SIEGE_RANGE) {
                // if (this.state)
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
        console.log("jumping!")
        this.isJumping = true
        this.row = -1;
        this.startJumpDate = Date.now()

    }

    canMove(game) {
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
                if (this.abilities.includes("jump")) {
                    console.log("this unit should jump now")
                    this.abilities = arrayRemove(this.abilities, "jump")
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
        var currAnim = this.animations[this.currentAnimation];
        this.frameDelay -= fpsCoefficient;
        if (this.frameDelay <= 0) {
            this.currentFrame += 1;
            if (this.currentFrame > currAnim.getFrameCount() - 1) {
                // console.log("tid per frame:", (Date.now() - this._last0frame) / currAnim.getFrameCount());
                this.currentFrame = 0;
                if (!currAnim.getIfLoop()) {
                    this.currentAnimation = SpriteCurAnim.idle;
                }
                // this._last0frame = Date.now()
            }
            this.frameDelay = this.animations[this.currentAnimation].getFrameRate()
            if (this.isWalking) { this.frameDelay *= this.animTimeMult }
        }
        else {

            //this.frameDelay--;
        }
        return this.currentFrame;
    }

    draw() {
        let fiddledWithAlpha = false
        let frame = this.getFrame()
        let animation = this.animations[this.currentAnimation].getRow()

        if (this.startInvincibleDate != null || Date.now() - this.lastDmgdTime < INVINCIBLE_DELAY) {
            ctx.globalAlpha = 0.6;
            fiddledWithAlpha = true;
        }
        ctx.drawImage(Images[this.img],
            this.imageSize * frame,
            this.imageSize * animation,
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