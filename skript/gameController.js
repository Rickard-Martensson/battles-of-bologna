
let keySet = new Set(["q", "w", "e", "a", "s", "d", "u", "i", "o", "j", "k", "l"])

let forbiddenSet = new Set(["enter", "tab", "capslock", "control", "alt", "shift", "meta", "altgraph", "arrowleft", "arrowright", "arrowup", "arrowdown", "insert", "delete"])


function activateGameController() {

    document.onkeydown = function (e) {
        if (e.repeat) { return };
        var key = e.key.toLowerCase();
        let isTyping = local_UI.getIfTyping();
        if (key == "enter") {
            if (isTyping) {
                local_UI.sendMessage();
            }
            local_UI.toggleTyping()
        }
        else if (isTyping) {
            if (!forbiddenSet.has(key)) {
                local_UI.addTyping(key);
            }
            else if (key == "backspace") {
                local_UI.addTyping(key)
            }
        }
        else if (keySet.has(key)) {
            local_UI.buttonAction(BUTTON_DICT[key].id, BUTTON_DICT[key].team);
        }
        else if (key == "m") {
            if (VOLUME != 0.0) { VOLUME = 0.0; musicPlayer.volume = VOLUME }
            else { VOLUME = GAME_VOLUME; musicPlayer.volume = VOLUME }
        }
    }

    document.onmousemove = function (e) {
        local_UI.mousePos = getMousePos(canvas, e);
    }
    document.onmousedown = function (e) {
        local_UI.mousePos = getMousePos(canvas, e);
        local_UI.mouseClicked();
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left),   //could divide by S, but that 1. returns float(slow) or 2. needs floor func(slower)
        y: (evt.clientY - rect.top),
    };
}