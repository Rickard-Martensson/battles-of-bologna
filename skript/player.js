const BUY_QUEUE_MAX = 5;
const GOLD_UPG_MAX = 45;


class Player {
    constructor(name, team, img, x, y) {
        this.name = name
        this.gold = 50;
        this.goldPerTurn = 5;
        this.team = team; //0 = blue
        this.currentFolder = 0;
        this.race = "human";
        this.hp = 99;
        this.btnLvl = 0;
        this.btnCoolDowns = [
            //{ folder: 3, btn: 2, time: 2, id: 1 }
        ]
        this.upgsResearched = new Set([]);
        this.buyQueue = [];
        this.lastQueueShift = Date.now()

        //===castle===\\
        this.pos = { x: x, y: y };
        this.img = img;
        this.imageSize = 64;
        this.castleLvl = 0;
        this.lastCastleAtk = -Infinity;
        if (this.team == 0) { this.img += "_blue" };

        this.isHurry = false;

        this.DRAW_SIZE = 64;
    }

    // addToBuyQueue(unit) {
    //     // this.buyQueue.push(unit);
    //     game.buyQueue.push(unit);
    // }

    // checkBuyQueue() { // maybe just let host handle buyque. Well thats tomorrows problem
    //     if (this.buyQueue.length > 0 && Date.now() - this.lastQueueShift > 0.2 * 1000) {
    //         let team = this.team
    //         let len = game.distToNextSprite2(team, { x: BASE_POS[team].x - getDirection(team), y: BASE_POS[team].y }).len;
    //         if (len < 11) {
    //         }
    //         else {
    //             this.lastQueueShift = Date.now()
    //             let firstUnit = this.buyQueue.shift()
    //             if (IS_ONLINE) {
    //                 send("sendUnit", { team: team, unit: firstUnit });
    //                 console.log("oui")
    //             }
    //             else { game.addSprite(firstUnit, team); }
    //         }
    //     }

    // }

    getData() {
        let data = this;
        return data;
    }

    updateData(newData) {
        for (var i in newData) {
            this[i] = newData[i];
            //console.log("i", i, "newdata", newData[i]);
        }

        this.upgsResearched = new Set([]);
        for (var upg in newData.upgsResearched) {
            this.upgsResearched.add(upg)
        }
    }

    upgGoldPerTurn() {
        this.changeGoldPerTurn(UPGRADES["upgGold"].costIncrease) //.goldPerTurn += UPGRADES["upgGold"].goldIncrease;}
        this.syncMyself()

    }

    castleAttack() {
        let dmg = 3;
        this.lastCastleAtk = Date.now()
        let pos = { x: this.pos.x, y: this.pos.y }
        let vel = { vx: 35 * (Math.random() + 1) * (1 - 2 * this.team), vy: -15 * (Math.random() * 1 + 4.5) }
        game.shootProjectile({ x: this.pos.x, y: this.pos.y }, { vx: 35 * (Math.random() + 1) * (1 - 2 * this.team), vy: -15 * (Math.random() * 1 + 4.5) }, this.team, dmg, IS_ONLINE)
        if (this.castleLvl > 2) {
            void (0)
        }
    }

    upgAbility() {
        if (this.btnLvl < ABILITY_MAX_LVL) {
            this.btnLvl += 1
        }
    }

    upgCastle() {
        if (this.castleLvl < CASTLE_MAX_LVL) {
            console.log("leeveeell", this.castleLvl)
            this.castleLvl += 1
            this.lastCastleAtk = -Infinity
            this.syncMyself()

        }
    }

    checkCooldown(folder, btn) {
        for (const cool of this.btnCoolDowns) {
            if (cool.folder == folder && cool.btn == btn) {
                return false;
            }
        }
        return true;
    }

    addCooldown(folder, btn, time, id) {
        this.btnCoolDowns.push({ folder: folder, btn: btn, time: time, id: id })
    }

    decreaseCoolDowns(game) {
        for (var cool of this.btnCoolDowns) {
            if (cool.time != 1) {
                cool.time -= 1;
            }
            else {
                local_UI.removeDisabledButtons(this.team, cool.btn)
                cool.time = -1
            }
        }
        this.btnCoolDowns = this.btnCoolDowns.filter(a => a.time != -1)
    }

    checkIfResearched(upgrade) {
        if (upgrade == null) {
            return true;
        }
        return (this.upgsResearched.has(upgrade));
    }

    addUpgrade(upgrade) {
        this.upgsResearched.add(upgrade);
        this.syncMyself()
    }


    takeDmg(dmg) {
        this.hp -= dmg
        console.log("dmg dmg")
        if (this.hp < 90 && !this.isHurry) {
            this.isHurry = true;
            playSoundEffect("hurry_up");
            console.log("hurry hurry")
            setTimeout(playAudio("ingame_hurry"), 1000);
        }
    }

    changeGold(amount) {
        this.gold += amount
    }

    changeGoldPerTurn(amount) {
        if (this.goldPerTurn + amount >= GOLD_UPG_MAX) {
            this.upgsResearched.add("maxGold")
        }
        else {  //remove this if you dont want to be able to buy back to 45 gpt
            this.upgsResearched.delete("maxGold")
        }
        this.goldPerTurn = Math.min(this.goldPerTurn + amount, GOLD_UPG_MAX);
        local_UI.justGaveGold[this.team] = Date.now();
    }

    syncMyself() {
        send("syncPlayer", { team: this.team, data: this.getData() })
    }

    tryBuy(amount, shouldSync = true) {
        if (this.gold >= amount) {
            playSoundEffect("buy")

            if (local_UI.isOnline) {
                this.changeGold(-amount);
                // pubnubAction("upPlayer", this.team, this.getData(), 0, 0);
                if (shouldSync) { this.syncMyself() }

                return true;
            } else {
                this.changeGold(-amount);
                return true;
            }
        }
        else { return false; }
    }

    giveGoldPerTurn() {
        local_UI.justGaveGold[this.team] = Date.now();
        this.changeGold(this.goldPerTurn);

    }

    changeFolder(folder) {
        this.currentFolder = folder;
    }

    attackCastle(unitHealth) {
        this.changeGoldPerTurn(-1)
        this.takeDmg(Math.floor(unitHealth / 2)) //unitHealth
    }

    drawCastle() {
        ctx.drawImage(Images[this.img],
            this.imageSize * 0,
            this.imageSize * this.castleLvl,
            this.imageSize,
            this.imageSize,

            (this.pos.x - this.DRAW_SIZE / 2) * S,
            (this.pos.y - this.DRAW_SIZE / 2) * S,
            this.DRAW_SIZE * S,
            this.DRAW_SIZE * S
        );
    }
}


