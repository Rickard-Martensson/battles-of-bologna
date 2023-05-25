"use strict";
function dist(pos1, pos2) {
    var dist = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
    return dist;
}
function teamFactor(team) {
    return (2 * team - 1);
}
function getOpacityDusk(curTime, sunSetDate, sunSetDuration) {
    return (Math.max(0, 1 - Math.abs((curTime - sunSetDate) / sunSetDuration)));
}
function getOpacityDawn(curTime, sunRiseDuration) {
    const halfDayLen = 0.5;
    return (Math.max(0, Math.abs((halfDayLen - curTime) / sunRiseDuration) - (halfDayLen - sunRiseDuration) / sunRiseDuration));
}
function getShadedColorCode(red, green, blue) {
    red = Math.floor(red * UNIT_DARKNESS_NUMBER);
    green = Math.floor(green * UNIT_DARKNESS_NUMBER);
    blue = Math.floor(blue * UNIT_DARKNESS_NUMBER);
    return ('rgb(' + red + ', ' + green + ', ' + blue + ')');
}
function getColorCode(red, green, blue) {
    return ('rgb(' + red + ', ' + green + ', ' + blue + ')');
}
function predictTouchDown(pos, vel) {
    var acceleration = GRAVITY / 2;
    var t_0 = (-vel.y + Math.sqrt(vel.y * vel.y - 4 * acceleration * (pos.y - 100))) / (2 * acceleration);
    console.log(vel.x * t_0 + pos.x);
}
const TAU = Math.PI * 2;
var CLOSE_SHOOT_ANGLE = -TAU / 6;
// function calcProjectilePower(curPos, targetPos, ratio) {    //only works if at the same y
//     var acceleration = GRAVITY / 2
//     let angle = Math.atan(ratio);
//     let dist = Math.abs(curPos.x - targetPos)
//     let velocity = Math.sqrt(dist * acceleration / (Math.sin(angle) * Math.cos(angle)))
//     return velocity;
// }
var konstant = 0.01;
function calcProjectilePower(startPos, endPos, ratio) {
    let distance = Math.abs(startPos.x - endPos.x);
    let acceleration = GRAVITY;
    let vel_x = Math.sqrt(distance * acceleration / (2 * ratio)); //also square
    let vel_y = vel_x * ratio;
    //console.log("calcproj", distance, acceleration, vel_x, vel_y);
    return { vel_x: vel_x, vel_y: vel_y };
}
function calcProjectilePower2(startPos, endPos, maxheight) {
    let start = { x: startPos.x, y: 40 + 0 * (100 - startPos.y) };
    let end = { x: endPos.x, y: 100 - endPos.y };
    let MAX = 100 - maxheight;
    console.log(start, end, MAX);
    let vy = Math.sqrt((MAX - start.y) * GRAVITY * 2);
    let dt = -(vy / GRAVITY) + Math.sqrt((vy / GRAVITY) * (vy / GRAVITY) - (2 * start.y / GRAVITY));
    let vx = (start.x - end.x) / dt;
    return { vx: vx / 4.2, vy: -vy };
}
function getOtherTeam(team) {
    if (team == 0) {
        return 1;
    }
    else if (team == 1) {
        return 0;
    }
    console.log("wrong team, should be 1 or 0, is:", team);
    return -1;
}
function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}
function setUnitDarkness(curTime, sunSetDate, sunSetDuration) {
    let unitDarkness = 1;
    let startOfSunSet = sunSetDate - sunSetDuration;
    let totalSunSetDuration = 2 * sunSetDuration;
    let startOfSunRise = 1.0 - sunSetDuration;
    let endOfSunRise = 0 + sunSetDuration;
    //let sepia = ""
    let K = (MAXDARKNESS / 2) / sunSetDuration; // 2.5. typ lutningen på sågtandskurvan som bildas
    if (curTime > sunSetDate) {
        unitDarkness = 0.5;
    }
    if (curTime > startOfSunRise) { // större än 0.9
        unitDarkness = MAXDARKNESS + K * (curTime - startOfSunRise);
    }
    else if (curTime < endOfSunRise) { // mindre än 0.1
        unitDarkness = MAXDARKNESS + (MAXDARKNESS / 2) + K * (curTime);
    }
    else if (Math.abs(curTime - sunSetDate) < sunSetDuration) {
        unitDarkness = 1 + MAXDARKNESS * (startOfSunSet - curTime) / totalSunSetDuration;
        let duskOpacity = getOpacityDusk(curTime, sunSetDate, sunSetDuration);
        //sepia += "sepia(" + duskOpacity * 100 * MAXDARKNESS + "%)"    //funkar sådär
        //sepia += " saturate(" + duskOpacity * 100 * MAXDARKNESS + "%)" //funkar inte??
    }
    //console.log(unitDarkness, curTime, "unitDarkness")
    UNIT_DARKNESS = "brightness(" + unitDarkness * 100 + "%)" + " "; //+ sepia
    UNIT_DARKNESS_NUMBER = unitDarkness;
}
//herregud dehär är ju fantastiskt
//precis sånthär som jag hade i åtanke
//säg till när du har tid o prata!
/**
 * returns 1 if team is blue/0
 * returns -1 if team is red/1
 * @param team
 * @returns
 */
function getDirection(team) {
    // return ((player.team == 0) ? btnGlob.img + "_blue" : btnGlob.img);
    return (team == 0) ? 1 : -1;
}
function drawIcon(name, team, pos, size = 1) {
    if (!(name in ICON_SS_POS)) {
        console.log("sorry, this icon", name, "is missing");
        return false;
    }
    let x = ICON_SS_POS[name].x;
    let y = ICON_SS_POS[name].y;
    let img = Images["icons_img"];
    ctx.drawImage(img, 32 * x, 32 * (y + team), 32, 32, (pos.x - ICON_SIZE / 2) * S, (pos.y - ICON_SIZE / 2) * S, ICON_SIZE * size * S, ICON_SIZE * size * S);
}
function elemId(e) {
    return document.getElementById(e);
}
function elemC(e) {
    return document.getElementsByClassName(e);
}
