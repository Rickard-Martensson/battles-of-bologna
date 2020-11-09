// class Building {
//     constructor(x, y, name, team) {
//         this.pos = { x: x, y: y };
//         this.name = name;
//         this.team = team
//         this.imageSize = 40;
//         this.img = this.name + "_img"
//         if (this.team == 0) {
//             this.img += "_blue"
//         };
//         this.DRAW_SIZE = 48;
//     }

//     draw() {
//         //console.log(this.name)
//         //console.log(frame)

//         if (DRAW_NEAREST_NEIGHBOUR) { ctx.imageSmoothingEnabled = false } // viktig

//         // ctx.drawImage(Images["soldier"],
//         //     this.imageSize,
//         //     this.imageSize,
//         //     this.imageSize,
//         //     this.imageSize,

//         //     (this.pos.x - this.DRAW_SIZE / 2) * S,
//         //     (this.pos.y - this.DRAW_SIZE / 2) * S,
//         //     this.DRAW_SIZE * S,
//         //     this.DRAW_SIZE * S
//         // );
//         // ctx.globalAlpha = 1;
//         console.log

//         ctx.drawImage(Images[this.img],
//             0,
//             0,
//             this.imageSize,
//             this.imageSize,
//             this.pos.x * S,
//             (this.pos.y - 20) * S,
//             48 * S,
//             48 * S

//             // (this.pos.x - this.DRAW_SIZE / 2) * S,
//             // (this.pos.y - this.DRAW_SIZE / 2) * S,
//             // this.DRAW_SIZE * S,
//             // this.DRAW_SIZE * S
//         );
//         ctx.globalAlpha = 1;

//     }
// }


class Sprite {
    constructor(x, y, name, animations, team) {
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

        this.direction = 1
        this.team = team;
        //jahaaaa. det låter ju svinkul. Men då kan man väll bekosta sig en tävlingsgrimma. Eller åt minstonde
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
            this.animations = STATS[this.name].animations;

            this.abilities = new Set(UNIQE[this.name])
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
        this.state = "idle"

        this.DRAW_SIZE = 24;
        this.FRAME_RATE = 20;
        this._last0frame = Date.now();  //not important, debugging

        //attack
        this.lastAtkCycleDate = START_TIME;
        this.lastStartOfAtkCycleDate = null;

        this.lastDmgdTime = START_TIME
        this.invincible = false;
    }

    move() {
        this.pos.x += this.direction * this.currentSpeed * fpsCoefficient / 100;
        this.state = "walk"
    }

    attack(victim) {
        this.currentSpeed = 0;
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
                game.shootProjectile(this.pos.x, this.pos.y - 5,
                    (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * 10 * this.direction,
                    (this.range * (1 + RANGE_RANDOMNESS * Math.random())) * -12.5,
                    this.team, this.dmg);
            }
            else {
                victim.takeDmg(this.dmg)
            }
            this.lastStartOfAtkCycleDate = null //efter denhär så står spriten bara still o vibear
        }
    }

    takeDmg(dmg) {
        this.hp -= dmg
        this.invincible = false; //fixa sen
        this.lastDmgdTime = Date.now()
    }

    checkDead(game, index) {
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

    setState(state, speed, txt) {
        //if (this.name == "archer") { console.log(state, txt) }
        if (speed == 0 && state == "walk") {
            state = "idle"
        }
        if (state == "walk") {
            this.lastStartOfAtkCycleDate = null;
            this.currentSpeed = this.speed
            this.state = "walk"
            this.currentAnimation = "walk"
        }
        else if (state == "idle") {
            this.currentSpeed = 0
            this.state = "idle"
            this.currentAnimation = "idle"
        }
        else if (state == "attack") {
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
        let hitSpherePos = this.pos.x + (this.meleRange * this.direction / 2);
        let nextFriend = game.distToNextSprite2(this, this.team)
        let nextEnemy = game.distToNextSprite2(this, this.getOtherTeam())
        if (nextFriend.len < nextEnemy.len && this.row == 0) {
            if (nextFriend.len < this.meleRange + PERSONAL_SPACE && nextFriend.sprite.row == 0) {
                //eventuellt gör en attack här ifall spriten är ranged. Ja det kommer här:
                if (nextFriend.len < this.meleRange) {
                    //this.currentSpeed = 0
                    if (this.range != 0) {
                        this.attack(self)
                        this.setState("attack", -1, "ranged stutterstep")
                    }
                    else {
                        this.setState("idle", -1, "")
                    }
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
            this.frameDelay = this.animations[this.currentAnimation].getFrameRate();
        }
        else {

            //this.frameDelay--;
        }
        return this.currentFrame;
    }

    draw() {
        let fiddledWithAlpha = false
        //console.log(this.name)
        let frame = this.getFrame()
        let animation = this.animations[this.currentAnimation].getRow()
        //console.log(frame)

        if (Date.now() - this.lastDmgdTime < INVINCIBLE_DELAY) {
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