const bild = document.getElementById('');

class Scenery {
    constructor(x, y, name, isHurry) {
        this.pos = { x: x, y: y }
        this.name = name
        this.img = this.name + "_img"
        this.imageSize = 64;
        let images = 8
        this.distFactor = CLOUD_DIST_FACTOR - (CLOUD_DIST_FACTOR - 1) * (y / CLOUD_MAX_HEIGHT);
        this.speed = 1 * CLOUD_SPEED * this.distFactor * (isHurry ? 2 : 1);

        this.id = Math.floor(images * Math.random());

        this.DRAW_SIZE = 32
        let drawSize = this.DRAW_SIZE * this.distFactor * S;
        // console.log(y, drawSize,)
    }

    move() {
        this.pos.x += this.speed * fpsCoefficient / 10;
    }

    checkDead(local_UI, key) {
        if (this.pos.x > GAME_WIDTH + this.imageSize / 2) { local_UI.scenery.splice(key, 1); local_UI.sceneryCount--; };
    }

    draw() {
        ctx.imageSmoothingEnabled = true
        let drawSize = this.DRAW_SIZE * this.distFactor
        ctx.drawImage(Images[this.img],
            this.imageSize * (IS_NIGHT * 2),
            this.imageSize * this.id,
            this.imageSize,
            this.imageSize,

            (this.pos.x - drawSize / 2) * S,
            (this.pos.y - drawSize / 2) * S,
            drawSize * S,
            drawSize * S
        );
        if (DUSK_OPACITY != 0 && DAY_NIGHT_ENABLED) {
            ctx.globalAlpha = DUSK_OPACITY;
            ctx.drawImage(Images[this.img],
                this.imageSize * 1,
                this.imageSize * this.id,
                this.imageSize,
                this.imageSize,

                (this.pos.x - drawSize / 2) * S,
                (this.pos.y - drawSize / 2) * S,
                drawSize * S,
                drawSize * S
            );
            ctx.globalAlpha = 1
        }

    }
}




class Game {
    constructor() {
        this.players = [    //very important att dom är i ordning
            new Player("kjelle", 0, "castle_img", 32, 60),
            new Player("bert", 1, "castle_img", 288, 60),
        ]
        this.sprites = [
            //new Sprite(80, 100, "soldier", "anim", "red"),
            //new Sprite(240, 100, "soldier", "anim", "red"),
            //new Sprite(200, 100, "block", "anm", "red"),
            //new Sprite(300, 100, "soldier", "anim", "red"),
        ];
        this.projectiles = [
            //new Projectile(80, 100, 20, -40),
        ]

        this.buyQueue = { 0: [], 1: [] }
        this.lastQueueShift = [Date.now(), Date.now()]

        this.activeAbilites = [];
        this.killStatus = undefined;

        this.mousePos = { x: 0, y: 0 };

        this.lastTimestamp = Date.now();
        this.tickLengthArray = [];
        this.startTime = Date.now();
        this.lastGoldTime = Date.now();
        this.lastSyncTime = Date.now();
        this.lastTriedPing = Date.now();

        this.gameOver = false
        this.isHurry = false
        this.daysPast = 0;

    }

    updatePlayer(team, newData) {
        this.players[team].updateData(newData);
    }

    timeUntilNextGold() {
        return this.lastGoldTime + GOLD_INTERVAL * 1000 - Date.now()
    }

    sendGameState(team = 0) {
        let sprites = []
        for (var i in this.sprites) {
            sprites.push(this.sprites[i].getData());
        }
        let projectiles = []
        if (SYNC_PROJECTILES) {
            for (var i in this.projectiles) {
                projectiles.push(this.projectiles[i].getData())
            }
        }

        // let players = []
        // for (var i in this.players) {
        //     players.push(this.players[i].getData());
        // }
        let lastGoldTime = this.lastGoldTime
        //pubnubAction("upDateGame", 1, sprites, projectiles, players, lastGoldTime);
        send("syncGame", { team: team, sprites: sprites, projectiles: projectiles, buyQueue: this.buyQueue, lastGoldTime: lastGoldTime });
    }

