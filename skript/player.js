class Player {
    constructor(name, team) {
        this.name = name
        this.gold = 80;
        this.goldPerTurn = 25;
        this.team = team; //0 = blue
        this.currentFolder = 0;
        this.race = "human";
        this.hp = 100;
        this.btnLvl = 0;
        this.castleLvl = 0;
        this.btnCoolDowns = [
            //{ folder: 3, btn: 2, time: 2, id: 1 }
        ]
        this.upgsResearched = new Set([]);
    }

    upgAbility() {
        if (this.btnLvl < ABILITY_MAX_LVL) {
            this.btnLvl += 1
        }
    }

    upgCastle() {

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


}