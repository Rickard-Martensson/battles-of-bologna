

class Lobby {
    constructor() {

    }
}

var currentMenu = "title"
var titleText;
var btnContainer;

var thisLobbyCode = "ABCD"

function enterLobby() {

}

var myName = "player bob"
function generateName() {
    const surnames = ["Bert", "Kjell", "Edward", "Leif GW", "Harald", "Loket"];
    myName = surnames[Math.floor(Math.random() * surnames.length)] + " "

    let randNum = Math.floor(10 + 26 * Math.random())
    myName += randNum.toString(36).toLocaleUpperCase()
}

function fixDefaultName() {
    generateName()
    var user_input = elemId("username_input")
    user_input.setAttribute("value", myName);
    console.log(myName, "mynasme")
}




function updateMenu() {

    var elementAll = elemC("all");
    var elementActive = elemC(currentMenu);

    // let currentIsJoinLobby = (currentMenu == "joinlobby") ? "block" : "none";

    //currentMenu = (currentMenu == "title") ? "lobby" : "title";

    for (var i = 0; i < elementAll.length; i++) { (elementAll[i] as HTMLElement).style.display = "none"; }

    for (var i = 0; i < elementActive.length; i++) { (elementActive[i] as HTMLElement).style.display = "block"; }

}

function menuLocal() {
    currentMenu = "locallobby"
    // console.log("ye")
    // var vikingButton = elemId("viking_button")
    // // vikingButton.style.backgroundImage = 
    // console.log("vikingbutton", Images["soldier_img_blue"], vikingButton)
    updateMenu()
    // startGameLocal()
}

function menuJoinLobby() {
    mySide = 1
    currentMenu = "joinlobby"

    let joinLbyInputField = elemId("lobby_input");


    joinLbyInputField.addEventListener("keyup", function (e) { //removeEventListener sen, 
        if (e.key == "Enter") {
            e.preventDefault();
            // thisLobbyCode = (document.getElementById("lobby_input") as HTMLInputElement).value.toLocaleUpperCase()
            // myName = (document.getElementById("username_input") as HTMLInputElement).value;
            // console.log(myName, "myName")
            // console.log("trying to join:", thisLobbyCode, myName)
            promptJoin()
        }
        else {
            // elemId("lobby_input").setAttribute("src.value", "hwhewef")
            (document.getElementById("lobby_input") as HTMLInputElement).value = (document.getElementById("lobby_input") as HTMLInputElement).value.toLocaleUpperCase();
            // elemId("lobby_input").setAttribute("value", elemId("lobby_input").getAttribute("value").toLocaleUpperCase())

        }
    });
    fixDefaultName()

    updateMenu()
}


function menuHostLobby() {
    mySide = 0
    console.log("myside is:", mySide)
    currentMenu = "hostlobby";

    thisLobbyCode = generateKey(LOBBY_CODE_LEN);
    elemId("host_code").innerHTML = thisLobbyCode
    joinChannel(thisLobbyCode);

    let nameInputField = elemId("username_input")

    nameInputField.addEventListener("keyup", function (e) {
        myName = elemId("username_input").getAttribute("value"); //   .value;
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
    thisLobbyCode = (document.getElementById("lobby_input") as HTMLInputElement).value.toLocaleUpperCase()
    myName = (document.getElementById("username_input") as HTMLInputElement).value;
    console.log(myName, "myName")
    console.log("trying to join:", thisLobbyCode, myName)

    pubnub.hereNow({
        channels: [thisLobbyCode],
        includeUUIDs: true,
        includeState: true,
    }, (status, response) => {
        // handle status, response
        console.log(response);
        if (response.totalOccupancy == 1) {
            joinChannel(thisLobbyCode);
            send("start", { name: myName, clan: playerClan[1] });
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
            // joinChannel(thisLobbyCode);
            // send("start", myName);
        }
    });

}

// function spectatorJoin() {
//     pubnub.hereNow({
//         channels: [thisLobbyCode],

//     })

// }