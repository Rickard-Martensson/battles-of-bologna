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

class Scenery {
    constructor(x, y, name) {
        this.pos = { x: x, y: y }
        this.name = name
        this.img = this.name + "_img"
        this.imageSize = 64;
        let images = 8
        this.distFactor = CLOUD_DIST_FACTOR - (CLOUD_DIST_FACTOR - 1) * (y / CLOUD_MAX_HEIGHT);
        this.speed = 1 * CLOUD_SPEED * this.distFactor;

        this.id = Math.floor(images * Math.random());

        this.DRAW_SIZE = 32
        let drawSize = this.DRAW_SIZE * this.distFactor * S
        console.log(y, drawSize,)
    }

    move() {
        this.pos.x += this.speed * fpsCoefficient / 10;
    }

    checkDead(game, key) {
        if (this.pos.x > GAME_WIDTH + this.imageSize / 2) { game.scenery.splice(key, 1); game.sceneryCount--; };
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
        this.players = [
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
        this.sceneryCount = 0;
        this.scenery = [
            // new Scenery(0, 40, "cloud"),
            // new Scenery(50, 0, "cloud"),
        ]

        this.activeAbilites = [];
        this.killStatus = undefined;
        this.activeButtons = {};
        this.disabledButtons = {};
        this.currentButton = -1;

        this.justGaveGold = [null, null]

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
                    sprite.speed += SPRINT_ABILITY_SPEED
                    sprite.animTimeMult /= 2
                }
            }
        }
    }

    tryMakeCloud() {
        let randNum = Math.random()
        if (randNum < 1) {
            console.log("new cloud")
            this.sceneryCount++;
            let yPos = CLOUD_MIN_HEIGHT + Math.random() * (CLOUD_MAX_HEIGHT - CLOUD_MIN_HEIGHT)
            this.scenery.push(new Scenery(0, yPos, "cloud"));
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
        if (CLOUDS_ENABLED) { this.drawScenery(); };
        if (GRAPHICS_LEVEL != 0) { ctx.filter = UNIT_DARKNESS; };
        if (DRAW_NEAREST_NEIGHBOUR) { ctx.imageSmoothingEnabled = false } // viktig
        this.drawSprites();
        if (GRAPHICS_LEVEL > 0) { ctx.filter = DEFAULT_DARKNESS; };
        this.drawProjectiles();
        ctx.imageSmoothingEnabled = false; // viktig
        this.drawButtons();
        this.drawUI(fps);
        this.goldIntervalCheck();
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

    shootProjectile(x, y, vx, vy, team, dmg) {
        this.projectiles.push(new Projectile(x, y, vx, vy, team, dmg))
    }

    drawUI(fps) {
        this.checkMouseWithinButton()
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
            if (this.justGaveGold[playerIndex]) { ctx.fillStyle = "#FFFFFF"; }
            else { ctx.fillStyle = "#F2F2AA"; };
            ctx.fillText(Math.floor(player.gold),
                UI_POS[playerIndex].gold.x * S,
                UI_POS[playerIndex].gold.y * S
            );
            if (this.justGaveGold[playerIndex]) { ctx.fillStyle = "#F2F2AA"; }
            else { ctx.fillStyle = "#CEBC1A"; };

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
                if (spriteDir * sprite.pos.x < spriteDir * loopSprite.pos.x) {
                    let loopDist = Math.abs(sprite.pos.x - loopSprite.pos.x)
                    if (loopDist < bestCanLen) {
                        bestCanLen = loopDist
                        bestCandidate = loopSprite
                    }
                }
            }

        }
        return ({ sprite: bestCandidate, len: bestCanLen });
    }


    //===sprites===\\
    addSprite(x, y, name, anim, team) {
        this.sprites.push(new Sprite(x, y, name, anim, team))
    }

    drawSprites() {
        for (var i in this.sprites) {
            let sprite = this.sprites[i];
            sprite.canMove(this);
            sprite.move();
            sprite.draw();
            sprite.checkIfAtEnemyCastle(this);
            sprite.checkDead(game, i);
        }
        for (var i in this.players) {
            let player = this.players[i];
            player.drawCastle();
            if (player.castleLvl != 0 && Date.now() - player.lastCastleAtk > CASTLE_ARROW_DELAY[player.castleLvl] * 1000) {
                console.log("pang")
                player.castleAttack();
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
    mouseClicked() {
        //this.addSprite(300, 100, "soldier", "anim");
        var buttonPressed = this.currentButton;
        if (buttonPressed != -1) {
            this.buttonAction(buttonPressed)
            //vem  anser stud en autin bil vid en olycka .skiljer sig svaren åt sinsemellan de som har körkort och de som inte har de. beror tycker studenterna och beror svaren på med eller utan skrivbord
        }
    }

    buyUnit(unitName, team, cost) {
        if (this.players[team].tryBuy(cost)) {
            this.addSprite(BASE_POS[team].x, BASE_POS[team].y, unitName, "anim", team);
        }
    }
    buyUpgrade(upgradeName, player, cost) {
        if (upgradeName == "upgGold") {
            let cost2 = player.goldPerTurn + UPGRADES["upgGold"].costIncrease;
            if (player.tryBuy(cost2)) {
                player.changeGoldPerTurn(UPGRADES["upgGold"].costIncrease) //.goldPerTurn += UPGRADES["upgGold"].goldIncrease;
            }
        }
        else if (upgradeName == "upgCastle") {
            if (player.tryBuy(50)) {
                player.upgCastle();
                player.lastCastleAtk = -Infinity
            }
        }
        else if (upgradeName == "upgAbility") {
            let cost2 = 25 + player.btnLvl * 5
            if (player.tryBuy(cost2)) {
                player.upgAbility();
            }
        }
        else {
            if (player.tryBuy(cost)) {
                player.addUpgrade(upgradeName);
            }
        }
    }

    buttonAction(id) {
        let team = Math.floor(id / NUMBER_OF_BUTTONS);
        let player = this.players[team]
        let curFolder = player.currentFolder;
        var mod_id = id % NUMBER_OF_BUTTONS;
        let btnGlob = BTN_FOLDER[curFolder][mod_id]
        if (curFolder == 3 && mod_id == 2 && player.btnLvl != ABILITY_MAX_LVL) { btnGlob = BTN_FOLDER[curFolder][6] }

        let btnAction = btnGlob.action;
        let btnData = btnGlob.data;
        let abilityCooldown = btnGlob.abilityCooldown;
        let cost = btnGlob.cost;
        let lvl = btnGlob.lvl

        let upgRequired = btnGlob.upgrade;

        if (!this.btnIsEnabled(btnAction, player, upgRequired, lvl)) {
            console.log("either btn is hidden, or its not researched")
        }
        else if (btnAction == 'folder') {
            this.players[team].changeFolder(btnData)
        }
        else if (btnAction === 'buyUnit') {
            this.buyUnit(btnData, team, cost);
        }
        else if (btnAction === 'upgrade') {
            this.buyUpgrade(btnData, player, cost);
        }
        else if (btnAction === 'ability') {
            if (player.checkCooldown(curFolder, mod_id)) {
                this.disabledButtons[id] = true;
                player.addCooldown(curFolder, mod_id, cost, id)
                this.castAbility(btnData, team, abilityCooldown)
            }
        }
        this.activeButtons[id] = Date.now();

    }

    checkMouseWithinButton() {
        this.currentButton = -1;
        for (const [index, item] of BUTTON_LAYOUT.entries()) {
            if (Math.abs(item.x * S - this.mousePos.x) < (BUTTON_SIZE * S) / 2 && Math.abs(item.y * S - this.mousePos.y) < (BUTTON_SIZE * S) / 2) {
                this.currentButton = index;
            }
        }

    }

    removeDisabledButtons(id) {
        delete this.disabledButtons[id]
    }

    goldIntervalCheck() {
        if (Date.now() - this.timeSinceLastGold > GOLD_INTERVAL * 1000) {
            this.timeSinceLastGold = Date.now();
            for (var key in this.players) {
                let player = this.players[key]
                player.giveGoldPerTurn()

                player.decreaseCoolDowns(this);
            }

        }
        for (var i in this.players) {
            if (this.justGaveGold[i] != null && Date.now() - this.justGaveGold[i] > 200) {
                this.justGaveGold[i] = null;
            }
        }
    }

    btnIsEnabled(action, player, upgRequired, lvl) {
        // console.log(action, player, upgRequired, lvl)
        if (action == "hidden") {
            return false;
        }
        else if (action != "upgrade" ^ player.checkIfResearched(upgRequired)) { //XOR, coolt. false ^ true
            return false;
        }
        else if (player.btnLvl < lvl) {
            return false;
        }
        else if (action == "upgrade" && upgRequired == "upgCastle" && player.castleLvl >= CASTLE_MAX_LVL) {
            return false;
        }
        return true;
    }

    drawButton(index, mod_index, button, btnGlob, player) {
        let text = btnGlob.txt;
        let text2 = btnGlob.txt2;
        let img = ((player.team == 0) ? btnGlob.img + "_blue" : btnGlob.img);
        let icon = btnGlob.icon;
        let cost = ((btnGlob.cost === undefined) ? "" : btnGlob.cost); //jävlar
        let action = btnGlob.action;
        let frame = 0
        if (index in this.activeButtons || this.currentButton == index) {
            frame = 1;
            if (Date.now() - this.activeButtons[index] > BUTTON_DELAY) {
                delete this.activeButtons[index]
            }
        }
        if (index in this.disabledButtons && player.currentFolder == 3) {
            frame = 2;
        }
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(Images.button1,
            34 * frame,
            0 * 0,
            34,
            34,
            (button.x - BUTTON_SIZE / 2) * S,
            (button.y - BUTTON_SIZE / 2) * S,
            BUTTON_SIZE * S,
            BUTTON_SIZE * S
        );
        ctx.imageSmoothingEnabled = true
        if (icon != undefined) {
            drawIcon(icon, player.team, { x: button.x, y: button.y });
        }
        else {
            ctx.drawImage(Images[img],
                32 * 0, //frame
                0 * 0,
                32,
                32,
                (button.x + UI_POS_BTN.img.x - ICON_SIZE / 2) * S,
                (button.y + UI_POS_BTN.img.y - ICON_SIZE / 2) * S,
                ICON_SIZE * S,
                ICON_SIZE * S
            );
        }

        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = ((text.length > 8) ? 2.5 * S + "px 'Press Start 2P'" : 3 * S + "px 'Press Start 2P'");

        this.writeBtnText(text, button, "txt")
        if (text2 !== undefined) { this.writeBtnText(text2, button, "txt2") }

        if (cost == "%upggold%") { cost = player.goldPerTurn + 5; }
        else if (cost == "%upgcastle%") { cost = 50; }
        else if (cost == "%upgability%") { cost = 25 + player.btnLvl * 5 }

        ctx.textAlign = "end";
        ctx.font = 3 * S + "px 'Press Start 2P'";
        this.writeBtnText(cost, button, "subText")


        let btnIcon = null;
        if (action == "buyUnit" || action == "upgrade") {
            btnIcon = 0;
        }
        else if (action == "ability") {
            btnIcon = 1
        }
        if (btnIcon !== null) {
            let goldIconSize = 5
            ctx.drawImage(Images["gold"],
                16 * btnIcon,
                16 * btnIcon,
                16,
                16,

                (button.x + UI_POS_BTN.gold.x) * S,
                (button.y + UI_POS_BTN.gold.y - goldIconSize / 2) * S,
                goldIconSize * S,
                goldIconSize * S
            );
        }
    }

    writeBtnText(text, pos, name) {
        ctx.fillText(text,
            (pos.x + UI_POS_BTN[name].x) * S,
            (pos.y + UI_POS_BTN[name].y) * S,
        );
    }

    drawButtons() {
        for (const [index, item] of BUTTON_LAYOUT.entries()) {
            let mod_id = index % NUMBER_OF_BUTTONS
            let team = Math.floor(index / NUMBER_OF_BUTTONS);
            let player = this.players[team];

            let curFolder = player.currentFolder;
            let btn = BTN_FOLDER[curFolder][mod_id];
            let action = btn.action;
            let upgrade = btn.upgrade;
            let lvl = btn.lvl

            if (this.btnIsEnabled(action, player, upgrade, lvl)) {
                this.drawButton(index, mod_id, item, btn, player)
            }
            else if (curFolder == 3 && mod_id == 2 && player.btnLvl < 4) {
                btn = BTN_FOLDER[curFolder][6];
                this.drawButton(index, mod_id, item, btn, player)
            }

        }
    }
}