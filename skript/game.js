"use strict";
const bild = document.getElementById('');
class Scenery {
    constructor(x, y, name, isHurry) {
        this.pos = { x: x, y: y };
        this.name = name;
        this.img = this.name + "_img";
        this.imageSize = 64;
        let images = 8;
        this.distFactor = CLOUD_DIST_FACTOR - (CLOUD_DIST_FACTOR - 1) * (y / CLOUD_MAX_HEIGHT);
        this.speed = 1 * CLOUD_SPEED * this.distFactor * (isHurry ? 2 : 1);
        this.id = Math.floor(images * Math.random());
        this.DRAW_SIZE = 32;
        let drawSize = this.DRAW_SIZE * this.distFactor * S;
        // console.log(y, drawSize,)
    }
    move() {
        this.pos.x += this.speed * fpsCoefficient / 10;
    }
    checkDead(local_UI, key) {
        if (this.pos.x > GAME_WIDTH + this.imageSize / 2) {
            local_UI.scenery.splice(key, 1);
            local_UI.sceneryCount--;
        }
        ;
    }
    draw() {
        ctx.imageSmoothingEnabled = true;
        let drawSize = this.DRAW_SIZE * this.distFactor;
        ctx.drawImage(Images[this.img], this.imageSize * (2 * IS_NIGHT), this.imageSize * this.id, this.imageSize, this.imageSize, (this.pos.x - drawSize / 2) * S, (this.pos.y - drawSize / 2) * S, drawSize * S, drawSize * S);
        if (DUSK_OPACITY != 0 && DAY_NIGHT_ENABLED) {
            ctx.globalAlpha = DUSK_OPACITY;
            ctx.drawImage(Images[this.img], this.imageSize * 1, this.imageSize * this.id, this.imageSize, this.imageSize, (this.pos.x - drawSize / 2) * S, (this.pos.y - drawSize / 2) * S, drawSize * S, drawSize * S);
            ctx.globalAlpha = 1;
        }
    }
}
class Game {
    constructor(name1, name2, class1, class2, diff1, diff2) {
        this.players = [
            new Player(name1, 0, "castle_img", 32, 60, class1),
            new Player(name2, 1, "castle_img", 288, 60, class2),
        ];
        this.sprites = [
        //new Sprite(80, 100, "soldier", "anim", "red"),
        //new Sprite(240, 100, "soldier", "anim", "red"),
        //new Sprite(200, 100, "block", "anm", "red"),
        //new Sprite(300, 100, "soldier", "anim", "red"),
        ];
        this.effects = [];
        this.projectiles = [
        //new Projectile(80, 100, 20, -40),
        ];
        this.buyQueue = { [Teams.blue]: [], [Teams.red]: [] };
        this.lastQueueShift = [Date.now(), Date.now()];
        this.activeAbilites = [];
        this.killStatus = undefined;
        this.mousePos = { x: 0, y: 0 };
        this.lastTimestamp = Date.now();
        this.tickLengthArray = [];
        this.startTime = Date.now();
        this.lastGoldTime = Date.now();
        this.lastSyncTime = Date.now();
        this.lastTriedPing = Date.now();
        this.gameOver = false;
        this.isHurry = false;
        this.daysPast = 0;
        // this.addToBuyQueue("brute", 0);
    }
    updatePlayer(team, newData) {
        this.players[team].updateData(newData);
    }
    timeUntilNextGold() {
        return this.lastGoldTime + GOLD_INTERVAL * 1000 - Date.now();
    }
    sendGameState(team = Teams.blue) {
        let sprites = [];
        for (var i in this.sprites) {
            let dataOfSprite = this.sprites[i].getData();
            sprites.push(dataOfSprite);
        }
        let projectiles = [];
        if (SYNC_PROJECTILES) {
            for (var i in this.projectiles) {
                projectiles.push(this.projectiles[i].getData());
            }
        }
        // let players = []
        // for (var i in this.players) {
        //     players.push(this.players[i].getData());
        // }
        let lastGoldTime = this.lastGoldTime;
        //pubnubAction("upDateGame", 1, sprites, projectiles, players, lastGoldTime);
        send("syncGame", { team: team, sprites: sprites, projectiles: projectiles, buyQueue: this.buyQueue, lastGoldTime: lastGoldTime });
    }
    updateGame(sprites, projectiles, buyQueue, lastGoldTime) {
        if (Date.now() - LAST_GLOBAL_UPDATE > GLOBAL_UPDATE_MARGIN) {
            this.sprites = [];
            for (var i in sprites) {
                this.sprites.push(new Sprite(0, 0, "updateSprite", 0, true, sprites[i]));
            }
            if (SYNC_PROJECTILES) {
                this.projectiles = [];
                for (var i in projectiles) {
                    this.projectiles.push(new Projectile({ x: 0, y: 0 }, { vx: 0, vy: 0 }, 0, 0, false, projectiles[i]));
                }
            }
            if (mySide == 1) {
                this.buyQueue = buyQueue;
            }
            // for (var key in this.players) {
            //     let player = this.players[key];
            //     player.updateData(players[key]);
            // }
            this.lastGoldTime = lastGoldTime;
            // console.log("recieved sprites: ", sprites)
            // this.newData = { sprites: sprites, projectiles: projectiles, activeAbilites: activeAbilites, };
        }
        else {
            console.log("game update blocked");
        }
    }
    damageCastle(team, dmg) {
        this.players[team].takeDmg(dmg);
    }
    checkAbilities() {
        for (var key in this.activeAbilites) {
            let ability = this.activeAbilites[key];
            // console.log("name:", ability.name, "time: ", Date.now() - ability.startTime)
            if (Date.now() - ability.startTime > ability.cooldown * 1000) {
                console.log("sent request to remove", ability.name);
                this.disableAbility(Number(key), ability.name, ability.team);
            }
        }
    }
    disableAbility(index, name, team) {
        index > -1 ? this.activeAbilites.splice(index, 1) : false;
        this.players[team].removeAbility(name);
        for (var key in this.sprites) {
            let sprite = this.sprites[key];
            if (sprite.team == team) {
                sprite.deactivateAbility(name);
            }
        }
    }
    castAbility(name, team, cooldown, posX) {
        if (cooldown != 0) {
            this.activeAbilites.push({ name: name, startTime: Date.now(), team: team, cooldown: cooldown });
        }
        let factor = (2 * team - 1);
        let player = this.players[team];
        if (name == "arrows") {
            for (var i = 0; i < 7; i++) {
                //console.log(BASE_POS[team].x, BASE_POS[team].y, -(20 + 5 * Math.random()) * factor, -(50 + 10 * Math.random()), team, 2);
                this.shootProjectile({ x: BASE_POS[team].x, y: BASE_POS[team].y - 40 }, { vx: -(20 + 75 * Math.random()) * factor, vy: -(45 + 25 * Math.random()) }, team, 2, IS_ONLINE, "arrow");
            }
        }
        else if (name == "viking_barrel") {
            player.posAbilityTime = Date.now();
            player.posAbilityXModuli = posX;
            // console.log("targetpoint:", posX)
            let target = posX;
            let vel = calcProjectilePower2({ x: BASE_POS[team].x, y: 60 }, { x: target, y: 100 }, 10);
            // let vel = calcProjectilePower({ x: BASE_POS[team].x, y: BASE_POS[team].y }, { x: targetX, y: 100 }, 20)
            this.shootProjectile({ x: BASE_POS[team].x, y: 60 }, { vx: vel.vx, vy: vel.vy }, team, 2, IS_ONLINE, "barrel");
            // this.shootProjectile(
            //     { x: BASE_POS[team].x, y: BASE_POS[team].y - 40 },
            //     { vx: targetX * (1 / 20) * factor, vy: -70 },
            //     team, 2, IS_ONLINE, "barrel"
            // );
        }
        else if (name == "takedmg") {
            player.sendDmgPackage(20);
        }
        else if (name == "heal") {
            for (var key in this.sprites) {
                let sprite = this.sprites[key];
                if (sprite.team == team) {
                    const name = sprite.name;
                    const maxHp = STATS[name].hp;
                    if (sprite.hp != maxHp) {
                        sprite.hp = maxHp;
                        local_UI.playHearts(sprite.pos.x, sprite.pos.y, sprite.team);
                    }
                }
            }
        }
        else if (name == "doublejump") {
            for (var key in this.sprites) {
                let sprite = this.sprites[key];
                if (sprite.team == team) {
                    if (sprite.abilities.includes("jump")) {
                        sprite.jumpOverUnits();
                    }
                    else {
                        console.log("this unit does not have jupm ability");
                    }
                }
            }
        }
        else if (name == "repair") {
            player.repairCastle(15);
            playSoundEffect("repair");
        }
        else if (name == "lightning") {
            let enemySprites = [];
            let enemyRangedSprites = [];
            for (var key in this.sprites) {
                let sprite = this.sprites[key];
                if (sprite.team != team) {
                    if (sprite.range != 0) {
                        enemyRangedSprites.push(sprite);
                    }
                    enemySprites.push(sprite);
                }
            }
            if (enemyRangedSprites.length < 3) {
                enemyRangedSprites = enemySprites;
            }
            let randomEnemies = enemyRangedSprites.sort(() => .5 - Math.random()).slice(0, 3);
            playSoundEffect("thunder");
            randomEnemies.forEach(enemy => {
                enemy.activateAbility("electrocuted");
                game.addEffect(enemy.pos.x, 82, "lightning_blue", 35, 0, 1);
                enemy.takeDmg(2);
            });
            game.players[getOtherTeam(team)].addAbility("electrocuted");
        }
        else if (name in ABILITIES_LIST) {
            console.log("found ability", name, "in", ABILITIES_LIST);
            if (ABILITIES_LIST[name].affectNewlySpawnedUnits) {
                player.addAbility(name);
            }
            let requiredAbility = ABILITIES_LIST[name].requiredAbility;
            let needAbility = ABILITIES_LIST[name].needAbility;
            for (var key in this.sprites) {
                let sprite = this.sprites[key];
                if (sprite.team == team) {
                    if (needAbility == false) {
                        sprite.activateAbility(name);
                    }
                    else if (sprite.abilities.includes(requiredAbility)) {
                        sprite.activateAbility(name);
                    }
                }
            }
        }
        //this.sendGameState() //osäker på om detta fungerar. andra spelaren kan också synka, och det kan leda till problem...
    }
    start() {
        this.debugMode(IS_DEBUGGING);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = 20 * S + "px 'Press Start 2P'";
        ctx.fillText("Laddar...", 160 * S, 100 * S);
        let self = this;
        window.setTimeout(function () {
            START_TIME = Date.now();
            self.tick();
        }, 1000);
    }
    tick() {
        if (this.killStatus == "KILL") {
            return;
        }
        ;
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
        let minFps = 5;
        if (fps < minFps) {
            fps = minFps;
        }
        fpsCoefficient = 144 / fps;
        //draw stuff
        if (CLOUDS_ENABLED) {
            local_UI.drawScenery();
        }
        ;
        if (GRAPHICS_LEVEL != 0) {
            ctx.filter = UNIT_DARKNESS;
        }
        ;
        if (DRAW_NEAREST_NEIGHBOUR) {
            ctx.imageSmoothingEnabled = false;
        } // viktig
        if (GRAPHICS_LEVEL > 0) {
            ctx.filter = DEFAULT_DARKNESS;
        }
        ;
        ctx.imageSmoothingEnabled = false; // viktig
        this.drawSprites();
        this.drawEffects();
        this.drawProjectiles();
        local_UI.drawEverything(fps);
        this.goldIntervalCheck();
        this.syncIntervalCheck();
        this.checkAbilities();
        if (IS_ONLINE && !IS_SPECTATOR) {
            this.checkPing();
        }
        this.checkIfPlayersDead();
        this.spawnSprites();
        window.requestAnimationFrame(this.tick.bind(this));
    }
    addToBuyQueue(unit, team) {
        this.buyQueue[team].push(unit);
    }
    spawnSprites() {
        for (var player in this.players) {
            this.checkBuyQueue(Number(player));
        }
    }
    checkBuyQueue(team) {
        if ((Number(mySide == 0) ^ IS_ONLINE) != 1 && (this.buyQueue[team].length > 0)) {
            // let len = game.distToNextSprite(team, { x: BASE_POS[team].x - getDirection(team), y: BASE_POS[team].y }, this.buyQueue[team][0].row).len;
            let firstUnitName = this.buyQueue[team][0];
            let firstUnitMeleRange = STATS[firstUnitName].meleRange;
            let firstUnitRow = 0;
            if (firstUnitName == "knight") {
                firstUnitRow = 1;
            }
            else if (STATS[firstUnitName].siege == true) {
                firstUnitRow = 2;
            }
            let protoSprite = { pos: { x: BASE_POS[team].startx }, team: team, direction: getDirection(team) };
            let nextSprite = game.distToNextSprite(protoSprite, team, firstUnitRow, false, false);
            let spawnPos = BASE_POS[team].maxx;
            let dir = getDirection(team);
            if (nextSprite.sprite != null) {
                spawnPos = nextSprite.sprite.pos.x - (nextSprite.sprite.size + firstUnitMeleRange) * dir;
                if (spawnPos * dir < BASE_POS[team].minx * dir) {
                    // console.log("too close", spawnPos, dir, BASE_POS[team].minx, dir)
                    return;
                }
                else if (spawnPos * dir > BASE_POS[team].maxx * dir) {
                    // console.log("too far away", spawnPos, dir, BASE_POS[team].maxx, dir)
                    spawnPos = BASE_POS[team].maxx;
                }
            }
            // if (spawnPos = nextSprite.sprite.pos.x - nextSprite.sprite.size - firstUnitMeleRange;
            this.lastQueueShift[team] = Date.now();
            let firstUnit = this.buyQueue[team].shift();
            // console.log("unit, name", firstUnit, firstUnitName, len)
            // let posShift = (len >= 18) ? 8 : 0
            if (IS_ONLINE) {
                send("sendUnit", { team: team, unit: firstUnitName, spawnPos: spawnPos });
            }
            else {
                game.addSprite(firstUnitName, team, spawnPos);
            }
        }
        else {
            //console.log(mySide, "== 0", this.buyQueue[team].length, "> 0", Date.now() - this.lastQueueShift[team], "> 0.2 * 1000")
        }
    }
    checkIfPlayersDead() {
        for (var key in this.players) {
            let player = this.players[key];
            if (player.hp <= 0 && !this.gameOver) {
                local_UI.setLoser(Number(key));
                this.gameOver = true;
            }
        }
    }
    checkPing() {
        if (Date.now() - lastSentPing > 10 * 1000 && Date.now() - this.lastTriedPing > 10 * 1000) {
            this.lastTriedPing = Date.now();
            send("ping", "pingpong");
        }
        if (Date.now() - lastRecievedPing > 15 * 1000) {
            local_UI.setDesync(true);
        }
        else {
            local_UI.setDesync(false);
        }
    }
    getMillisecondsPlayed() {
        let currentTime = Date.now();
        let getMillisecondsPassed = currentTime - this.startTime;
        return getMillisecondsPassed;
    }
    damageSprite(sprite, dmg) {
        if (IS_ONLINE) {
            if (mySide == 0) {
                let spriteId = sprite.uniqeId;
                send("damageSprite", { spriteId: spriteId, dmg: dmg });
            }
        }
        else {
            sprite.takeDmg();
        }
    }
    damageSpriteFromId(spriteId, dmg) {
        let sprite = this.getSpriteFromSpriteId(spriteId);
        if (sprite == undefined) {
            console.log("could not find sprite with id", spriteId);
            return;
        }
        else if (sprite != undefined) {
            sprite.takeDmg(dmg, true);
        }
    }
    getSpriteFromSpriteId(spriteId) {
        for (let i = 0; i < this.sprites.length; i++) {
            var sprite = this.sprites[i];
            if (sprite.uniqeId == spriteId) {
                return sprite;
            }
        }
        console.log("could not find a sprite with id", spriteId);
        return undefined;
    }
    shootProjectile(pos, vel, team, dmg, isOnline, type) {
        // console.log("arrow:", pos, vel)
        if (isOnline) {
            if (mySide == 0) {
                send("sendProjectile", { team: team, pos: pos, vel: vel, dmg: dmg, type: type });
            }
        }
        else {
            this.projectiles.push(new Projectile(pos, vel, team, dmg, false, false, type));
        }
    }
    // distToNextSprite2(team: Teams, pos: { x: number; y: number; }, row: number = 0) {
    //     let bestCandidate = null;
    //     let bestCanLen = Infinity;
    //     let dir = getDirection(team)
    //     for (var i in this.sprites) {
    //         let loopSprite = this.sprites[i];
    //         if (team == loopSprite.team) {
    //             if ((dir * pos.x < dir * loopSprite.pos.x) && (row == loopSprite.attackRow)) {
    //                 // console.log("loopy", dir * pos.x, dir * loopSprite)
    //                 let dist = Math.abs(pos.x - loopSprite.pos.x)
    //                 if (dist < bestCanLen) {
    //                     bestCanLen = dist;
    //                     bestCandidate = loopSprite;
    //                 }
    //             }
    //         }
    //     }
    //     // console.log("out:", bestCandidate, bestCanLen)
    //     return ({ sprite: bestCandidate, len: bestCanLen });
    // }
    /**
     * returns the closest sprite & the length to given a Sprite.
     * Will include the size in calculation, ie
     * a Huge sprite far away might be closer than a small sprite with a closer pos.x
     *
     * will return the dif in pos.x - size of enemy.
     *
     * will only look forward (according to sprite.direction) unless reverseDirection = true
     * will ignore sprites of incorrect team
     *
     * if no sprite found, returns bestCandidate = null, Len = Infinity
     *
     * @param sprite - given Sprite
     * @param team - team of searched sprit
     * @param row
     *
     */
    distToNextSprite(sprite, team, row, reverseDirection = false, ignoreRows = false) {
        let bestCandidate = null;
        let bestCanLen = Infinity;
        let spriteDir = sprite.direction;
        let spriteTeam = sprite.team;
        if (reverseDirection) {
            spriteDir *= -1;
        }
        for (var i in this.sprites) {
            let loopSprite = this.sprites[i];
            if (team == loopSprite.team) { // kollar så att den sökta spriten är i rätt lag
                if (((spriteTeam == loopSprite.team) && row == loopSprite.defFriendRow) ||
                    ((spriteTeam != loopSprite.team) && row == loopSprite.defEnemyRow) ||
                    ignoreRows) { // kollar så att vår sprite kan interagera med
                    if (spriteDir * sprite.pos.x < spriteDir * loopSprite.pos.x) {
                        let loopDist = Math.abs(sprite.pos.x - loopSprite.pos.x) - loopSprite.size;
                        if (loopDist < bestCanLen) {
                            bestCanLen = loopDist;
                            bestCandidate = loopSprite;
                        }
                    }
                }
            }
        }
        return ({ sprite: bestCandidate, len: bestCanLen });
    }
    // === sprites === \\
    addSprite(name, team, spawnPos = 0, alternativeXpos = 0) {
        // console.log("yeye", posShift, getDirection(team))
        if (alternativeXpos != 0) {
            this.sprites.push(new Sprite(alternativeXpos, BASE_POS[team].y, name, team, false, false));
            return;
        }
        this.sprites.push(new Sprite(spawnPos, BASE_POS[team].y, name, team, false, false));
        if (mySide == 1) {
            this.buyQueue[team].shift();
        }
    }
    drawSprites() {
        for (var i in this.players) {
            let player = this.players[i];
            player.drawCastle();
            if (player.castleLvl != 0) {
                player.castleTryAttack();
            }
        }
        let drawQueue = [];
        for (var i in this.sprites) {
            let sprite = this.sprites[i];
            //console.log("sprite:", sprite)
            sprite.canMove(this);
            sprite.move();
            if (sprite.atkFriendRow == 0) {
                sprite.draw();
            }
            else {
                drawQueue.push({ sprite: sprite, row: sprite.atkFriendRow });
            }
            sprite.checkIfAtEnemyCastle(this);
            sprite.checkDead(game, Number(i));
        }
        drawQueue.sort((a, b) => a.row - b.row);
        drawQueue.forEach(e => {
            e.sprite.draw();
        });
        // drawQueue.forEach(e => {
        //     e.
        // });
    }
    addEffect(x, y, name, framerate, team, size) {
        let effect = new Effect({ x: x, y: y }, name, framerate, team, size);
        this.effects.push(effect);
    }
    drawEffects() {
        for (var i in this.effects) {
            let effect = this.effects[i];
            //console.log("sprite:", sprite)
            effect.draw();
            effect.checkDead(this, Number(i));
        }
    }
    drawProjectiles() {
        for (var i in this.projectiles) {
            this.projectiles[i].move();
            this.projectiles[i].draw();
            this.projectiles[i].checkHit();
            this.projectiles[i].checkDead(Number(i));
        }
    }
    syncIntervalCheck() {
        if (IS_ONLINE && mySide == 0 && Date.now() - this.lastSyncTime > SYNC_INTERVAL * 1000) {
            console.log("syncing...", (Date.now() - START_TIME) * 0.001);
            this.lastSyncTime = Date.now();
            this.sendGameState();
        }
    }
    goldIntervalCheck() {
        if (Date.now() - this.lastGoldTime > GOLD_INTERVAL * 1000) {
            this.lastGoldTime = Date.now();
            this.daysPast += 1;
            for (var key in this.players) {
                let player = this.players[key];
                if (this.daysPast >= BALLISTA_UNLOCK_DAY) {
                    player.addUpgrade("upgBallista");
                }
                player.giveGoldPerTurn();
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
                let player = this.players[key];
                player.gold = 5000;
                player.addUpgrade("upgBallista");
            }
        }
    }
}
