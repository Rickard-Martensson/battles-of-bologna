const bild = document.getElementById('');

class Building {
    constructor(x, y, img, team) {
        this.pos = { x: x, y: y };
        this.img = img + "_img"
        this.team = team;
        this.imageSize = 64;
        this.lvl = 3
        if (this.team == 0) { this.img += "_blue" };

        this.DRAW_SIZE = 64;
    }

    upgradeBuildingLevel() {
        this.lvl += 1
    }

    draw() {
        ctx.drawImage(Images[this.img],
            this.imageSize * 0,
            this.imageSize * this.lvl,
            this.imageSize,
            this.imageSize,

            (this.pos.x - this.DRAW_SIZE / 2) * S,
            (this.pos.y - this.DRAW_SIZE / 2) * S,
            this.DRAW_SIZE * S,
            this.DRAW_SIZE * S
        );
    }
}

class Icon {
    constructor(name, x, y) {
        this.name = name
        this.img = "gold";
        this.pos = { x: x, y: y }
        this.imageSize = 16;
        this.DRAW_SIZE = 16;
    }
    draw() {
        ctx.imageSmoothingEnabled = true
        ctx.drawImage(Images[this.img],
            this.imageSize * 0,
            this.imageSize * 0,
            this.imageSize,
            this.imageSize,

            (this.pos.x - this.DRAW_SIZE / 2) * S,
            (this.pos.y - this.DRAW_SIZE / 2) * S,
            this.DRAW_SIZE * S,
            this.DRAW_SIZE * S
        );
    }
}





class Player {
    constructor(name) {
        this.name = name
        this.gold = 150;
        this.goldPerTurn = 30;
        this.team = 0; //0 = blue
        this.currentFolder = 0;
        this.race = "human";
        this.hp = 100;
        this.btnCoolDowns = []
    }



    addCooldown(folder, btnId, time) {
        this.btnCoolDowns.push({ foldertime: time })
    }

    takeDmg(dmg) {
        this.hp -= dmg
    }

    changeGold(amount) {
        this.gold += amount
    }

    changeGoldPerTurn(amount) {
        this.goldPerTurn += amount
    }

    tryBuy(amount) {
        if (this.gold >= amount) {
            this.changeGold(-amount);
            return true;
        }
        else { return false; }
    }

    giveGoldPerTurn() {
        this.changeGold(this.goldPerTurn);

    }

    logGoldAmount() {
        console.log(this.gold, "gold")
    }

    changeFolder(folder) {
        this.currentFolder = folder;
    }

    attackCastle(unitHealth) {
        this.goldPerTurn -= 1
        //ändra andra spelarens gpt
        this.hp -= unitHealth
    }
}

class Scenery {
    constructor(x, y, name) {
        this.pos = { x: x, y: y }
        this.name = name
        this.img = this.name + "_img"
        this.imageSize = 64;
        let images = 8
        this.distFactor = (1 + (CLOUD_DIST_FACTOR - 1) * this.pos.y / CLOUD_MAX_HEIGHT) / CLOUD_DIST_FACTOR;
        this.speed = CLOUD_SPEED * this.distFactor;
        this.id = Math.floor(images * Math.random());

        this.DRAW_SIZE = 64
    }


    move() {
        this.pos.x += this.speed * fpsCoefficient / 10;
    }

    checkDead(game, key) {
        if (this.pos.x > GAME_WIDTH + this.imageSize / 2) { game.scenery.splice(key, 1); game.sceneryCount--; };
    }

    draw() {
        ctx.imageSmoothingEnabled = true
        ctx.drawImage(Images[this.img],
            this.imageSize * (IS_NIGHT * 2),
            this.imageSize * this.id,
            this.imageSize,
            this.imageSize,

            (this.pos.x - this.DRAW_SIZE / 2) * S,
            (this.pos.y - this.DRAW_SIZE / 2) * S,
            this.DRAW_SIZE * this.distFactor * S,
            this.DRAW_SIZE * this.distFactor * S
        );
        if (DUSK_OPACITY != 0 && DAY_NIGHT_ENABLED) {
            ctx.globalAlpha = DUSK_OPACITY;
            let drawSize = this.DRAW_SIZE * this.distFactor * S
            ctx.drawImage(Images[this.img],
                this.imageSize * 1,
                this.imageSize * this.id,
                this.imageSize,
                this.imageSize,

                (this.pos.x - this.DRAW_SIZE / 2) * S,
                (this.pos.y - this.DRAW_SIZE / 2) * S,
                drawSize,
                drawSize
            );
            ctx.globalAlpha = 1
        }

    }
}


