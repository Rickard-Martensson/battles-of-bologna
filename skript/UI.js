
const CHAT_MSG_ROW_PAD = 4;
const CHAT_MSG_NAME_PAD = 20;



class UI {
    constructor(players, isOnline) {
        this.players = players // [0], [0,1] eller [1]
        this.isOnline = ((isOnline) ? true : false);

        this.activeButtons = [{}, {}];
        this.disabledButtons = [{}, {}];

        this.mousePos = { x: 0, y: 0 };
        this.currentButton = { team: -1, id: -1 };

        this.sceneryCount = 0;
        this.scenery = [];

        this.justGaveGold = [null, null];

        this.chatmsgs = [
            { sender: "Bert", msg: "Tjena kexet" },
            { sender: "Kjelle", msg: "Tjatja bramski" },
            { sender: "Bert", msg: "TEy bro!" }
        ];
    }

    addChatMsg(sender, msg) {
        this.chatmsgs.push({ sender: sender, msg: msg })
    }

    drawChatBox(team) {
        if (this.isOnline) {
            ctx.textAlign = "start";
            ctx.font = 3 * S + "px 'Press Start 2P'";
            for (var i in this.chatmsgs) {
                let msg = this.chatmsgs[i].msg;
                let sender = this.chatmsgs[i].sender;
                ctx.fillText(sender,
                    (UI_POS[team].chatBox.chat.x) * S,
                    (UI_POS[team].chatBox.chat.y + CHAT_MSG_ROW_PAD * i) * S,
                );
                ctx.fillText(msg,
                    (UI_POS[team].chatBox.chat.x + CHAT_MSG_NAME_PAD) * S,
                    (UI_POS[team].chatBox.chat.y + CHAT_MSG_ROW_PAD * i) * S,
                );
            }
            ctx.fillText(currentMsg,
                (UI_POS[team].chatBox.input.x + CHAT_MSG_NAME_PAD) * S,
                (UI_POS[team].chatBox.input.y + CHAT_MSG_ROW_PAD * i) * S,
            );

        }
    }

    drawEverything(fps) {
        for (var key in this.players) {
            let team = this.players[key]
            this.drawButtons(team);
            if (this.isOnline) {
                this.drawChatBox(team)
            }
        }



        if (DAY_NIGHT_ENABLED) { this.changeBackground(Date.now() - game.startTime); };
        if (CLOUDS_ENABLED) { this.drawScenery(); };
        if (CLOUDS_ENABLED && this.sceneryCount < CLOUD_MAX_COUNT) { this.tryMakeCloud(); };

        this.drawUI(fps)

    }


    // === background === \\

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


    // === clouds === \\

    tryMakeCloud() {
        let randNum = Math.random()
        if (randNum < 1) {
            this.sceneryCount++;
            let yPos = CLOUD_MIN_HEIGHT + Math.random() * (CLOUD_MAX_HEIGHT - CLOUD_MIN_HEIGHT)
            this.scenery.push(new Scenery(0, yPos, "cloud"));
        }
    }

    drawScenery() {
        for (var key in this.scenery) {
            let prop = this.scenery[key];
            prop.move();
            prop.draw();
            prop.checkDead(this, key);
        }
    }





    // === utility === \\

    getPlayer(team) {
        return game.players[team];
    }



    //=== user controlls ===\\

    mouseClicked() {
        var id = this.currentButton.id;
        var team = this.currentButton.team;
        if (team != -1) {
            this.buttonAction(id, team)
        }
    }


    checkMouseWithinButton() {
        this.currentButton = { team: -1, id: -1 };
        for (var key in this.players) {
            let team = this.players[key]
            for (const [index, item] of BTN_LAYOUT[team].entries()) {
                if (Math.abs(item.x * S - this.mousePos.x) < (BUTTON_SIZE * S) / 2 && Math.abs(item.y * S - this.mousePos.y) < (BUTTON_SIZE * S) / 2) {
                    this.currentButton = { team: team, id: index };
                }
            }
        }
    }

    //=== user action ===\\

    buyUnit(unitName, player, team, cost) {
        if (player.tryBuy(cost)) {
            //some pubnub shit
            if (this.isOnline) { pubnubAction("addSprite", team, unitName); }
            else { game.addSprite(unitName, "anim", team); }
        }
    }

