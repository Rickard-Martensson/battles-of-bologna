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

    castleAttack() {
        let dmg = 3;
        this.lastCastleAtk = Date.now()
        game.shootProjectile(this.pos.x, this.pos.y, 35 * (Math.random() + 1) * (1 - 2 * this.team), -15 * (Math.random() * 1 + 4.5), this.team, dmg)
        if (this.castleLvl > 2) {
        }
    }

    upgAbility() {
        if (this.btnLvl < ABILITY_MAX_LVL) {
            this.btnLvl += 1
        }
    }

    upgCastle() {
        if (this.castleLvl <= CASTLE_MAX_LVL) {
            this.castleLvl += 1
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
                game.removeDisabledButtons(cool.btn)
                cool.time = -1
            }
        }
        this.btnCoolDowns = this.btnCoolDowns.filter(a => a.time != -1)
    }


    updateDisabledBtns(game) {

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
        game.justGaveGold[this.team] = Date.now();
    }

    tryBuy(amount) {
        if (this.gold >= amount) {
            this.changeGold(-amount);
            return true;
        }
        else { return false; }
    }

    giveGoldPerTurn() {
        game.justGaveGold[this.team] = Date.now();
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


