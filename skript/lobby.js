

class Lobby {
    constructor() {

    }
}

var currentMenu = "title"
var titleText;
var btnContainer;

var thisLobbyCode = "TEST"

function enterLobby() {

}

var myName = "bob"
function generateName() {
    surnames = ["Bert", "Kjell", "Edward", "Leif GW", "Harald", "Loket"];
    myName = surnames[Math.floor(Math.random() * surnames.length)] + " "

    let randNum = Math.floor(10 + 26 * Math.random())
    myName += randNum.toString(36).toLocaleUpperCase()
}

function fixDefaultName() {
    generateName()
    elemId("username_input").value = myName
    console.log(myName, "mynasme")
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


    joinLbyInputField.addEventListener("keyup", function (e) { //removeEventListener sen, 
        if (e.key == "Enter") {
            e.preventDefault();
            thisLobbyCode = elemId("lobby_input").value.toLocaleUpperCase()
            myName = elemId("username_input").value;
            console.log(myName, "myName")
            console.log("trying to join:", thisLobbyCode, myName)
            promptJoin()
        }
        else {
            elemId("lobby_input").value = elemId("lobby_input").value.toLocaleUpperCase();
        }
    });
    fixDefaultName()

    updateMenu()
}



function menuHostLobby() {
    mySide = 0
    console.log("myside is:", mySide)
    currentMenu = "hostlobby";

    thisLobbyCode = generateKey(2);
    elemId("host_code").innerHTML = thisLobbyCode
    joinChannel(thisLobbyCode);

    let nameInputField = elemId("username_input")

    nameInputField.addEventListener("keyup", function (e) {
        myName = elemId("username_input").value;
        console.log(myName, "myName")
    }
    )
    fixDefaultName()

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




var IS_SPECTATOR = false

function promptJoin() {

    pubnub.hereNow({
        channels: [thisLobbyCode],
        includeUUIDs: true,
        includeState: true,
    }, (status, response) => {
        // handle status, response
        console.log(response);
        if (response.totalOccupancy == 1) {
            joinChannel(thisLobbyCode);
            send("start", myName);
        }
        else if (response.totalOccupancy == 2) {
            console.log("lobby full!", local_UI)
            joinChannel(thisLobbyCode);
            //send("start", myName);
            mySide = -1
            IS_SPECTATOR = true;
            startGame2(mySide)

        }
        else {
            console.log("No lobby found!");
        }
    });

}

// function spectatorJoin() {
//     pubnub.hereNow({
//         channels: [thisLobbyCode],

//     })

// }