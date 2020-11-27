const uuid = PubNub.generateUUID();
var myChannel = "none";
var amHost = "false";
var myOpponent = "none";
var mySide = -1;

let lastSentPing = Date.now()
let lastRecievedPing = Date.now()


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
    let lastSentPing = Date.now()
    pubnub.publish({
        channel: myChannel,
        message: { "sender": uuid, "type": type, "content": content, name: myName }
    }, function (status, response) {
        //Handle error here
        console.log(status)
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
        if (uuid != event.message.sender) {
            lastRecievedPing = Date.now()
        }
        if (event.message.type == "chat") {
            //ui.handleChat(event.message.content, event.message.name);
            let sender = event.message.name;
            let msg = event.message.content;
            // console.log(sender, msg);
            local_UI.handleChat(sender, msg);
        }
        else if (event.message.type == "gameUpdate") {
            let moveInfo = event.message.content;
            game.move(moveInfo[0], moveInfo[1], moveInfo[2], moveInfo[3]);
        }
        else if (event.message.type == "start") {
            console.log(event.message);
            //myName = elem("nameInput").value || getRandomName();
            send("startingInfo", mySide);
        }
        else if (event.message.type == "startingInfo") {
            IS_ONLINE = true; //behövs inte
            console.log(event.message);
            if (uuid != event.message.sender) {
                myOpponent = event.message.name;
                if (event.message.content != -1) { //if opponent has side
                    if (event.message.content == 0) { //other players team
                        mySide = 1;
                    } else {
                        mySide = 0;
                    }
                } startGame2(mySide);
            }
        }
        else if (event.message.type == "syncGame") {
            let content = event.message.content
            let sprites = content.sprites;
            let projectiles = content.projectiles;
            // let players = content.players;
            let lastGoldTime = content.lastGoldTime;
            game.updateGame(sprites, projectiles, lastGoldTime)
        }
        else if (event.message.type == "ping") {
            console.log("pingpong", uuid, event.message.sender, Date.now() - lastRecievedPing)
            // if (uuid != event.message.uuid) {
            //     console.log("pingpong")
            // }
        }

        if (event.message.type == "castAbility") {
            // send("castAbility", { team: team, ability: abilityName, cooldown: abilityCooldown })
            let content = event.message.content;
            let team = content.team;
            let ability = content.ability;
            let cooldown = content.cooldown
            game.castAbility(ability, team, cooldown);
        }

        if (event.message.type == "sendUnit") {
            let content = event.message.content;
            let team = content.team;
            let unit = content.unit;
            //console.log(unit, team, "unit & team")
            game.addSprite(unit, team);
        }

        if (event.message.type == "sendProjectile") {
            // send("sendProjectile", { team: team, pos: { x: x, y: y }, vel: { vx: vx, vy: vy }, dmg: dmg })
            let content = event.message.content;
            //console.log("SendProj:", content)
            let team = content.team;
            let pos = content.pos;
            let vel = content.vel;
            let dmg = content.dmg;

            game.shootProjectile(pos, vel, team, dmg, false)
        }


        if (event.message.type == "syncPlayer") {
            let content = event.message.content;
            let team = content.team;
            let data = content.data;
            if (mySide != team) {
                // console.log("kachow3", msg.data1)
                console.log("game is", game);
                game.updatePlayer(team, data)
            }
        }

    },
    presence: function (event) {
        console.log(event);
    }
});