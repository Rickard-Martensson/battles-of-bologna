const BUY_QUEUE_MAX = 5;
const GOLD_UPG_MAX = 45;
var GAME_OVER = false;
const PLAYER_HP_MAX = 50;
class Player {
    //basic info
    name;
    gold;
    goldPerTurn;
    repairCost;
    team;
    currentFolder;
    clan;
    // Hp
    hp;
    prevHp;
    lastDmgdTime;
    isHurry;
    btnLvl;
    btnCoolDowns;
    upgsResearched;
    buyQueue;
    lastQueueShift;
    activeAbilities;
    pos;
    img;
    imageSize;
    castleLvl;
    lastCastleAtk;
    lastCastleBalAtk;
    DRAW_SIZE;
    constructor(name, team, img, x, y, clan) {
        this.name = name;
        this.gold = START_GOLD;
        this.goldPerTurn = 5;
        this.repairCost = 50;
        this.team = team; //0 = blue
        this.currentFolder = 0;
        this.clan = clan;
        //===HP===\\
        this.hp = PLAYER_HP_MAX;
        this.prevHp = PLAYER_HP_MAX;
        this.lastDmgdTime = Date.now();
        this.isHurry = 0;
        this.btnLvl = 0;
        this.btnCoolDowns = [
        //{ folder: 3, btn: 2, time: 2, id: 1 }
        ];
        this.upgsResearched = new Set([]);
        this.buyQueue = [];
        this.lastQueueShift = Date.now();
        this.activeAbilities = [];
        //===castle===\\
        this.pos = { x: x, y: y };
        console.log(this.clan, "clanyboy");
        this.img = CLAN_INFO[this.clan].base_img;
        console.log(this.img);
        this.imageSize = 64;
        this.castleLvl = 0;
        this.lastCastleAtk = -Infinity;
        this.lastCastleBalAtk = -Infinity;
        if (this.team == 0) {
            this.img += "_blue";
        }
        ;
        this.DRAW_SIZE = 64;
    }
    getClan() {
        return this.clan;
    }
    syncMyself(syncData = "all") {
        let data;
        if (syncData = "all") {
            data = this.getData();
        }
        else if (syncData = "eco") {
            data = this.getEcoData();
        }
        else if (syncData = "hp") {
            data = this.getHpData();
        }
        send("syncPlayer", { team: this.team, data: data });
        //console.log("synicing:", syncData)
    }
    getData() {
        let data = this;
        return data;
    }
    getEcoData() {
        let data = { gold: this.gold, goldPerTurn: this.goldPerTurn, castleLvl: this.castleLvl, lastCastleAtk: this.lastCastleAtk };
        return data;
    }
    getHpData() {
        let data = { hp: this.hp, prevHp: this.prevHp, lastDmgdTime: this.lastDmgdTime, isHurry: this.isHurry, repairCost: this.repairCost };
        return data;
    }
    updateData(newData) {
        for (var i in newData) {
            this[i] = newData[i];
            //console.log("i", i, "newdata", newData[i]);
        }
        this.upgsResearched = new Set([]);
        for (var upg in newData.upgsResearched) {
            this.upgsResearched.add(upg);
        }
    }
    addAbility(name) {
        if (!this.activeAbilities.includes(name)) {
            this.activeAbilities.push(name);
        }
        else {
            console.log("the ability", name, "is already active");
        }
    }
    checkAbility(name) {
        if (this.activeAbilities.includes(name)) {
            return true;
        }
        return false;
    }
    removeAbility(name) {
        if (this.activeAbilities.includes(name)) {
            const index = this.activeAbilities.indexOf(name);
            if (index > -1) {
                this.activeAbilities.splice(index, 1); // 2nd parameter means remove one item only
            }
        }
        else {
            console.log("could not find ability", name, "in list", this.activeAbilities);
        }
    }
    upgGoldPerTurn() {
        this.changeGoldPerTurn(UPGRADES["upgGold"].goldIncrease); //.goldPerTurn += UPGRADES["upgGold"].goldIncrease;}
    }
    castleTryAttack() {
        if (Date.now() - this.lastCastleAtk > CLAN_INFO[this.clan].arrow_delay[this.castleLvl] * 1000) {
            let projectile_type = CLAN_INFO[this.clan].projectile_type;
            let dmg = CLAN_INFO[this.clan].projectile_dmg;
            let speed = CLAN_INFO[this.clan].projectile_speed;
            let randomness = CLAN_INFO[this.clan].projectile_randomness;
            this.lastCastleAtk = Date.now();
            let pos = { x: this.pos.x, y: this.pos.y };
            let vel = { vx: (speed.vx + Math.random() * randomness.rx) * (1 - 2 * this.team), vy: (speed.vy + Math.random() * randomness.ry) };
            console.log("vel is", vel, speed.vx, Math.random(), randomness.rx);
            // console.log("yea")
            game.shootProjectile(pos, vel, this.team, dmg, IS_ONLINE, projectile_type);
        }
        if (this.castleLvl > 2 && Date.now() - this.lastCastleBalAtk > CLAN_INFO[this.clan].ballista_delay[this.castleLvl] * 1000) {
            let dmg = 1;
            this.lastCastleBalAtk = Date.now();
            let pos = { x: this.pos.x, y: this.pos.y };
            let vel = { vx: 40 * (1 - 2 * this.team), vy: -15 * (5) };
            // console.log("nah")
            game.shootProjectile(pos, vel, this.team, dmg, IS_ONLINE, "ballista");
        }
    }
    upgAbility() {
        if (this.btnLvl < ABILITY_MAX_LVL) {
            this.btnLvl += 1;
        }
    }
    upgCastle() {
        if (this.castleLvl < CASTLE_MAX_LVL) {
            this.castleLvl += 1;
            this.lastCastleAtk = -Infinity;
            this.syncMyself("eco");
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
        this.btnCoolDowns.push({ folder: folder, btn: btn, time: time, id: id });
    }
    decreaseCoolDowns(game) {
        for (var cool of this.btnCoolDowns) {
            if (cool.time != 1) {
                cool.time -= 1;
            }
            else {
                local_UI.removeDisabledButtons(this.team, cool.btn);
                cool.time = -1;
            }
        }
        this.btnCoolDowns = this.btnCoolDowns.filter(a => a.time != -1);
    }
    checkIfResearched(upgrade) {
        if (upgrade == null) {
            return true;
        }
        return (this.upgsResearched.has(upgrade));
    }
    addUpgrade(upgrade) {
        this.upgsResearched.add(upgrade);
        this.syncMyself();
    }
    repairCastle(hp) {
        this.lastDmgdTime = Date.now();
        this.prevHp = this.hp;
        this.hp += hp;
        console.log(hp, this.hp);
        this.repairCost += 10;
        if (this.hp > PLAYER_HP_MAX) {
            this.hp = PLAYER_HP_MAX;
        }
        ;
        if (IS_ONLINE) {
            this.syncMyself("hp");
        }
    }
    stealGoldPerTurn(amount) {
        send("stealGold", { team: this.team, victim: getOtherTeam(this.team), amount: amount });
    }
    takeDmg(dmg) {
        console.log("damage taken");
        this.lastDmgdTime = Date.now();
        this.prevHp = this.hp;
        this.hp = (this.hp <= 0) ? 0 : this.hp - dmg;
        if (this.hp < PLAYER_HP_MAX * 0.4 && this.isHurry == 0) {
            this.isHurry = 1;
            playSoundEffect("hurry_up");
            console.log("hurry hurry");
            playAudio("none");
            setTimeout(function () { playAudio("ingame_hurry"); local_UI.hurryUp(); }, 2400);
        }
        //if (IS_ONLINE) { this.syncMyself("hp") }
    }
    sendPackage(type, data) {
    }
    sendDmgPackage(dmg) {
        if (IS_ONLINE && mySide == 0) {
            console.log("player", this.team, "sent dmg package");
            send("castleDmg", { team: this.team, dmg: dmg, sender: 1, goldDmg: -1 });
        }
        else if (!IS_ONLINE) {
            this.takeDmg(dmg);
        }
    }
    onlineChangeGold(totGoldChange, perTurnChange, isSteal) {
        if ((Number(mySide == 0) ^ IS_ONLINE) != 1) { // antingen online och spelare 0, eller offline o vilket som helst.
            if (IS_ONLINE) {
                send("changeGold", { team: this.team, total: totGoldChange, perTurn: perTurnChange, isSteal: isSteal });
            }
            else {
                console.log("yea");
                this.localGoldChange(totGoldChange, perTurnChange, isSteal);
            }
        }
    }
    localGoldChange(totGoldChange, perTurnChange, isSteal) {
        this.gold += totGoldChange;
        this.changeGoldPerTurn(perTurnChange, false);
        console.log("yoyo", isSteal, perTurnChange);
        if (isSteal) {
            console.log("this should increase");
            game.players[getOtherTeam(this.team)].changeGoldPerTurn(-perTurnChange);
        }
    }
    changeGold(amount) {
        /**
         *
         */
        this.gold += amount;
    }
    changeGoldPerTurn(amount, shouldSync = true) {
        if (this.goldPerTurn + amount >= GOLD_UPG_MAX) {
            this.upgsResearched.add("maxGold");
        }
        else { //remove this if you dont want to be able to buy back to 45 gpt
            this.upgsResearched.delete("maxGold");
        }
        this.goldPerTurn = Math.max(5, Math.min(this.goldPerTurn + amount, GOLD_UPG_MAX));
        local_UI.justGaveGold[this.team] = Date.now();
        //if (IS_ONLINE && shouldSync) { this.syncMyself("eco") }
    }
    tryBuy(amount, shouldSync = true, reqEmptyQueue = false) {
        if (reqEmptyQueue && game.buyQueue[this.team].length > 4) {
            return false;
        }
        if (this.gold >= amount) {
            if (IS_ONLINE) {
                this.changeGold(-amount);
                // pubnubAction("upPlayer", this.team, this.getData(), 0, 0);
                if (shouldSync) {
                    this.syncMyself("eco");
                }
                return true;
            }
            else {
                this.changeGold(-amount);
                return true;
            }
        }
        else {
            return false;
        }
    }
    giveGoldPerTurn() {
        local_UI.justGaveGold[this.team] = Date.now();
        // this.changeGold(this.goldPerTurn);
        this.localGoldChange(this.goldPerTurn, 0, 0);
        playSoundEffect("buy");
    }
    changeFolder(folder) {
        this.currentFolder = folder;
    }
    attackCastle(unitHealth) {
        //this.changeGoldPerTurn(-1)
        this.sendDmgPackage(unitHealth / 2);
        this.onlineChangeGold(0, -1, true);
    }
    drawCastle() {
        ctx.drawImage(Images[this.img], this.imageSize * this.isHurry, this.imageSize * this.castleLvl, this.imageSize, this.imageSize, (this.pos.x - this.DRAW_SIZE / 2) * S, (this.pos.y - this.DRAW_SIZE / 2) * S, this.DRAW_SIZE * S, this.DRAW_SIZE * S);
    }
}
//# sourceMappingURL=player.js.map