class Game {
    constructor() {
        this.players = [
            new Player("kjelle"),
            new Player("bert"),
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
        this.buildings = [
            new Building(32, 60, "castle", 0),
            new Building(288, 60, "castle", 1),
        ]
        this.sceneryCount = 0;
        this.scenery = [
            // new Scenery(0, 40, "cloud"),
            // new Scenery(50, 0, "cloud"),
        ]

        this.activeAbilites = [];
        this.killStatus = undefined;
        this.activeButtons = {};

        this.mousePos = { x: 0, y: 0 };

        this.lastTimestamp = Date.now();
        this.tickLengthArray = [];
        this.startTime = Date.now();
        this.timeSinceLastGold = Date.now();
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
                    sprite.speed /= 2
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
                this.shootProjectile(BASE_POS[team].x, BASE_POS[team].y - 20, -(50 + 40 * Math.random()) * factor, -(50 + 20 * Math.random()), team, 2);
            }
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
                if (sprite.team == team && sprite.range != 0) {
                    sprite.activeEffects.add("target")
                }
            }
        }
        else if (name == "sprint") {
            for (var key in this.sprites) {
                let sprite = this.sprites[key];
                if (sprite.team == team) {
                    sprite.activeEffects.add("sprint")
                    sprite.speed *= 2
                    sprite.animTimeMult /= 2
                }
            }
        }
    }

    tryMakeCloud() {
        let randNum = Math.random()
        if (randNum < CLOUD_RATE) {
            this.sceneryCount++;
            let yPos = CLOUD_MIN_HEIGHT + Math.random() * (CLOUD_MAX_HEIGHT - CLOUD_MIN_HEIGHT)
            this.scenery.push(new Scenery(-32, yPos, "cloud"));
        }
    }

    changeBackground(timePassed) {
        let totalCycleTime = (CYCLE_TIME * 1000)
        let currentTime = timePassed % totalCycleTime
        let curRatioTime = currentTime / totalCycleTime
        let sunSetOpacity = Math.max(getOpacityDusk(curRatioTime, NIGHT_TIME, DUSK_TIME), getOpacityDawn(curRatioTime, DUSK_TIME))
        background1.style.opacity = sunSetOpacity
        DUSK_OPACITY = sunSetOpacity;
        // console.log("curRatioTime:", curRatioTime, sunSetOpacity)
        let unitDarkness = setUnitDarkness(curRatioTime, NIGHT_TIME, DUSK_TIME);

        if (curRatioTime > NIGHT_TIME) {
            IS_NIGHT = 1;
            background2.classList.add("bg-night");
            background2.classList.remove("bg-day");
        }
        else {
            IS_NIGHT = 0;
            background2.classList.remove("bg-night");
            background2.classList.add("bg-day");
        }
    }

    start() {
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = 20 * S + "px 'Press Start 2P'";
        ctx.fillText("Laddar...", 160 * S, 100 * S);
        let self = this;

        window.setTimeout(function () {
            START_TIME = Date.now()
            self.tick();

        }, 2000)
    }

    drawScenery() {
        for (var key in this.scenery) {
            let prop = this.scenery[key];
            prop.move();
            prop.draw();
            prop.checkDead(this, key);
        }
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
        if (DAY_NIGHT_ENABLED) { this.changeBackground(Date.now() - this.startTime); };
        if (GRAPHICS_LEVEL != 0) { ctx.filter = UNIT_DARKNESS; };
        if (DRAW_NEAREST_NEIGHBOUR) { ctx.imageSmoothingEnabled = false } // viktig
        this.drawSprites();
        if (CLOUDS_ENABLED) { this.drawScenery(); };
        if (GRAPHICS_LEVEL > 0) { ctx.filter = DEFAULT_DARKNESS; };
        this.drawProjectiles();
        if (DRAW_NEAREST_NEIGHBOUR) { ctx.imageSmoothingEnabled = true } // viktig
        this.drawButtons();
        this.drawUI(fps);
        this.giveGold();
        this.checkAbilities();

        if (CLOUDS_ENABLED && this.sceneryCount < CLOUD_MAX_COUNT) { this.tryMakeCloud(); };


        //stuff to do at the end
        //this.lastTimestamp = Date.now();
        window.requestAnimationFrame(this.tick.bind(this)); //calls itself
    }

    getMillisecondsPlayed() {
        let currentTime = new Date();
        let getMillisecondsPassed = currentTime - this.startTime;
        return getMillisecondsPassed;
    }

    giveGold() {
        if (Date.now() - this.timeSinceLastGold > GOLD_INTERVAL * 1000) {
            this.timeSinceLastGold = Date.now();
            for (var i in this.players) {
                this.players[i].giveGoldPerTurn()
            }

        }
    }
    shootProjectile(x, y, vx, vy, team, dmg) {
        this.projectiles.push(new Projectile(x, y, vx, vy, team, dmg))

    }
    drawUI(fps) {
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = 5 * S + "px 'Press Start 2P'";
        ctx.fillText(Math.floor(GOLD_INTERVAL + 1 + (this.timeSinceLastGold - Date.now()) / 1000), 160 * S, 20 * S)
        ctx.fillText(Math.floor(fps), 300 * S, 60 * S);

        ctx.textAlign = "end";

        for (var key in this.players) {
            let playerIndex = key //this.players[key].team;
            ctx.font = 5 * S + "px 'Press Start 2P'";
            var player = this.players[key]
            ctx.fillStyle = "#F2F2AA";
            ctx.fillText(Math.floor(player.gold),
                UI_POS[playerIndex].gold.x * S,
                UI_POS[playerIndex].gold.y * S
            );
            ctx.fillStyle = "#CEBC1A";

            ctx.font = 4 * S + "px 'Press Start 2P'";
            ctx.fillText('+' + Math.floor(player.goldPerTurn),
                UI_POS[playerIndex].goldPerTurn.x * S,
                UI_POS[playerIndex].goldPerTurn.y * S
            );
            ctx.imageSmoothingEnabled = true
            let goldIconSize = 6
            ctx.drawImage(Images["gold"],
                0,
                0,
                16,
                16,

                // (this.pos.x - goldIconSize / 2) * S,
                // (this.pos.y - goldIconSize / 2) * S,
                (UI_POS[playerIndex].goldIcon.x) * S,
                (UI_POS[playerIndex].goldIcon.y - goldIconSize / 2) * S,
                goldIconSize * S,
                goldIconSize * S
            );
        }
    }

    distToNextSprite(sprite, team) {
        let bestCandidate = null;
        let bestCanLen = Infinity;
        let spriteDir = sprite.direction
        for (var i in this.sprites) {
            let loopSprite = this.sprites[i]
            if (team == loopSprite.team) {   //jafan
                //console.log(spriteDir * sprite.pos.x, spriteDir * loopSprite.pos.x, "comp")
                if (spriteDir * sprite.pos.x < spriteDir * loopSprite.pos.x) {
                    let loopDist = Math.abs(sprite.pos.x - loopSprite.pos.x)
                    //console.log(loopDist, "loopDist")
                    if (loopDist < bestCanLen) {
                        bestCanLen = loopDist
                        bestCandidate = loopSprite
                    }
                }
            }

        }
        return ({ sprite: bestCandidate, len: bestCanLen });
        //console.log(bestCanLen)
    }


    //===sprites===\\
    addSprite(x, y, name, anim, team) {
        this.sprites.push(new Sprite(x, y, name, anim, team))
    }

    drawSprites() {
        for (var i in this.sprites) {
            this.sprites[i].canMove(this);
            this.sprites[i].move()
            this.sprites[i].draw()
            this.sprites[i].checkIfAtEnemyCastle(this)
            this.sprites[i].checkDead(game, i)

        }
        for (var key in this.buildings) {
            let building = this.buildings[key];
            building.draw()
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
    mouseClicked() {
        //this.addSprite(300, 100, "soldier", "anim");
        var buttonPressed = this.checkMouseWithinButton();
        if (buttonPressed != -1) {
            this.buttonAction(buttonPressed)
            //vem  anser stud en autin bil vid en olycka .skiljer sig svaren åt sinsemellan de som har körkort och de som inte har de. beror tycker studenterna och beror svaren på med eller utan skrivbord
        }
    }

    buyUnit(unitName, team) {
        if (this.players[team].tryBuy(STATS[unitName].cost)) {
            this.addSprite(BASE_POS[team].x, BASE_POS[team].y, unitName, "anim", team);
        }
    }
    buyUpgrade(upgradeName, player) {
        if (upgradeName == "upgGold") {
            let cost = this.players[player].goldPerTurn + UPGRADES["upgGold"].costIncrease;
            console.log(cost)
            if (this.players[player].tryBuy(cost)) {
                console.log("tja")
                this.players[player].goldPerTurn += UPGRADES["upgGold"].goldIncrease;
            }
        }
    }

    buttonAction(id) {
        let team = Math.floor(id / NUMBER_OF_BUTTONS);
        let curFolder = this.players[team].currentFolder;

        var mod_id = id % NUMBER_OF_BUTTONS;
        let btnAction = BTN_FOLDER[curFolder][mod_id].action;
        let btnData = BTN_FOLDER[curFolder][mod_id].data;
        let btnCooldown = BTN_FOLDER[curFolder][mod_id].btnCooldown;
        let abilityCooldown = BTN_FOLDER[curFolder][mod_id].abilityCooldown;

        if (btnAction == "hidden") {   //typeof null === 'object'
            console.log("how the fuck did you press a non-existent button")
        }
        else if (btnAction == 'folder') {
            this.players[team].changeFolder(btnData)
        }
        else if (btnAction === 'buyUnit') {
            this.buyUnit(btnData, team);
        }
        else if (btnAction === 'upgrade') {
            console.log(btnData, team)
            this.buyUpgrade(btnData, team);
        }
        else if (btnAction === 'ability') {
            console.log(btnData, team)
            this.castAbility(btnData, team, abilityCooldown)
        }
        this.activeButtons[id] = Date.now();

    }

    checkMouseWithinButton() {
        for (const [index, item] of BUTTON_LAYOUT.entries()) {
            if (Math.abs(item.x * S - this.mousePos.x) < (BUTTON_SIZE * S) / 2 && Math.abs(item.y * S - this.mousePos.y) < (BUTTON_SIZE * S) / 2) {
                return index;
            }
        }
        return -1;
    }

    btnCoolDown() {

    }

    drawButtons() {
        for (const [index, item] of BUTTON_LAYOUT.entries()) {
            let mod_id = index % NUMBER_OF_BUTTONS
            let team = Math.floor(index / NUMBER_OF_BUTTONS);

            var frame = 0;

            let curFolder = this.players[team].currentFolder;
            let btnAction = BTN_FOLDER[curFolder][mod_id].action;
            let btnText = BTN_FOLDER[curFolder][mod_id].txt;
            let btnText2 = BTN_FOLDER[curFolder][mod_id].txt2;
            let btnImg = BTN_FOLDER[curFolder][mod_id].img;
            let btnSubText = BTN_FOLDER[curFolder][mod_id].subText;
            let abilityCooldown = BTN_FOLDER[curFolder][mod_id].abilityCooldown;

            if (btnSubText === undefined) { btnSubText = "" };

            if (team == 0 && btnImg != null) { btnImg += "_blue" }


            if (this.checkMouseWithinButton() == index) {
                frame = 1
            }
            if (index in this.activeButtons) {
                frame = 1
                if (Date.now() - this.activeButtons[index] > BUTTON_DELAY) {
                    delete this.activeButtons[index]
                }
            }

            if (DRAW_NEAREST_NEIGHBOUR) { ctx.imageSmoothingEnabled = false }

            if (btnAction != "hidden") {
                ctx.drawImage(Images.button1,
                    34 * frame,
                    0 * 0,
                    34,
                    34,
                    (item.x - BUTTON_SIZE / 2) * S,
                    (item.y - BUTTON_SIZE / 2) * S,
                    BUTTON_SIZE * S,
                    BUTTON_SIZE * S
                );

                ctx.drawImage(Images[btnImg],
                    32 * 0, //frame
                    0 * 0,
                    32,
                    32,
                    (item.x + UI_POS_BTN.img.x - ICON_SIZE / 2) * S,
                    (item.y + UI_POS_BTN.img.y - ICON_SIZE / 2) * S,
                    ICON_SIZE * S,
                    ICON_SIZE * S
                );

                ctx.textAlign = "center";
                ctx.fillStyle = "#ffffff";
                if (btnText.length > 8) { ctx.font = 2.5 * S + "px 'Press Start 2P'"; }
                else { ctx.font = 3 * S + "px 'Press Start 2P'"; }
                ctx.fillText(btnText,
                    (item.x) * S,
                    (item.y + UI_POS_BTN.txt.y) * S,
                );
                if (btnText2 != null) {
                    ctx.fillText(btnText2,
                        (item.x) * S,
                        (item.y + UI_POS_BTN.txt2.y) * S,
                    );
                }

                if (btnSubText == "%upgold%") {
                    btnSubText = this.players[team].goldPerTurn + 5;
                }

                ctx.textAlign = "end";
                ctx.font = 3 * S + "px 'Press Start 2P'";
                ctx.fillText(btnSubText,
                    (item.x + UI_POS_BTN.txt.x) * S,
                    (item.y + UI_POS_BTN.subText.y) * S,
                );
                let btnIcon = null;
                if (btnAction == "buyUnit" || btnAction == "upgrade") {
                    btnIcon = 0;
                }
                else if (btnAction == "ability") {
                    btnIcon = 1
                }
                if (btnIcon !== null) {
                    ctx.imageSmoothingEnabled = false
                    let goldIconSize = 5
                    ctx.drawImage(Images["gold"],
                        16 * btnIcon,
                        16 * btnIcon,
                        16,
                        16,

                        (item.x + UI_POS_BTN.gold.x) * S,
                        (item.y + UI_POS_BTN.gold.y - goldIconSize / 2) * S,
                        goldIconSize * S,
                        goldIconSize * S
                    );
                }
            }

        }
    }
}