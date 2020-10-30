

function activateGameController() {

    document.onkeydown = function (e) {
        if (e.repeat) { return };
        var key = e.key.toLowerCase();
        game.buttonAction(BUTTON_DICT[key]);
    }

    document.onmousemove = function (e) {
        game.mousePos = getMousePos(canvas, e);
    }
    document.onmousedown = function (e) {
        game.mouseClicked();
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left),   //could divide by S, but that 1. returns float(slow) or 2. needs floor func(slower)
        y: (evt.clientY - rect.top),
    };
}