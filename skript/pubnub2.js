const uuid = PubNub.generateUUID();
var myChannel = "none";
var amHost = "false";

var myName = "none";
const pubnub = new PubNub({
    publishKey: 'pub-c-c2440a24-55ff-432f-b85b-a1c4b8c6dcf5',
    subscribeKey: 'sub-c-cbe33554-2762-11eb-8c1e-e6d4bf858fd7',
    uuid: uuid,

});

function sendmessage(txt) {
    pubnub.publish({
        channel: "msg",
        message: {
            type: "text",
            text: txt,
        }
    })
}

function joinChannel(channel) {
    myChannel = channel;
    pubnub.subscribe({
        channels: [channel],
        withPresence: true
    });
}


function send(type, content) {
    pubnub.publish({
        channel: myChannel,
        message: { "sender": uuid, "type": type, "content": content, name: myName }
    }, function (status, response) {
        //Handle error here
        console.log(status)
    });
}

function pubnubAction(type, team, data1, data2, data3, data4) {
    pubnub.publish({
        channel: "action",
        message: {
            type: type,
            team: team,
            data1: data1,
            data2: data2,
            data3: data3,
            data4: data4,
            sender: local_UI.players[0]

        }
    })
    console.log("data1:", data1);
}

// buyUnit(unitName, team, cost)

pubnub.addListener({
    message: function (m) {
        //console.log(m)
        //console.log("text:", m.message.text, "u:", m.message.button)
        let channel = m.channel;
        let msg = m.message;
        let type = msg.type;

        // switch(type) {
        //     case "addSprite":
        // }

        if (channel == "all") {


        }


        if (type == "addSprite") {
            game.addSprite(msg.data1, msg.team);
        }
        else if (type == "castAbility") {
            game.castAbility(msg.data1, msg.team, msg.data2);
        }
        else if (type == "chatMsg") {
            local_UI.addChatMsg(msg.data1, msg.data2);
        }
        else if (type == "upgCastle") {
            game.players[msg.team].upgCastle()
        }
        else if (type == "shootProj") {
            if (msg.sender == 0) {
                game.shootProjectile(msg.data1.x, msg.data1.y, msg.data2.vx, msg.data2.vy, msg.team, msg.data3, false)
            }
        }
        else if (type == "upDateGame") {
            console.log("data1msg:", msg.data1);
            game.updateGame(msg.data1, msg.data2, msg.data3, msg.data4)
            // game.updateGame([new Sprite(80, 100, "soldier", "anim", 1)], msg.data1.projectiles, msg.data1.activeAbilities)
        }
        else if (type == "upPlayer") {
            if (local_UI.players[0] != msg.team) {
                // console.log("kachow3", msg.data1)
                game.updatePlayer(msg.team, msg.data1)
            }


        }


        // if (m.message.type == "unit") {
        //     let unit = m.message.unitName;
        //     game.buyUnit(unit, 1, 15)
        // }
        // if (m.message.text != undefined) {
        //     let id = m.message.text
        //     console.log("knapp:", id, typeof (id))
        //     game.buttonAction(id)
        // }
        // document.getElementById("newmsgs").innerHTML += "<br>" + m.message.button
    }
});

pubnub.subscribe({
    channels: ["msg", "action", "all"]
});


function sendInput() {
    sendmessage(document.getElementById("message").value);
    document.getElementById("message").value = "";
}






function startOnlineGame() {
    console.log("staart")
}



// seriöst jag orkar fan inte längre att skriva spel är de enda som gör mig glad mer
// misteln kommer inte va de enda som hänger från taket lmao ;)
// tomten kommer inte va den enda jävlen som flyger av taket