    updateGame(sprites, projectiles, buyQueue, lastGoldTime) {
        if (Date.now() - LAST_GLOBAL_UPDATE > GLOBAL_UPDATE_MARGIN) {
            this.sprites = [];
            for (var i in sprites) {
                this.sprites.push(
                    new Sprite(0, 0, 0, 0, true, sprites[i])
                )
            }

            if (SYNC_PROJECTILES) {
                this.projectiles = [];
                for (var i in projectiles) {
                    this.projectiles.push(new Projectile(0, 0, 0, 0, 0, 0, true, projectiles[i])
                    )
                }
            }
            if (mySide == 1) {
                this.buyQueue = buyQueue;
            }

            // for (var key in this.players) {
            //     let player = this.players[key];
            //     player.updateData(players[key]);
            // }

            this.lastGoldTime = lastGoldTime
            // console.log("recieved sprites: ", sprites)
            // this.newData = { sprites: sprites, projectiles: projectiles, activeAbilites: activeAbilites, };
        }
        else {
            console.log("game update blocked")
        }

    }

    damageCastle(team, dmg){
        this.players[team].takeDmg(dmg)
    }

    checkAbilities() {
        for (var key in this.activeAbilites) {
            let ability = this.activeAbilites[key];
            if (Date.now() - ability.startTime > ability.cooldown * 1000) {
                this.disableAbility(key, ability.name, ability.team)
            }
        }
    }

    disableAbility(index, name, team) {
        index > -1 ? this.activeAbilites.splice(index, 1) : false
        if (name == "invincible") {
            for (var key in this.sprites) {
                let sprite = this.sprites[key];
                if (sprite.team == team) {
                    sprite.startInvincibleDate = null;
                }
            }
        }
        else if (name == "target") {
            for (var key in this.sprites) {
                let sprite = this.sprites[key]
                if (sprite.team == team && sprite.range != 0) {
                    sprite.activeEffects.delete("target")
                }
            }
        }
        else if (name == "sprint") {
            for (var key in this.sprites) {
                let sprite = this.sprites[key]
                if (sprite.team == team && sprite.activeEffects.has("sprint")) {
                    sprite.activeEffects.delete("sprint")
                    sprite.speed -= SPRINT_ABILITY_SPEED
                    sprite.animTimeMult *= 2
                }
            }
        }
    }

    castAbility(name, team, cooldown) {
        if (cooldown != 0) {
            this.activeAbilites.push({ name: name, startTime: Date.now(), team: team, cooldown: cooldown })
        }
        let factor = (2 * team - 1)
        if (name == "arrows") {
            for (var i = 0; i < 1; i++) {
                //console.log(BASE_POS[team].x, BASE_POS[team].y, -(20 + 5 * Math.random()) * factor, -(50 + 10 * Math.random()), team, 2);
                this.shootProjectile(
                    { x: BASE_POS[team].x, y: BASE_POS[team].y - 20 },
                    { vx: -(50 + 40 * Math.random()) * factor, vy: -(50 + 20 * Math.random()) },
                    team, 2, IS_ONLINE
                );
            }
        }
        else if (name == "takedmg") {
            this.players[team].sendDmgPackage(20);
        }
        else if (name == "repair") {
            this.players[team].repairCastle(15);
            playSoundEffect("repair")
        }
        else if (name == "invincible") {
            for (var key in this.sprites) {
                let sprite = this.sprites[key];
                if (sprite.team == team) {
                    sprite.startInvincibleDate = Date.now();
                }
            }
        }
        else if (name == "target") {
            for (var key in this.sprites) {
                let sprite = this.sprites[key];
                if (sprite.team == team && sprite.range != 0 && sprite.abilities.includes("targetfire"))  {
                    sprite.activeEffects.add("target")
                }
            }
        }
        else if (name == "sprint") {
            for (var key in this.sprites) {
                let sprite = this.sprites[key];
                if (sprite.team == team) {
                    sprite.activeEffects.add("sprint")
                    sprite.speed += SPRINT_ABILITY_SPEED
                    sprite.animTimeMult /= 2
                }
            }
        }
        //this.sendGameState() //osäker på om detta fungerar. andra spelaren kan också synka, och det kan leda till problem...
    }


    start() {
        this.debugMode(IS_DEBUGGING)
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = 20 * S + "px 'Press Start 2P'";
        ctx.fillText("Laddar...", 160 * S, 100 * S);
        let self = this;

        window.setTimeout(function () {
            START_TIME = Date.now()
            self.tick();

        }, 1000)
    }


