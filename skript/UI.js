
const CHAT_MSG_ROW_PAD = 4;
const CHAT_MSG_NAME_PAD = 20;

const MAX_CHAT = 6;

class UIHandler {
    constructor(players, isOnline) {
        this.players = players // [0], [0,1] eller [1] , eller [] för spectate
        this.isOnline = ((isOnline) ? true : false);

        this.timeSinceGold = Date.now()

        this.activeButtons = [{}, {}];
        this.disabledButtons = [{}, {}];

        this.mousePos = { x: 0, y: 0 };
        this.currentButton = { team: -1, id: -1 };

        this.sceneryCount = 0;
        this.scenery = [];

        this.justGaveGold = [null, null];

        this.chats = [
            // { sender: "Bert", msg: "Tjena kexet" },
            // { sender: "Kjelle", msg: "Tjatja bramski" },
            // { sender: "Bert", msg: "TEy bro!" }
        ];
        this.deSynced = false;
        this.winner = -1;

        this.curMsg = "";
        this.lastTypingBlink = Date.now();
        this.isTyping = false;
        this.isHurry = false;
        this.isTouch = true;

        this.dateQueueShow = { 0: Date.now(), 1: Date.now() }
        this.activeParticles = []
    }

    drawImage(Image, dx, dy, sx, sy, ctxX, ctxY, ctxSx, ctxSy, shouldRound = true) {
        let ctxList = [ctxX, ctxY, ctxSx, ctxSy]
        if (shouldRound) {
            for (let i = 0; i < ctxList.length; i++) {
                ctxList[i] = Math.round(ctxList[i]);

            }
        }
        ctx.drawImage(Image, dx, dy, sx, sy, ctxList[0], ctxList[1], ctxList[2], ctxList[3])
    }

    playHearts(x, y, color) {
        let particle = { name: "heart", x: x, y: y - 20, team: color, date: Date.now() }
        this.activeParticles.push(particle)
    }

    playParticles() {
        let dateNow = Date.now()
        for (let i = this.activeParticles.length - 1; i >= 0; i--) {
            let p = this.activeParticles[i];
            p.y -= 0.05
            this.drawSmallIcon(p.name, p.team, p.x, p.y, 4);
            if (dateNow - p.date > 1.5 * 1000) {
                this.activeParticles.splice(i, 1)
            }
        }
    }

    setLoser(key) {
        if (key == 1) {
            this.winner = 0;
        }
        else if (key == 0) {
            this.winner = 1;
        }
        else {
            console.log("weird winner id, not 0 or 1", key)
        }
    }

    setDesync(bool) {
        this.deSynced = bool;
    }



    getIfTyping() {
        return this.isTyping
    }

    toggleTyping() {
        this.isTyping = !this.isTyping
        this.lastTypingBlink = Date.now();
    }

    handleChat(name, msg) {
        this.chats.push({ sender: name, msg: msg })
        let chatLen = this.chats.length
        if (chatLen > MAX_CHAT) {
            this.chats.splice(0, chatLen - MAX_CHAT)
        }
    }

    sendMessage() {
        send("chat", this.curMsg);
        this.curMsg = ""
    }

    addTyping(key) {
        if (key == "backspace") {
            this.curMsg = this.curMsg.slice(0, -1)
        }
        else if (this.curMsg.length < 20) {
            this.curMsg += key
        }
    }


    drawBox(pos1, pos2, fillColor, borderColor, alpha = 1, borderalpha = 0) {
        ctx.globalAlpha = alpha
        ctx.fillStyle = fillColor;
        ctx.fillRect(pos1.x * S,
            pos1.y * S,
            (pos2.x - pos1.x) * S,
            (pos2.y - pos1.y) * S
        )
        if (borderalpha != 0) {
            ctx.strokeStyle = borderColor;
            ctx.globalAlpha = borderalpha;
            ctx.lineWidth = S;
            ctx.lineJoin = 'miter';
            ctx.strokeRect(pos1.x * S,
                pos1.y * S,
                (pos2.x - pos1.x) * S,
                (pos2.y - pos1.y) * S
            )
        }
        ctx.globalAlpha = 1


    }

