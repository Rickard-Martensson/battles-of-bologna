class Projectile {
    constructor(x, y, vx, vy, team, dmg, isUpdate, newData) {
        this.pos = { x: x, y: y };
        this.vel = { x: vx, y: vy };
        this.arrowLen = [0.6, 3, 1];
        this.arrowColors2 = ['#DDDDDD', '#8B3F2B', '#FFFFFF'];
        this.arrowColors = [{ r: 221, g: 221, b: 221 }, { r: 129, g: 63, b: 43 }, { r: 255, g: 255, b: 255 }]
        this.size = .6;
        this.team = team;
        this.dead = false;
        this.dmg = dmg;
        // this.colors = ['#DDDDDD', '#6F2B1F', '#8B3F2B', '#8B3F2B', '#8B3F2B', '#8B3F2B', '#FFFFFF']
        this.colors = ['#DDDDDD', '#6F2B1F', '#8B3F2B', '#8B3F2B', '#FFFFFF'];

        if (isUpdate) { this.updateData(newData) }
    }

    updateData(newData) {
        for (var i in newData) {
            this[i] = newData[i];
        }
    }

    getData() {
        let data = this;
        return data;
    }

    move() {
        this.pos.x += this.vel.x * fpsCoefficient / 100;
        this.pos.y += this.vel.y * fpsCoefficient / 100;
        this.vel.y += GRAVITY * fpsCoefficient / 100;

        //this.predictTouchDown()
    }

    checkHit(index) {
        if (this.pos.y > HEIGHT - 5) {
            for (var i in game.sprites) {
                if (this.team != game.sprites[i].team) {
                    if (dist(this.pos, game.sprites[i].pos) < game.sprites[i].size) {
                        game.sprites[i].takeDmg(this.dmg)
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
        var hyp = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y)
        return { dx: this.vel.x / hyp, dy: this.vel.y / hyp }
    }

    predictTouchDown() {
        var acceleration = GRAVITY / 2
        var t_0 = (- this.vel.y + Math.sqrt(this.vel.y * this.vel.y - 4 * acceleration * (this.pos.y - 100))) / (2 * acceleration)
        console.log(this.vel.x * t_0 + this.pos.x)
    }

    draw() {
        let lastPos = { x: this.pos.x, y: this.pos.y }
        let { dx, dy } = this.getVec();
        ctx.lineWidth = this.size * S;
        if (ARROW_GRAPHICS_LEVEL != 0) {
            for (var i = 0; i < this.arrowLen.length; i++) {
                ctx.beginPath();
                if (ARROW_GRAPHICS_LEVEL > 1) { ctx.strokeStyle = getShadedColorCode(this.arrowColors[i].r, this.arrowColors[i].g, this.arrowColors[i].b) }
                else { ctx.strokeStyle = getColorCode(this.arrowColors[i].r, this.arrowColors[i].g, this.arrowColors[i].b) };
                // ctx.strokeStyle = this.arrowColors2[i]
                ctx.moveTo(lastPos.x * S, lastPos.y * S);
                let endPos = {
                    x: lastPos.x - dx * this.arrowLen[i], y: lastPos.y - dy * this.arrowLen[i]
                };
                ctx.lineTo(endPos.x * S, endPos.y * S);
                lastPos = { x: endPos.x, y: endPos.y };
                ctx.stroke();
            }
        }
        else {
            let totArrowLen = this.arrowLen.reduce((a, b) => a + b, 0)
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.moveTo(lastPos.x * S, lastPos.y * S);
            let endPos = { x: lastPos.x - dx * totArrowLen, y: lastPos.y - dy * totArrowLen };
            ctx.lineTo(endPos.x * S, endPos.y * S);
            ctx.stroke();
        }

    }
}

class Sprite {
    constructor(x, y, name, animations, team, isUpdate, newData) {
        this.pos = { x: x, y: y };
        this.name = name
        this.imageName = this.name;
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

        this.currentAnimation = "idle";
        this.currentSpeed = this.speed
        this.state = "idle"

        this.isWalking = false //helps to make atk anim better

        this.DRAW_SIZE = 24;
        this._last0frame = Date.now();  //not important, debugging

        //attack
        this.lastAtkCycleDate = START_TIME;
        this.lastStartOfAtkCycleDate = null;

        this.lastDmgdTime = START_TIME
        this.startInvincibleDate = null;
        this.drawInvisible = false;
        this.invincible = false;

        this.activeEffects = new Set();

        if (isUpdate) {
            this.updateData(newData);
        }
    }

    updateData(newData) {
        // console.log("newData:", newData)
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
            this.abilities = new Set(UNIQE[this.name])
        }
        else { console.log("unknown sprite", this.name) };

        if (this.team == 0) {
            this.direction = 1;
            this.img += "_blue"
        }
        else if (this.team == 1) {
            this.direction = -1
        }
    }

    move() {
        this.pos.x += this.direction * this.currentSpeed * fpsCoefficient / 100;
        this.state = "walk"
    }

    spriteShootProjectile() {
        console.log("activeEffects:", this.activeEffects)
        if (this.activeEffects.has("target")) {
            let nextEnemy = game.distToNextSprite(this, this.getOtherTeam())
            if (nextEnemy.len < 80) {
                let { vel_x, vel_y } = calcProjectilePower(this.pos, nextEnemy.sprite.pos, ARCHER_TRAJECTORY);
                game.shootProjectile(this.pos.x, this.pos.y - 5,
                    vel_x * this.direction,
                    -vel_y,
                    this.team, this.dmg,
                    IS_ONLINE
                )
                return;
            }
        }
        game.shootProjectile(this.pos.x, this.pos.y - 5,
            (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * 10 * this.direction,
            (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * -10 * ARCHER_TRAJECTORY,
            this.team, this.dmg,
            IS_ONLINE);
    }

    attack(victim) {
        this.currentSpeed = 0;
        if (this.isWalking) {
            this.isWalking = false;
            this.currentAnimation = "idle"
        }
        this.setState("attack", -1, "attacking");

        let timeSinceLastAttackCycle = Date.now() - this.lastAtkCycleDate;
        if (timeSinceLastAttackCycle > this.atkSpeed) { //start attack animation
            //console.log("attack 1")
            this.currentFrame = 0;
            this.currentAnimation = "attack"
            this.lastAtkCycleDate = Date.now();
            this.lastStartOfAtkCycleDate = Date.now();
        }

        let timeSinceStartOfAtk = Date.now() - this.lastStartOfAtkCycleDate;
        if (timeSinceStartOfAtk > this.atkDelay && this.lastStartOfAtkCycleDate !== null) { // atks if its enough time since atkstart
            //console.log("attack 2")
            if (this.range > 0) {
                this.spriteShootProjectile();
            }
            else {
                victim.takeDmg(this.dmg)
            }
            this.lastStartOfAtkCycleDate = null //efter denhär så står spriten bara still o vibear
        }
    }

    takeDmg(dmg) {
        if (this.startInvincibleDate == null) {
            this.hp -= dmg
            this.invincible = false;
            this.lastDmgdTime = Date.now()
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

    checkIfAtEnemyCastle(game) {
        let enemyPlayer = this.getOtherTeam()
        let enemyBasePos = BASE_POS[enemyPlayer].x
        let factor = (2 * this.team - 1) //-1 if team:0, 1 if team:1.

        if (this.pos.x * factor < enemyBasePos * factor) { // -100 < -40 //prolog inte imperativt
            game.players[enemyPlayer].attackCastle(50)
            game.players[this.team].changeGoldPerTurn(1)
            console.log("attack")
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
            this.isWalking = true;
            this.lastStartOfAtkCycleDate = null;
            this.lastAtkCycleDate = START_TIME;
            this.currentSpeed = this.speed
            this.state = "walk"
            this.currentAnimation = "walk"
        }
        else if (newState == "idle") {
            if (this.range != 0) {
                this.attack(self);
                this.setState("attack", -1);
            }
            else {
                this.currentSpeed = 0
                this.state = "idle"
                this.currentAnimation = "idle"
            }
        }
        else if (newState == "attack") {
            this.state = "attack"
        }
        else {
            console.log("bad state input")
        }
        if (speed != -1) {
            this.currentSpeed = speed
        }
    }

    canMove(game) {
        let nextFriend = game.distToNextSprite(this, this.team)
        let nextEnemy = game.distToNextSprite(this, this.getOtherTeam())
        if (nextFriend.len < nextEnemy.len && this.row == 0) {
            if (nextFriend.len < this.meleRange + PERSONAL_SPACE && nextFriend.sprite.row == 0) {
                //eventuellt gör en attack här ifall spriten är ranged. Ja det kommer här:
                if (nextFriend.len < this.meleRange) {
                    this.setState("idle", -1);
                }
                else {
                    this.setState("walk", Math.min(nextFriend.sprite.currentSpeed, this.speed), "stalk")
                }
            }
            else {
                //this.currentSpeed = this.speed
                this.setState("walk", -1, "1")
            }
        }
        else {
            if (nextEnemy.len + MELE_RANGE_BUFFER < this.meleRange) {
                if (nextEnemy.sprite.row == this.row) {
                    this.setState("attack", -1, "movetopos")
                    this.attack(nextEnemy.sprite)
                }
                else if (this.abilities.has("changeRow")) {
                    this.row = 0;
                }
            }
            else {
                this.setState("walk", -1, "movetopos")
            }
        }
    }


    getFrame() {
        var currAnim = this.animations[this.currentAnimation];
        this.frameDelay -= fpsCoefficient;
        if (this.frameDelay <= 0) {
            this.currentFrame += 1;
            if (this.currentFrame > currAnim.getFrameCount() - 1) {
                // console.log("tid per frame:", (Date.now() - this._last0frame) / currAnim.getFrameCount());
                this.currentFrame = 0;
                if (!currAnim.getIfLoop()) {
                    this.currentAnimation = "idle"
                }
                this._last0frame = Date.now()
            }
            this.frameDelay = this.animations[this.currentAnimation].getFrameRate() * this.animTimeMult;
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