    tick() {
        if (this.killStatus == "KILL") { return };
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        let lastTickLength = Date.now() - this.lastTimestamp;
        this.lastTimestamp = Date.now();
        this.tickLengthArray.push(lastTickLength);
        if (this.tickLengthArray.length > 30) {
            this.tickLengthArray.splice(0, 1);
        }

        //how long did the last 30 frames take?
        let timeSum = 0;
        for (let i = 0; i < this.tickLengthArray.length; i++) {
            timeSum += this.tickLengthArray[i];
        }

        let timeAverage = timeSum / 30;
        let fps = 1000 / timeAverage;
        if (fps < 30) {
            fps = 30;
        }

        fpsCoefficient = 144 / fps;

        //draw stuff
        if (CLOUDS_ENABLED) { local_UI.drawScenery(); };


        if (GRAPHICS_LEVEL != 0) { ctx.filter = UNIT_DARKNESS; };
        if (DRAW_NEAREST_NEIGHBOUR) { ctx.imageSmoothingEnabled = false } // viktig
        this.drawSprites();
        if (GRAPHICS_LEVEL > 0) { ctx.filter = DEFAULT_DARKNESS; };
        this.drawProjectiles();
        ctx.imageSmoothingEnabled = false; // viktig
        local_UI.drawEverything(fps);
        //this.drawUI(fps);
        this.goldIntervalCheck();
        this.syncIntervalCheck();
        this.checkAbilities();
        if (IS_ONLINE && !IS_SPECTATOR) {
            this.checkPing();
        }
        this.checkIfPlayersDead();

        this.spawnSprites();


        //stuff to do at the end
        //this.lastTimestamp = Date.now();


        window.requestAnimationFrame(this.tick.bind(this));


    }

    addToBuyQueue(unit, team) {
        let row = (unit == "knight") ? 1 : 0;
        this.buyQueue[team].push({ unit: unit, row: row });
        console.log(this.buyQueue)
    }

    spawnSprites() {
        for (var key in this.players) {
            let player = local_UI.players[key]
            this.checkBuyQueue(key)
        }

    }

    checkBuyQueue(team) { // maybe just let host handle buyque. Well thats tomorrows problem nevermind now host does!
        if ((mySide == 0 ^ IS_ONLINE) != 1 && (this.buyQueue[team].length > 0 && Date.now() - this.lastQueueShift[team] > 0.2 * 1000)) {
            let len = game.distToNextSprite2(team, { x: BASE_POS[team].x - getDirection(team), y: BASE_POS[team].y }, this.buyQueue[team][0].row).len;
            if (len < 11) { }
            else {
                this.lastQueueShift[team] = Date.now()
                let firstUnit = this.buyQueue[team].shift()
                let firstUnitName = firstUnit.unit;
                // console.log("unit, name", firstUnit, firstUnitName, len)
                let posShift = (len >= 21) ? 10 : 0
                if (IS_ONLINE) {
                    send("sendUnit", { team: team, unit: firstUnitName, posShift: posShift });
                }
                else { game.addSprite(firstUnitName, team, posShift); }
            }
        }
        else {
            //console.log(mySide, "== 0", this.buyQueue[team].length, "> 0", Date.now() - this.lastQueueShift[team], "> 0.2 * 1000")
        }

    }



    checkIfPlayersDead() {
        for (var key in this.players) {
            let player = this.players[key]
            if (player.hp <= 0 && !this.gameOver) {
                local_UI.setLoser(key)
                this.gameOver = true
            }
        }
    }

    checkPing() {
        if (Date.now() - lastSentPing > 10 * 1000 && Date.now() - this.lastTriedPing > 10 * 1000) {
            this.lastTriedPing = Date.now()
            send("ping", "pingpong")
        }
        if (Date.now() - lastRecievedPing > 15 * 1000) {
            local_UI.setDesync(true);
        }
        else {
            local_UI.setDesync(false);
        }
    }


    getMillisecondsPlayed() {
        let currentTime = new Date();
        let getMillisecondsPassed = currentTime - this.startTime;
        return getMillisecondsPassed;
    }

