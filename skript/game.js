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

        this.activeAbilites = [];
        this.killStatus = undefined;

        this.mousePos = { x: 0, y: 0 };

        this.lastTimestamp = Date.now();
        this.tickLengthArray = [];
        this.startTime = Date.now();
        this.timeSinceLastGold = Date.now();

    }

    pubNubTranslate(name, team, data) {

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


        if (GRAPHICS_LEVEL != 0) { ctx.filter = UNIT_DARKNESS; };
        if (DRAW_NEAREST_NEIGHBOUR) { ctx.imageSmoothingEnabled = false } // viktig
        this.drawSprites();
        if (GRAPHICS_LEVEL > 0) { ctx.filter = DEFAULT_DARKNESS; };
        this.drawProjectiles();
        ctx.imageSmoothingEnabled = false; // viktig
        local_UI.drawEverything(fps);
        //this.drawUI(fps);
        this.goldIntervalCheck();
        this.checkAbilities();


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


    // === sprites === \\
    addSprite(name, anim, team) {
        this.sprites.push(new Sprite(BASE_POS[team].x, BASE_POS[team].y, name, anim, team))
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
            if (local_UI.justGaveGold[i] != null && Date.now() - local_UI.justGaveGold[i] > 200) {
                local_UI.justGaveGold[i] = null;
            }
        }
    }


}