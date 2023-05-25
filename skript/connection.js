const uuid = PubNub.generateUUID();
var myChannel = "none";
var amHost = "false";
var myOpponent = "none";
var mySide = -1;
let lastSentPing = Date.now();
let lastRecievedPing = Date.now();
// IS_ONLINE är användbar
// IS_ONLINE && mySide == 0 också bra
const pubnub = new PubNub({
    publishKey: 'pub-c-c2440a24-55ff-432f-b85b-a1c4b8c6dcf5',
    subscribeKey: 'sub-c-cbe33554-2762-11eb-8c1e-e6d4bf858fd7',
    uuid: uuid
});
function getRandomName() {
    return ("kjellSlayer");
}
function handleGameUpdate(type, info) {
    if (type == "syncGame") {
        console.log("data1msg:", info);
        let sprites = info.sprites;
        let projectiles = info.projectiles;
        let players = info.players;
        let lastGoldTime = info.lastGoldTime;
        game.updateGame(sprites, projectiles, players, lastGoldTime);
    }
}
function joinChannel(channel) {
    myChannel = channel;
    pubnub.subscribe({
        channels: [channel],
        withPresence: true
    });
}
function leaveChannel() {
    pubnub.unsubscribeAll();
}
function send(type, content) {
    if (IS_SPECTATOR) {
        console.log("spectator sending data:", type, content);
        return;
    }
    let lastSentPing = Date.now();
    pubnub.publish({
        channel: myChannel,
        message: { "sender": uuid, "type": type, "content": content, name: myName }
    }, function (status, response) {
        //Handle error here
        if (status.error) {
            console.log("oops, we got an error");
        }
    });
}
function chatty(msg) {
    send("chat", msg);
}
pubnub.addListener({
    message: function (event) {
        let type = event.message.type;
        let content = event.message.content;
        console.log("got a sync with type", type);
        if (uuid != event.message.sender) {
            lastRecievedPing = Date.now();
        }
        if (type == "chat") {
            let sender = event.message.name;
            let msg = event.message.content;
            local_UI.handleChat(sender, msg);
        }
        // else if (type == "gameUpdate") {
        //     let moveInfo = event.message.content;
        //     game.move(moveInfo[0], moveInfo[1], moveInfo[2], moveInfo[3]);
        // }
        else if (type == "start") {
            console.log("total message:", event.message);
            let playerClan2 = content.clan;
            console.log("playerclan Is:", content.clan);
            // send("startingInfo", mySide);
            send("startingInfo", { mySide: mySide, clans: playerClan2 });
        }
        else if (type == "startingInfo") {
            IS_ONLINE = 1; //behövs inte
            if (uuid != event.message.sender) {
                myOpponent = event.message.name;
                if (content.mySide != -1) { }
                else if (content.mySide == 0) {
                    mySide = 1;
                }
                else {
                    mySide = 0;
                }
                playerClan[content.mySide] = content.clans[content.mySide];
                console.log("message clan is:", content.clans, "my clans is:", playerClan, "and my opponent:", myOpponent);
                // playerClan[1] = ClanTypes.eastern
                startGame2(mySide);
            }
        }
        else if (type == "syncGame") {
            let sprites = content.sprites;
            let projectiles = content.projectiles;
            let buyQueue = content.buyQueue;
            // let players = content.players;
            let lastGoldTime = content.lastGoldTime;
            console.log("sprites are:", sprites);
            game.updateGame(sprites, projectiles, buyQueue, lastGoldTime);
        }
        else if (type == "ping") {
            // console.log("pingpong", uuid, event.message.sender, Date.now() - lastRecievedPing)
            //console.log("ping")
            // if (uuid != event.message.uuid) {
            //     console.log("pingpong")
            // }
        }
        else if (type == "castAbility") {
            LAST_GLOBAL_UPDATE = Date.now();
            // send("castAbility", { team: team, ability: abilityName, cooldown: abilityCooldown })
            let team = content.team;
            let ability = content.ability;
            let cooldown = content.cooldown;
            let posX = content.posX;
            game.castAbility(ability, team, cooldown, posX);
        }
        else if (type == "sendUnit") {
            LAST_GLOBAL_UPDATE = Date.now();
            let team = content.team;
            let unit = content.unit;
            let posShift = content.posShift;
            //console.log(unit, team, "unit & team")
            game.addSprite(unit, team, posShift);
        }
        // end("addSpriteQueue", { team: team, unit: unitName });
        else if (type == "addSpriteQueue") {
            LAST_GLOBAL_UPDATE = Date.now();
            let team = content.team;
            let unit = content.unit;
            // console.log(unit, team, "unit & team")
            game.addToBuyQueue(unit, team);
        }
        else if (type == "sendProjectile") {
            // send("sendProjectile", { team: team, pos: { x: x, y: y }, vel: { vx: vx, vy: vy }, dmg: dmg })
            //console.log("SendProj:", content)
            let team = content.team;
            let pos = content.pos;
            let vel = content.vel;
            let dmg = content.dmg;
            let type = content.type;
            game.shootProjectile(pos, vel, team, dmg, 0, type);
        }
        else if (type == "castleDmg") {
            let team = content.team;
            let dmg = content.dmg;
            console.log("damage", team, "by", dmg, "content", content);
            game.damageCastle(team, dmg);
        }
        else if (type == "damageSprite") {
            let spriteId = content.spriteId;
            let dmg = content.dmg;
            game.damageSpriteFromId(spriteId, dmg);
        }
        else if (type == "spriteKill") {
        }
        else if (type == "changeGold") {
            let team = content.team;
            let totGoldChange = content.total;
            let perTurnChange = content.perTurn;
            let isSteal = content.isSteal;
            game.players[team].localGoldChange(totGoldChange, perTurnChange, isSteal);
        }
        if (type == "syncPlayer") {
            let team = content.team;
            let data = content.data;
            if (mySide != team) {
                // console.log("kachow3", msg.data1)
                //console.log("game is", game);
                game.updatePlayer(team, data);
            }
        }
    },
    presence: function (event) {
        //console.log(event);
    }
});
//# sourceMappingURL=connection.js.map