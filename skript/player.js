class Player {
    constructor(name, team, img, x, y) {
        this.name = name
        this.gold = 500;
        this.goldPerTurn = 5;
        this.team = team; //0 = blue
        this.currentFolder = 0;
        this.race = "human";
        this.hp = 100;
        this.btnLvl = 0;
        this.btnCoolDowns = [
            //{ folder: 3, btn: 2, time: 2, id: 1 }
        ]
        this.upgsResearched = new Set([]);

        //===castle===\\
        this.pos = { x: x, y: y };
        this.img = img;
        this.imageSize = 64;
        this.castleLvl = 0;
        this.lastCastleAtk = -Infinity;
        if (this.team == 0) { this.img += "_blue" };

        this.DRAW_SIZE = 64;
    }

    getData() {
        let data = this;
        return data;
    }

    updateData(newData) {
        console.log("kachow4", newData);
        for (var i in newData) {
            this[i] = newData[i];
            console.log("i", i, "newdata", newData[i]);
        }

        this.upgsResearched = new Set([]);
        for (var upg in newData.upgsResearched) {
            this.upgsResearched.add(upg)
        }
    }

    upgGoldPerTurn() {
        this.changeGoldPerTurn(UPGRADES["upgGold"].costIncrease) //.goldPerTurn += UPGRADES["upgGold"].goldIncrease;}

    }

    castleAttack() {
        let dmg = 3;
        this.lastCastleAtk = Date.now()
        let pos = { x: this.pos.x, y: this.pos.y }
        let vel = { vx: 35 * (Math.random() + 1) * (1 - 2 * this.team), vy: -15 * (Math.random() * 1 + 4.5) }
        game.shootProjectile(this.pos.x, this.pos.y, 35 * (Math.random() + 1) * (1 - 2 * this.team), -15 * (Math.random() * 1 + 4.5), this.team, dmg, IS_ONLINE)
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
    }


    takeDmg(dmg) {
        this.hp -= dmg
    }

    changeGold(amount) {
        this.gold += amount
    }

    changeGoldPerTurn(amount) {
        this.goldPerTurn += amount;
        local_UI.justGaveGold[this.team] = Date.now();
    }

    tryBuy(amount) {
        if (this.gold >= amount) {

            if (local_UI.isOnline) {
                this.changeGold(-amount);
                pubnubAction("upPlayer", this.team, this.getData(), 0, 0);
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
        this.hp -= 10 //unitHealth
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


