var pubnub = new PubNub({
    publishKey: 'pub-c-c2440a24-55ff-432f-b85b-a1c4b8c6dcf5',
    subscribeKey: 'sub-c-cbe33554-2762-11eb-8c1e-e6d4bf858fd7'

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

function clickButton(id) {
    pubnub.publish({
        channel: "btn",
        message: {
            type: "unit",
            unitName: "soldier",
            team: 1,
            cost: 15,
        }
    })

}


// buyUnit(unitName, team, cost)

pubnub.addListener({
    message: function (m) {
        //console.log("text:", m.message.text, "u:", m.message.button)


        if (m.message.type == "unit") {
            let unit = m.message.unitName;
            game.buyUnit(unit, 1, 15)
        }
        // if (m.message.text != undefined) {
        //     let id = m.message.text
        //     console.log("knapp:", id, typeof (id))
        //     game.buttonAction(id)
        // }
        // document.getElementById("newmsgs").innerHTML += "<br>" + m.message.button
    }
});

pubnub.subscribe({
    channels: ["msg", "btn"]
});


function sendInput() {
    sendmessage(document.getElementById("message").value);
    document.getElementById("message").value = "";
}