    addChatMsg(sender, msg) {
        this.chatmsgs.push({ sender: sender, msg: msg })
    }


    drawInfoBox(team) {
        this.drawBox({ x: 95, y: 135 }, { x: 225, y: 175 }, "#000", "#000", 0.2);
        // console.log(this.players[0].btnLvl)
        //console.log("yooy")
        ctx.textAlign = "start";
        ctx.fillStyle = "#eee"
        let infoPlayer = game.players[team]

        let button = BTN_FOLDER[infoPlayer.currentFolder][this.currentButton.id]
        let x_pos = 110
        let y_pos = 150
        if (infoPlayer.currentFolder == 3 && this.currentButton.id == 2 && infoPlayer.btnLvl < 4) {
            button = BTN_FOLDER[infoPlayer.currentFolder][6]
        }
        if (button != undefined && (this.currentButton.team == 0 || this.isOnline) && this.btnIsEnabled(button.action, infoPlayer, button.upgrade, button.lvl) && "info" in button) {
            let title = button.txt + " " + (button.txt2 ? button.txt2 : "")
            ctx.font = 8 * S + "px 'iFlash 705'";
            ctx.fillText(title,
                (132) * S,
                (145) * S,
            );
            let info = button.info.split("\n")
            if (infoPlayer.currentFolder == 3 && this.currentButton.id == 2 && infoPlayer.btnLvl < 4) {
                let level = infoPlayer.btnLvl + 1
                info[1] = info[1].replace("%abilitylevel%", level)
            }
            ctx.font = 5 * S + "px 'iFlash 705'";
            for (var i in info) {
                ctx.fillText(info[i],
                    (132) * S,
                    (151 + 5 * i) * S,
                );
            }


            // let img = ((player.team == 0) ? btnGlob.img + "_blue" : btnGlob.img);

            if (button.icon != undefined) {
                drawIcon(button.icon, team, { x: x_pos - 5, y: y_pos - 4 }, 1.8);
            }
            else if (button.img != undefined) {
                this.drawImage(Images[button.img + (team == 0 ? "_blue" : "")],
                    32 * 0, //frame
                    0 * 0,
                    32,
                    32,
                    (x_pos - 5 - ICON_SIZE / 2) * S,
                    (y_pos - 3 - ICON_SIZE / 2) * S,
                    ICON_SIZE * 2 * S,
                    ICON_SIZE * 2 * S
                );
            }

        }

        // console.log( BTN_FOLDER[this.players[0].btnLvl] )
        // if (BTN_FOLDER[this.currentButton.team][this.currentButton.id]) {

        // if (BTN_FOLDER[0][1]) {
        //     console.log("yä gäng gäng")
        // }


    }

    drawChatBox2(team) {
        let typingBlink = ""
        if (this.isTyping) {
            if (Date.now() - this.lastTypingBlink > 500) {
                typingBlink = "|";
            }
            if (Date.now() - this.lastTypingBlink > 1000) {
                this.lastTypingBlink = Date.now();
            }
            this.drawBox(UI_POS[team].chatBox.chat.pos1, UI_POS[team].chatBox.chat.pos2, "#000", "#fff", 0.2, 1)

        }
        else {
            this.drawBox(UI_POS[team].chatBox.chat.pos1, UI_POS[team].chatBox.chat.pos2, "#000", "#fff", 0.2)
        }
        ctx.textAlign = "start";
        ctx.font = 5 * S + "px 'iFlash 705'";
        ctx.fillStyle = "#eee"
        let namePos = UI_POS[team].chatBox.chat.pos1.x + 3
        let msgPos = UI_POS[team].chatBox.chat.pos1.x + 2
        for (var i in this.chats) {
            let msg = this.chats[i].msg;
            let sender = this.chats[i].sender;

            ctx.font = 4 * S + "px 'iFlash 705'";
            if (myName == sender) {
                ctx.fillStyle = "#eee"
            }
            else {
                ctx.fillStyle = "#999"
            }
            ctx.fillText(sender + ": " + msg,
                (msgPos) * S,
                (140 + 5 * i) * S,
            );
            // ctx.font = 4 * S + "px 'iFlash 705'";
            // ctx.fillText(msg,
            //     (msgPos + 30) * S,
            //     (140 + 5 * i) * S,
            // );
        }


        // ctx.fillText(myName,
        //     (namePos) * S,
        //     (142 + 5 * 6) * S,
        // );
        ctx.font = 5 * S + "px 'iFlash 705'";
        ctx.fillStyle = "#eee";
        let displayMsg = (!this.isTyping ? "..." : this.curMsg)
        ctx.fillText(myName + ": " + displayMsg + typingBlink,
            (namePos - 1) * S,
            (143 + 5 * 6) * S,
        );
    }

