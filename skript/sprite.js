
class Sprite {
    constructor(x, y, name, animations, team) {
        this.pos = { x: x, y: y };
        this.name = name
        this.imageName = this.name;
        this.animations = {
            idle: new Animation(32, 0, 8, 60, true),
            walk: new Animation(32, 1, 8, 20, true),
            attack: new Animation(32, 2, 7, 20, false),
        };
        this.frameDelay = 20;    //how many ms left until next frame
        this.currentFrame = 0;

        this.direction = 1
        this.team = team;

        if (this.name in STATS) {
            this.hp = STATS[this.name].hp;
            this.atkSpeed = STATS[this.name].atkSpeed;
            this.atkDelay = STATS[this.name].atkDelay;
            this.dmg = STATS[this.name].dmg;
            this.meleRange = STATS[this.name].meleRange;
            this.range = STATS[this.name].range;
            this.speed = STATS[this.name].speed;
            this.img = STATS[this.name].img;
            this.imageSize = STATS[this.name].imageSize;
            this.size = STATS[this.name].size;
            this.cost = STATS[this.name].cost;
            this.row = STATS[this.name].row;

            this.abilities = new Set(UNIQE[this.name]);
        }
        else { console.log("unknown sprite") };
        if (this.team == 0) {
            this.direction = 1;
            this.img += "_blue"
        }
        else if (this.team == 1) {
            this.direction = -1
        }

        this.currentAnimation = "walk";
        this.currentSpeed = this.speed
        this.isMoving = true
        this.state = "idle"

        this.DRAW_SIZE = 24;
        this.FRAME_RATE = 20;
        this._last0frame = Date.now();  //not important

        this.lastAtkTime = START_TIME
        this.delayAtkTime = null;

        this.lastDmgdTime = START_TIME
        this.invincible = false;
    }

    move() {
        this.pos.x += this.direction * this.currentSpeed * fpsCoefficient / 100;
        this.state = "walk"
    }

    attack(victim) {
        this.currentSpeed = 0;
        this.isMoving = false

        if (Date.now() - this.lastAtkTime > this.atkSpeed) {
            if (this.delayAtkTime === null) {
                this.currentAnimation = "attack"
                this.delayAtkTime = Date.now();
                this.currentFrame = 0
            }
            else if (Date.now() - this.delayAtkTime > this.atkDelay) {
                this.lastAtkTime = Date.now();
                this.delayAtkTime = null;
                if (this.range > 0) {
                    game.shootProjectile(this.pos.x, this.pos.y, 30 * this.direction, -40, this.team, this.dmg)
                }
                else { victim.takeDmg(this.dmg) }

            }
        }
        else {
            //this.currentAnimation = "idle"
        }
    }

    takeDmg(dmg) {
        this.hp -= dmg
        this.invincible = false; //fixa sen
        this.lastDmgdTime = Date.now()
    }

    checkDead(index) {
        if (this.hp < 0) {
            index > -1 ? game.sprites.splice(index, 1) : false
        }
    }

    getOtherTeam() {
        if (this.team == 0) { return 1; }
        else if (this.team == 1) { return 0; }
        return -1;
    }



    setState(state, speed) {
        if (state == "walk") {
            this.state = "walk"
            this.currentAnimation = "walk"
        }
        else if (state == "idle") {
            this.state = "idle"
            this.currentAnimation = "idle"
        }

    }

    canMove2(game) {

        this.setState("walk")
        let hitSpherePos = this.pos.x + (this.meleRange * this.direction / 2);
        let nextFriend = game.distToNextSprite2(this, this.team)
        let nextEnemy = game.distToNextSprite2(this, this.getOtherTeam())
        if (nextFriend.len < this.meleRange + PERSONAL_SPACE && this.row == nextFriend.sprite.row) {
            this.currentSpeed = Math.min(nextFriend.sprite.currentSpeed, this.speed)
            //eventuellt gör en attack här ifall spriten är ranged. Ja det kommer här:
            if (nextFriend.len < this.meleRange) {
                if (this.name == "archer") { console.log("idle1") }
                this.setState("walk")
                this.currentSpeed = 0
                if (this.range != 0) {
                    this.attack(self)
                }
            }
        }
        else { this.currentSpeed = this.speed }

        if (nextEnemy.len + MELE_RANGE_BUFFER < this.meleRange) {
            if (nextEnemy.sprite.row == this.row) {
                console.log("hej")
                this.attack(nextEnemy.sprite)
            }
            else if (this.abilities.has("changeRow")) {
                this.row = 0;
            }
        }
    }








    // canMove(game) {
    //     var myAtkPos = this.pos.x + (this.meleRange * this.direction / 2);
    //     let distToNext = game.distToNextSprite(this)
    //     console.log(distToNext.len, this.meleRange + 1, "kachow")
    //     if (distToNext.len < this.meleRange + 1) {
    //         console.log("yea")
    //         this.currentSpeed = distToNext.sprite.currentSpeed;
    //     }
    //     else { this.currentSpeed = this.speed }
    //     for (var i in game.sprites) {
    //         let loopSprite = game.sprites[i]
    //         if (loopSprite != this) {
    //             if (Math.abs(loopSprite.pos.x - myAtkPos) + .1 < this.meleRange / 2) {
    //                 if (loopSprite.row == this.row) {
    //                     if (loopSprite.team != this.team) {
    //                         this.attack(loopSprite)
    //                     }
    //                     else if (loopSprite.team == this.team) {
    //                         this.isIdle(true)
    //                     }
    //                     return;

    //                 }
    //                 else if (this.abilities.has("changeRow")) {
    //                     if (loopSprite.team != this.team) {
    //                         this.row = 0;
    //                     }
    //                     //if this.DRAW_SIZE
    //                 }
    //             }
    //         }
    //     }
    //     //this.isIdle(false)
    // }

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
            this.frameDelay = this.animations[this.currentAnimation].getFrameRate();
        }
        else {

            //this.frameDelay--;
        }
        return this.currentFrame;
    }

    draw() {
        //console.log(this.name)
        let frame = this.getFrame()
        let animation = this.animations[this.currentAnimation].getRow()
        //console.log(frame)

        if (DRAW_NEAREST_NEIGHBOUR) { ctx.imageSmoothingEnabled = false } // viktig

        if (Date.now() - this.lastDmgdTime < INVINCIBLE_DELAY) {
            ctx.globalAlpha = 0.6;
        }
        ctx.drawImage(Images[this.img],
            this.imageSize * frame,
            this.imageSize * animation,
            this.imageSize,
            this.imageSize,

            (this.pos.x - this.DRAW_SIZE / 2) * S,
            (this.pos.y - this.DRAW_SIZE / 2) * S,
            this.DRAW_SIZE * S,
            this.DRAW_SIZE * S
        );
        ctx.globalAlpha = 1;

    }
}