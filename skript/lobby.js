

var currentMenu = "title"
var titleText;
var btnContainer;

function enterLobby() {

}

function hideTitle() {
    titleText = document.getElementById("titleText");
    btnContainer = document.getElementsByClassName("buttonContainer noselect");
    if (currentMenu == "title") {
        titleText.style.display = "none"
        btnContainer[0].style.display = "none"
        currentMenu = "lobby";

    }
    else if (currentMenu == "lobby") {
        titleText.style.display = "block"
        btnContainer[0].style.display = "block"
        currentMenu = "title";

    }
}