    shootProjectile(pos, vel, team, dmg, isOnline, type="arrow") {
        // console.log("arrow:", pos, vel)
        if (isOnline) {
            if (mySide == 0) {
                send("sendProjectile", { team: team, pos: pos, vel: vel, dmg: dmg, type: type })
            }
        }
        else { this.projectiles.push(new Projectile(pos, vel, team, dmg, false, false, type)) }
    }

    distToNextSprite2(team, pos, row = 0) {
        let bestCandidate = null;
        let bestCanLen = Infinity;
        let dir = getDirection(team)
        for (var i in this.sprites) {
            let loopSprite = this.sprites[i];
            if (team == loopSprite.team) {
                // console.log("loopy", dir * pos.x, dir * loopSprite)
                if ((dir * pos.x < dir * loopSprite.pos.x) && (row == loopSprite.row)) {
                    let dist = Math.abs(pos.x - loopSprite.pos.x)
                    if (dist < bestCanLen) {
                        bestCanLen = dist;
                        bestCandidate = loopSprite;
                    }
                }
            }
        }
        // console.log("out:", bestCandidate, bestCanLen)
        return ({ sprite: bestCandidate, len: bestCanLen });
    }


    distToNextSprite(sprite, team) {
        let bestCandidate = null;
        let bestCanLen = Infinity;
        let spriteDir = sprite.direction
        for (var i in this.sprites) {
            let loopSprite = this.sprites[i]
            if (team == loopSprite.team) {   //jafan
                if (spriteDir * sprite.pos.x < spriteDir * loopSprite.pos.x) {
                    let loopDist = Math.abs(sprite.pos.x - loopSprite.pos.x)
                    if (loopDist < bestCanLen) {
                        bestCanLen = loopDist;
                        bestCandidate = loopSprite;
                    }
                }
            }

        }
        return ({ sprite: bestCandidate, len: bestCanLen });
    }


    // === sprites === \\
    addSprite(name, team, posShift = 0) {
        // console.log("yeye", posShift, getDirection(team))
        this.sprites.push(new Sprite(BASE_POS[team].x + posShift * getDirection(team), BASE_POS[team].y, name, team))
        if (mySide == 1) {
            this.buyQueue[team].shift()
        }
    }

    drawSprites() {
        for (var i in this.sprites) {
            let sprite = this.sprites[i];
            //console.log("sprite:", sprite)
            sprite.canMove(this);
            sprite.move();
            sprite.draw();
            sprite.checkIfAtEnemyCastle(this);
            sprite.checkDead(game, i);
            
    

        }
        for (var i in this.players) {
            let player = this.players[i];
            player.drawCastle();
            if (player.castleLvl != 0 ) { //&& Date.now() - player.lastCastleAtk > CASTLE_ARROW_DELAY[player.castleLvl] * 1000) {
                player.castleTryAttack();
            }
        }


    }
    drawProjectiles() {
        for (var i in this.projectiles) {
            this.projectiles[i].move()
            this.projectiles[i].draw()
            this.projectiles[i].checkHit(this, i)
            this.projectiles[i].checkDead(i)
        }
    }


    syncIntervalCheck() {
        if (IS_ONLINE && mySide == 0 && Date.now() - this.lastSyncTime > SYNC_INTERVAL * 1000) {
            console.log("syncing...", (Date.now() - START_TIME) * 0.001)
            this.lastSyncTime = Date.now()
            this.sendGameState()

        }
    }

    goldIntervalCheck() {
        if (Date.now() - this.lastGoldTime > GOLD_INTERVAL * 1000) {
            this.lastGoldTime = Date.now();
            this.daysPast += 1
            for (var key in this.players) {
                let player = this.players[key]
                if (this.daysPast >= BALLISTA_UNLOCK_DAY) {player.addUpgrade("upgBallista")}
                player.giveGoldPerTurn()

                player.decreaseCoolDowns(this);
            }

        }
        for (var i in this.players) {
            if (local_UI.justGaveGold[i] != null && Date.now() - local_UI.justGaveGold[i] > 200) {
                local_UI.justGaveGold[i] = null;
            }
        }
    }

    debugMode(bool) {
        if (bool) {
            for (var key in this.players) {
                let player = this.players[key]
                player.gold = 99999
                player.addUpgrade("upgBallista")
            }
        }
    }


}