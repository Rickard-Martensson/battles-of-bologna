const uuid = PubNub.generateUUID();
var myChannel = "none";
var amHost = "false";
var myOpponent = "none";
var mySide = -1;

let lastSentPing = Date.now()
let lastRecievedPing = Date.now()


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

function send(type, content) {
    if (IS_SPECTATOR) {
        console.log("spectator sending data:", type, content);
        return;
    }
    let lastSentPing = Date.now()
    pubnub.publish({
        channel: myChannel,
        message: { "sender": uuid, "type": type, "content": content, name: myName }
    }, function (status, response) {
        //Handle error here
        //console.log(status)
        if (status.error) {
            console.log("oops, we got an error")
        }
    });
}


function chatty(msg) {
    send("chat", msg)
}

pubnub.addListener({
    message: function (event) {
        let type = event.message.type
        let content = event.message.content;
        if (uuid != event.message.sender) {
            lastRecievedPing = Date.now()
        }
        if (type == "chat") {
            //ui.handleChat(event.message.content, event.message.name);
            let sender = event.message.name;
            let msg = event.message.content;
            // console.log(sender, msg);
            local_UI.handleChat(sender, msg);
        }
        else if (type == "gameUpdate") {
            let moveInfo = event.message.content;
            game.move(moveInfo[0], moveInfo[1], moveInfo[2], moveInfo[3]);
        }
        else if (type == "start") {
            console.log(event.message);
            //myName = elem("nameInput").value || getRandomName();
            send("startingInfo", mySide);
        }
        else if (type == "startingInfo") {
            IS_ONLINE = true; //behövs inte
            //console.log(event.message);
            if (uuid != event.message.sender) {
                myOpponent = event.message.name;
                // if (event.message.content != -1) { //if opponent has side
                //     if (event.message.content == 0) { //other players team
                //         mySide = 1;
                //     } else {
                //         mySide = 0;
                //     }
                // } startGame2(mySide);
                if (event.message.content != -1) { }
                else if (event.message.content == 0) { mySide = 1 }
                else { mySide = 0 }
                startGame2(mySide)
            }
        }
        else if (type == "syncGame") {
            let sprites = content.sprites;
            let projectiles = content.projectiles;
            let buyQueue = content.buyQueue;
            // let players = content.players;
            let lastGoldTime = content.lastGoldTime;
            game.updateGame(sprites, projectiles, buyQueue, lastGoldTime)
        }
        else if (type == "ping") {
            // console.log("pingpong", uuid, event.message.sender, Date.now() - lastRecievedPing)
            //console.log("ping")
            // if (uuid != event.message.uuid) {
            //     console.log("pingpong")
            // }
        }

        else if (type == "castAbility") {
            LAST_GLOBAL_UPDATE = Date.now()
            // send("castAbility", { team: team, ability: abilityName, cooldown: abilityCooldown })
            let team = content.team;
            let ability = content.ability;
            let cooldown = content.cooldown
            game.castAbility(ability, team, cooldown);
        }

        else if (type == "sendUnit") {
            LAST_GLOBAL_UPDATE = Date.now()
            let team = content.team;
            let unit = content.unit;
            let posShift = content.posShift
            //console.log(unit, team, "unit & team")
            game.addSprite(unit, team, posShift);
        }

        // end("addSpriteQueue", { team: team, unit: unitName });
        else if (type == "addSpriteQueue") {
            LAST_GLOBAL_UPDATE = Date.now()
            let team = content.team;
            let unit = content.unit;
            console.log(unit, team, "unit & team")
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

            game.shootProjectile(pos, vel, team, dmg, false, type)
        }
        else if (type == "castleDmg") {
            let team = content.team
            let dmg = content.dmg
            console.log("damage", team, "by", dmg, "content", content)
            game.damageCastle(team, dmg)
        }
        else if (type == "changeGold") {
            let team = content.team
            let totGoldChange = content.total
            let perTurnChange = content.perTurn
            let isSteal = content.isSteal
            game.players[team].localGoldChange(totGoldChange, perTurnChange, isSteal)
        }


        if (type == "syncPlayer") {
            let team = content.team;
            let data = content.data;
            if (mySide != team) {
                // console.log("kachow3", msg.data1)
                //console.log("game is", game);
                game.updatePlayer(team, data)
            }
        }

    },
    presence: function (event) {
        //console.log(event);
    } 
});