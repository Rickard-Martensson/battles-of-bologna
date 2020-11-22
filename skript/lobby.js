


class Lobby {
    constructor() {

    }
}

var currentMenu = "title"
var titleText;
var btnContainer;
var myName = "bob"

var thisLobby = "AAAA"

function enterLobby() {

}

function updateMenu() {

    var elementAll = elemC("all");
    var elementActive = elemC(currentMenu);

    // let currentIsJoinLobby = (currentMenu == "joinlobby") ? "block" : "none";

    //currentMenu = (currentMenu == "title") ? "lobby" : "title";

    for (var i = 0; i < elementAll.length; i++) { elementAll[i].style.display = "none"; }

    for (var i = 0; i < elementActive.length; i++) { elementActive[i].style.display = "block"; }

}

function menuJoinLobby() {
    mySide = 1
    currentMenu = "joinlobby"

    let joinLbyInputField = elemId("lobby_input");


    joinLbyInputField.addEventListener("keyup", function (e) {
        if (e.key == "Enter") {
            e.preventDefault();
            thisLobby = elemId("lobby_input").value.toLocaleUpperCase()
            myName = elemId("username_input").value;
            console.log("trying to join:", thisLobby, myName)
            promptJoin()
        }
        else {
            elemId("lobby_input").value = elemId("lobby_input").value.toLocaleUpperCase();
        }
    });

    updateMenu()
}

function menuHostLobby() {
    mySide = 0
    console.log("myside is:", mySide)
    currentMenu = "hostlobby";

    thisLobby = generateKey(4);

    elemId("host_code").innerHTML = thisLobby

    joinChannel(thisLobby);


    updateMenu();


}

function generateKey(length = 4, specificKey = null) {
    let key = ""
    for (var i = 0; i < length; i++) {
        let randNum = Math.floor(10 + 26 * Math.random())
        key += randNum.toString(36).toLocaleUpperCase()
    }
    if (specificKey != null) {
        return specificKey;
    }
    return (key)

}

function backLobby() {
    currentMenu = "title"
    updateMenu()
}




function promptJoin() {

    self = this;
    pubnub.hereNow({
        channels: [thisLobby],
        includeUUIDs: true,
        includeState: true,
    }, (status, response) => {
        // handle status, response
        console.log(response);
        if (response.totalOccupancy == 1) {
            joinChannel(thisLobby);
            send("start", myName);
            //self.startGame();
        }
        else {
            console.log("No lobby found!");
        }
    });

}