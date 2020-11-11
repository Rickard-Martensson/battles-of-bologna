class Player {
    constructor(name, team) {
        this.name = name
        this.gold = 150;
        this.goldPerTurn = 30;
        this.team = team; //0 = blue
        this.currentFolder = 0;
        this.race = "human";
        this.hp = 100;
        this.btnCoolDowns = new Set([
            { folder: 1, btn: 2, time: 2 },
            { folder: 2, btn: 1, time: 0 }
        ]);
        this.disabledBtns = new Set([
            "12"
        ])
        this.upgsResearched = new Set([]);
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

    // addDisabledBtn(folder, id) {
    //     let btnName = str(folder) + str(id);
    //     this.disabledBtns.add(btnName);
    // }

    // removeDisabledBtn(folder, id) {
    //     let btnName = str(folder) + str(id);
    //     this.disabledBtns.delete(btnName);
    // }

    // checkIfBtnHidden(folder, id) {
    //     let btnName = str(folder) + str(id);
    //     return (this.disabledBtns.has(btnName));
    // }

    addCooldown(folder, btn, time) {
        this.btnCoolDowns.push({ folder: folder, btn: btn, foldertime: time })
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

    decreaseCoolDowns() {
        for (let cooldown of this.btnCoolDowns.values()) {
            console.log("cooldown", cooldown);
            cooldown.time -= 1;
            if (cooldown.time <= 0) {
                this.btnCoolDowns.delete(cooldown)
            }
        }
    }
}