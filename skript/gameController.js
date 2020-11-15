
let keySet = new Set(["q", "w", "e", "a", "s", "d", "u", "i", "o", "j", "k", "l"])


let isTyping = false;

let currentMsg = ""


function activateGameController() {

    document.onkeydown = function (e) {
        if (e.repeat) { return };
        var key = e.key.toLowerCase();
        console.log(key)
        if (key == "enter") {
            if (isTyping) {
                pubnubAction("chatMsg", 0, "Kjell", currentMsg)
            }
            isTyping = !isTyping;
            currentMsg = ""
        }
        else if (isTyping) {
            currentMsg += key;
        }
        else if (keySet.has(key)) {
            local_UI.buttonAction(BUTTON_DICT[key].id, BUTTON_DICT[key].team);
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