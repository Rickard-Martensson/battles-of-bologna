const { sep } = require("path");



function dist(pos1, pos2) {
    var dist = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
    return dist;
}

function teamFactor(team) {
    return (2 * team - 1)
}

function getOpacityDusk(curTime, sunSetDate, sunSetDuration) {
    return (Math.max(0, 1 - Math.abs((curTime - sunSetDate) / sunSetDuration)));
}


function getOpacityDawn(curTime, sunRiseDuration) {
    const halfDayLen = 0.5;
    return (Math.max(0, Math.abs((halfDayLen - curTime) / sunRiseDuration) - (halfDayLen - sunRiseDuration) / sunRiseDuration))
}




function setUnitDarkness(curTime, sunSetDate, sunSetDuration) {
    let unitDarkness = 1
    let startOfSunSet = sunSetDate - sunSetDuration;
    let totalSunSetDuration = 2 * sunSetDuration
    let startOfSunRise = 1.0 - sunSetDuration
    let endOfSunRise = 0 + sunSetDuration
    let sepia = ""

    let K = (MAXDARKNESS / 2) / sunSetDuration // 2.5. typ lutningen på sågtandskurvan som bildas

    if (curTime > sunSetDate) { unitDarkness = 0.5 }

    if (Math.abs(curTime - sunSetDate) < sunSetDuration) {
        unitDarkness = 1 + MAXDARKNESS * (startOfSunSet - curTime) / totalSunSetDuration
        let duskOpacity = getOpacityDusk(curTime, sunSetDate, sunSetDuration)
        //sepia += "sepia(" + duskOpacity * 100 * MAXDARKNESS + "%)"    //funkar sådär
        //sepia += " saturate(" + duskOpacity * 100 * MAXDARKNESS + "%)" //funkar inte??
    }
    else if (curTime > startOfSunRise) { // större än 0.9
        unitDarkness = MAXDARKNESS + K * (curTime - startOfSunRise)
    }
    else if (curTime < endOfSunRise) { // mindre än 0.1
        unitDarkness = MAXDARKNESS + (MAXDARKNESS / 2) + K * (curTime)
    }

    //console.log(unitDarkness, curTime, "unitDarkness")
    UNIT_DARKNESS = "brightness(" + unitDarkness * 100 + "%)" + " " + sepia

}

//herregud dehär är ju fantastiskt
//precis sånthär som jag hade i åtanke
//säg till när du har tid o prata!

class Engine {
    constructor() {
        this.spriteBoxes = [];
        this.sprites = [];
    }

    addSprite(x) {
        this.spriteBoxes.push(x)
    }
}