    drawEverything(fps) {

        for (var key in this.players) {
            let team = this.players[key]
            this.drawButtons(team);
            if (this.isOnline) {
                // this.drawChatBox(team)
                this.drawInfoBox(team)
                this.drawChatBox2(team);
            }

        }
        if (!this.isOnline) {
            this.drawInfoBox(0)
        }



        if (DAY_NIGHT_ENABLED) { this.changeBackground(Date.now() - game.startTime); };
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
        if (randNum < CLOUD_RATE) {
            this.sceneryCount++;
            let yPos = CLOUD_MIN_HEIGHT + Math.random() * (CLOUD_MAX_HEIGHT - CLOUD_MIN_HEIGHT)
            this.scenery.push(new Scenery(0, yPos, "cloud", this.isHurry));
        }
    }

    hurryUp() {
        this.isHurry = true
        for (var key in this.scenery) {
            let cloud = this.scenery[key];
            cloud.speed *= 2
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
        this.checkMouseWithinButton()
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
        if (player.tryBuy(cost, true, true)) {
            // game.addToBuyQueue(unitName, team)
            //some pubnub shit
            if (this.isOnline) {
                // pubnubAction("addSprite", team, unitName);
                // send("sendUnit", { team: team, unit: unitName });
                send("addSpriteQueue", { team: team, unit: unitName });
            }
            else { game.addToBuyQueue(unitName, team) }
            // else { game.addSprite(unitName, team); }
        }
    }

    buyUpgrade(upgradeName, player, cost, team) {
        if (upgradeName == "upgGold") {
            let cost2 = player.goldPerTurn + UPGRADES["upgGold"].costDelta;
            if (player.tryBuy(cost2) && player.goldPerTurn < GOLD_UPG_MAX) {
                //if (this.isOnline) { pubnubAction("upgGold", team, player); }
                player.upgGoldPerTurn();
            }
        }
        else if (upgradeName == "repairCastle") {
            console.log("hejjj")
            if (player.tryBuy(player.repairCost)) {
                player.repairCastle(15);
            }
        }
        else if (upgradeName == "upgCastle") {
            if (player.tryBuy(50)) {
                player.upgCastle();

                // if (this.isOnline) { pubnubAction("upgCastle", team, player) }
                // else { player.upgCastle(); }


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
            return
        }
        else if (btnAction == 'folder') {
            player.changeFolder(btnData)
        }
        else if (btnAction === 'buyUnit') {
            this.buyUnit(btnData, player, team, cost);
        }
        else if (btnAction === 'upgrade') {
            this.buyUpgrade(btnData, player, cost, team);
            // if (cost = "%upggold%" && player.goldPerTurn >= GOLD_UPG_MAX) 
        }
        else if (btnAction === 'ability') {
            if (player.checkCooldown(curFolder, id)) {
                this.disabledButtons[team][id] = {
                    start: Date.now(),
                    duration: game.timeUntilNextGold() + GOLD_INTERVAL * 1000 * Math.max(0, cost - 1)
                };
                player.addCooldown(curFolder, id, cost, id)
                this.castAbility(btnData, team, abilityCooldown)
            }
        }
        playSoundEffect("btn_press");
        this.activeButtons[team][id] = Date.now();

    }

    castAbility(abilityName, team, abilityCooldown) {
        console.log("casting ability")
        if (this.isOnline) {
            //some pubnub shit
            send("castAbility", { team: team, ability: abilityName, cooldown: abilityCooldown })
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
        this.drawBox({ x: 145, y: 10 }, { x: 175, y: 30 }, "#000", "#000", .1);
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = 5 * S + "px 'Press Start 2P'";
        ctx.fillText(Math.floor(GOLD_INTERVAL + 1 + (game.lastGoldTime - Date.now()) / 1000), 160 * S, 22.7 * S)
        if (IS_SPECTATOR) {
            ctx.fillText("Spectator", 160 * S, 26 * S);
        }
        if (this.deSynced) {
            // console.log("desynced!!!")
            ctx.fillStyle = "#cb0000";
            ctx.fillText("Desynced!", 160 * S, 30 * S)
        }
        if (IS_DEBUGGING) {
            ctx.fillText(Math.floor(fps), 300 * S, 60 * S);
            ctx.fillText(Math.floor((Date.now() - lastRecievedPing) / 1000), 300 * S, 65 * S);
        }



        // === win / lose screen ===\\
        if (this.winner != -1) {
            let audio = "win"

            let resultText = "Victory!";



            //console.log(this.players)
            if (this.players == [0, 1]) {
                audio = "win";
                resultText = "Victory!"
            }
            else if (this.players[0] == this.winner) {
                audio = "win";
                resultText = "Victory!"
            }
            else if (this.players[0] != this.winner) {
                audio = "defeat";
                resultText = "Defeat!"
            }
            if (!GAME_OVER) {
                playAudio(audio);
                GAME_OVER = true;
            }
            ctx.font = 25 * S + "px 'Press Start 2P'";
            ctx.fillStyle = "#FFFFFF"
            ctx.fillText(resultText, (UI_POS[0].winScreen.x + 2) * S, (UI_POS[0].winScreen.y + 2) * S);

            if (this.winner == 0) { ctx.fillStyle = "#3B6BCB" }
            else if (this.winner == 1) { ctx.fillStyle = "#CB0000" }
            ctx.fillText(resultText, UI_POS[0].winScreen.x * S, UI_POS[0].winScreen.y * S);

        }


        ctx.textAlign = "end";

        for (var playerKey in game.players) {

            this.drawBox(UI_POS[playerKey].statsBox.topleft, UI_POS[playerKey].statsBox.botright, "#000", "#000", .1);



            ctx.font = 5 * S + "px 'Press Start 2P'";
            var player = game.players[playerKey]

            var playerQueueLen = game.buyQueue[playerKey].length
            if (playerQueueLen >= 2 || (Date.now() - this.dateQueueShow[playerKey] < 0.5 * 1000)) {
                if (playerQueueLen != 0) {
                    this.dateQueueShow[playerKey] = Date.now()
                }
                for (let i = 0; i < 5; i++) {
                    let iconName = playerQueueLen <= i ? "queue" : "queueFull";
                    let x_pos = UI_POS[playerKey].queueIcon.x
                    let y_pos = UI_POS[playerKey].queueIcon.y
                    this.drawSmallIcon(iconName, 0, x_pos + (playerKey * -2 + 1) * 4 * i, y_pos)
                }
            }
            ctx.imageSmoothingEnabled = true

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

            let goldIconSize = 6
            this.drawImage(Images["gold"],
                0,
                0,
                16,
                16,
                (UI_POS[playerKey].goldIcon.x) * S,
                (UI_POS[playerKey].goldIcon.y - goldIconSize / 2) * S,
                goldIconSize * S,
                goldIconSize * S
            );

            this.playParticles()

            this.drawHpBars(playerKey, player)

        }
    }

    drawSmallIcon(name, playerKey, x, y, size = 5) {
        let xpos = ICON_SMALL_POS[name].x * 8;
        let ypos = ICON_SMALL_POS[name].y * 8 + (16 * playerKey);
        let iconSize = size
        this.drawImage(Images["icons_small"],
            xpos,
            ypos,
            8,
            8,
            (x) * S,
            (y - iconSize / 2 + 15) * S,
            iconSize * S,
            iconSize * S)
    }

    drawHpBars(playerKey, player) {

        let hpBarWidth = 20.8;
        let hpBarHeight = 3
        let hpBarImgWidth = 44;
        let hpBarImgHeight = 8;

        let hpBarJump = 0;
        let invertColors = 0
        let dmgFrac = player.hp / PLAYER_HP_MAX;
        let prevDmgFrac = 0
        let timeSinceLastDmg = Date.now() - player.lastDmgdTime
        if (timeSinceLastDmg < 125) {
            invertColors = 1;
        }
        if (timeSinceLastDmg < 400) {
            prevDmgFrac = Math.max(player.prevHp, player.hp) / PLAYER_HP_MAX;
            prevDmgFrac -= (prevDmgFrac - dmgFrac) * ((Date.now() - player.lastDmgdTime) / 400)
            dmgFrac = Math.min(player.prevHp, player.hp) / PLAYER_HP_MAX;

        }

        console.log()

        if (timeSinceLastDmg < 275 && timeSinceLastDmg > 50) {
            hpBarJump = -0.5;

        }

        let hpBarColor = 0

        if (dmgFrac < 0.2) { hpBarColor = 3 }
        else if (dmgFrac < 0.4) { hpBarColor = 2 }
        else if (dmgFrac < 0.6) { hpBarColor = 1 }
        ctx.imageSmoothingEnabled = false

        this.drawImage(Images["hpBars"], //just the outline
            hpBarImgWidth * invertColors,
            hpBarImgHeight * 5,
            hpBarImgWidth,
            hpBarImgHeight,
            (UI_POS[playerKey].hpBar.x) * S,
            (UI_POS[playerKey].hpBar.y - hpBarHeight / 2 + hpBarJump) * S,
            hpBarWidth * S,
            hpBarHeight * S
        );
        this.drawImage(Images["hpBars"], //previous dmg
            hpBarImgWidth * invertColors,
            hpBarImgHeight * 4,
            hpBarImgWidth * prevDmgFrac,
            hpBarImgHeight,
            (UI_POS[playerKey].hpBar.x) * S,
            (UI_POS[playerKey].hpBar.y - hpBarHeight / 2 + hpBarJump) * S,
            hpBarWidth * S * prevDmgFrac,
            hpBarHeight * S
        );

        this.drawImage(Images["hpBars"],
            hpBarImgWidth * invertColors,
            hpBarImgHeight * hpBarColor,
            hpBarImgWidth * dmgFrac,
            hpBarImgHeight,
            (UI_POS[playerKey].hpBar.x) * S,
            (UI_POS[playerKey].hpBar.y - hpBarHeight / 2 + hpBarJump) * S,
            hpBarWidth * S * dmgFrac,
            hpBarHeight * S
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


    writeBtnText(text, pos, name, yoffset = 0) {
        ctx.fillText(text,
            (pos.x + UI_POS_BTN[name].x) * S,
            (pos.y + UI_POS_BTN[name].y + yoffset) * S,
        );
    }

    btnIsEnabled(action, player, upgRequired, lvl) {
        if (action == "hidden") {
            return false;
        }
        else if (action != "upgrade" ^ player.checkIfResearched(upgRequired)) { //XOR, coolt. false ^ true
            // console.log("button is hidden")
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
        var cooldownFrac;
        if (index in this.activeButtons[team] || (this.currentButton.team == team && this.currentButton.id == index)) { // || this.currentButton == index
            frame = 1;
            if (Date.now() - this.activeButtons[team][index] > BUTTON_DELAY) {
                delete this.activeButtons[team][index]
            }
        }
        if (index in this.disabledButtons[team] && player.currentFolder == 3) {

            cooldownFrac = (Date.now() - this.disabledButtons[team][index].start) / this.disabledButtons[team][index].duration
        }
        ctx.imageSmoothingEnabled = false
        this.drawImage(Images.button1,
            BTN_SIZE * frame,
            BTN_SIZE * 1,
            BTN_SIZE,
            BTN_SIZE,
            (button.x - BUTTON_SIZE / 2) * S,
            (button.y - BUTTON_SIZE / 2) * S,
            BUTTON_SIZE * S,
            BUTTON_SIZE * S
        );

        if (cooldownFrac != undefined) {
            // ctx.fillStyle = "#00000055";
            // ctx.fillRect(
            //     (button.x - BUTTON_SIZE / 2) * S,
            //     (button.y - BUTTON_SIZE / 2 + BUTTON_SIZE * cooldownFrac) * S,
            //     BUTTON_SIZE * S,
            //     BUTTON_SIZE * S * (1 - cooldownFrac)
            // );
            this.drawImage(Images.button1,
                BTN_SIZE * 2,
                BTN_SIZE * 1 + BTN_SIZE * cooldownFrac,
                BTN_SIZE,
                BTN_SIZE * (1 - cooldownFrac),
                Math.floor((button.x - BUTTON_SIZE / 2) * S),
                (button.y - BUTTON_SIZE / 2 + BUTTON_SIZE * cooldownFrac) * S,
                Math.floor(BUTTON_SIZE * S),
                BUTTON_SIZE * S * (1 - cooldownFrac),
                false
            );

        }

        ctx.imageSmoothingEnabled = DRAW_ICONS_SMOOTH
        if (icon != undefined) { //kollar om det finns en ikon med rätt namn o allt
            drawIcon(icon, player.team, { x: button.x, y: button.y + 1 * frame });
        }
        else { // om det inte finnsen ikon å ritar vi img istället. viktigt att skilja på för att allt ska få rätt färg
            this.drawImage(Images[img],
                32 * 0, //frame
                0 * 0,
                32,
                32,
                (button.x + UI_POS_BTN.img.x - ICON_SIZE / 2) * S,
                (button.y + UI_POS_BTN.img.y + frame - ICON_SIZE / 2) * S,
                ICON_SIZE * S,
                ICON_SIZE * S
            );
        }

        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = ((text.length > 8) ? 2.5 * S + "px 'Press Start 2P'" : 3 * S + "px 'Press Start 2P'");

        this.writeBtnText(text, button, "txt", frame)
        if (text2 !== undefined) { this.writeBtnText(text2, button, "txt2", frame) }

        if (cost == "%upggold%") { cost = player.goldPerTurn + UPGRADES["upgGold"].costDelta; }
        else if (cost == "%repaircastle%") { cost = player.repairCost; }
        else if (cost == "%upgcastle%") { cost = 50; }
        else if (cost == "%upgability%") { cost = 25 + player.btnLvl * 5 }

        ctx.textAlign = "end";
        ctx.font = 3 * S + "px 'Press Start 2P'";
        this.writeBtnText(cost, button, "subText", frame)


        let btnIcon = null;
        if (action == "buyUnit" || action == "upgrade") {
            btnIcon = 0;
        }
        else if (action == "ability") {
            btnIcon = 1
        }
        if (btnIcon !== null) {
            let goldIconSize = 5
            this.drawImage(Images["gold"],
                16 * btnIcon,
                16 * btnIcon,
                16,
                16,

                (button.x + UI_POS_BTN.gold.x) * S,
                (button.y + UI_POS_BTN.gold.y + frame - goldIconSize / 2) * S,
                goldIconSize * S,
                goldIconSize * S
            );
        }
    }


}

//let local_UI = new UI([1], true);