    buyUpgrade(upgradeName, player, cost, team) {
        if (upgradeName == "upgGold") {
            let cost2 = player.goldPerTurn + UPGRADES["upgGold"].costIncrease;
            if (player.tryBuy(cost2)) {
                //if (this.isOnline) { pubnubAction("upgGold", team, player); }
                player.upgGoldPerTurn();
            }
        }
        else if (upgradeName == "upgCastle") {
            if (player.tryBuy(50)) {

                if (this.isOnline) { pubnubAction("upgCastle", team, player) }
                else { player.upgCastle(); }
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

    buttonAction(id, team) {
        let player = this.getPlayer(team)
        let curFolder = player.currentFolder;
        let btnGlob = BTN_FOLDER[curFolder][id]
        if (curFolder == 3 && id == 2 && player.btnLvl != ABILITY_MAX_LVL) { btnGlob = BTN_FOLDER[curFolder][6] }

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
            player.changeFolder(btnData)
        }
        else if (btnAction === 'buyUnit') {
            this.buyUnit(btnData, player, team, cost);
        }
        else if (btnAction === 'upgrade') {
            this.buyUpgrade(btnData, player, cost, team);
        }
        else if (btnAction === 'ability') {
            if (player.checkCooldown(curFolder, id)) {
                this.disabledButtons[team][id] = true;
                player.addCooldown(curFolder, id, cost, id)
                this.castAbility(btnData, team, abilityCooldown)
            }
        }
        this.activeButtons[team][id] = Date.now();

    }

    castAbility(abilityName, team, abilityCooldown) {
        if (this.isOnline) {
            //some pubnub shit
            pubnubAction("castAbility", team, abilityName, abilityCooldown);
        }
        else {
            game.castAbility(abilityName, team, abilityCooldown)
        }
    }


    // === drawing sprites === \\





    //=== drawing UI === \\

    removeDisabledButtons(team, id) {
        delete this.disabledButtons[team][id]
    }

    drawUI(fps) {
        this.checkMouseWithinButton()
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = 5 * S + "px 'Press Start 2P'";
        ctx.fillText(Math.floor(GOLD_INTERVAL + 1 + (game.timeSinceLastGold - Date.now()) / 1000), 160 * S, 20 * S)
        ctx.fillText(Math.floor(fps), 300 * S, 60 * S);

        ctx.textAlign = "end";

        for (var playerKey in game.players) {
            ctx.font = 5 * S + "px 'Press Start 2P'";
            var player = game.players[playerKey]

            if (this.justGaveGold[playerKey]) { ctx.fillStyle = "#FFFFFF"; }
            else { ctx.fillStyle = "#F2F2AA"; };
            ctx.fillText(Math.floor(player.gold),
                UI_POS[playerKey].gold.x * S,
                UI_POS[playerKey].gold.y * S
            );
            if (this.justGaveGold[playerKey]) { ctx.fillStyle = "#F2F2AA"; }
            else { ctx.fillStyle = "#CEBC1A"; };

            ctx.font = 4 * S + "px 'Press Start 2P'";
            ctx.fillText('+' + Math.floor(player.goldPerTurn),
                UI_POS[playerKey].goldPerTurn.x * S,
                UI_POS[playerKey].goldPerTurn.y * S
            );
            ctx.imageSmoothingEnabled = true
            let goldIconSize = 6
            ctx.drawImage(Images["gold"],
                0,
                0,
                16,
                16,
                (UI_POS[playerKey].goldIcon.x) * S,
                (UI_POS[playerKey].goldIcon.y - goldIconSize / 2) * S,
                goldIconSize * S,
                goldIconSize * S
            );

        }
    }

    btnIsEnabled(action, player, upgRequired, lvl) {
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


    writeBtnText(text, pos, name) {
        ctx.fillText(text,
            (pos.x + UI_POS_BTN[name].x) * S,
            (pos.y + UI_POS_BTN[name].y) * S,
        );
    }

    btnIsEnabled(action, player, upgRequired, lvl) {
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

    drawButtons(team) {
        for (const [index, item] of BTN_LAYOUT[team].entries()) {
            let player = this.getPlayer(team);
            let curFolder = player.currentFolder;
            let btn = BTN_FOLDER[curFolder][index];
            let action = btn.action;
            let upgrade = btn.upgrade;
            let lvl = btn.lvl

            if (this.btnIsEnabled(action, player, upgrade, lvl)) {
                this.drawButton(index, item, btn, player, team)
            }

            else if (curFolder == 3 && index == 2 && player.btnLvl < ABILITY_MAX_LVL) {
                btn = BTN_FOLDER[curFolder][6];
                this.drawButton(index, item, btn, player, team)
            }

        }
    }

    drawButton(index, button, btnGlob, player, team) {
        // let team = player.team
        let text = btnGlob.txt;
        let text2 = btnGlob.txt2;
        let img = ((player.team == 0) ? btnGlob.img + "_blue" : btnGlob.img);
        let icon = btnGlob.icon;
        let cost = ((btnGlob.cost === undefined) ? "" : btnGlob.cost); //jävlar
        let action = btnGlob.action;
        let frame = 0
        if (index in this.activeButtons[team] || (this.currentButton.team == team && this.currentButton.id == index)) { // || this.currentButton == index
            frame = 1;
            if (Date.now() - this.activeButtons[team][index] > BUTTON_DELAY) {
                delete this.activeButtons[team][index]
            }
        }
        if (index in this.disabledButtons[team] && player.currentFolder == 3) {
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


}

//let local_UI = new UI([1], true);