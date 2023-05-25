var GAME_VOLUME = .3
var VOLUME = GAME_VOLUME

//===AUDIO===\\
var curAudio = "none"
var musicPlayer;

function setupAudio() {
    musicPlayer = elemId("music")
}
function playAudio(song = "title") {
    // musicPlayer.pause()
    if (song != curAudio) {
        musicPlayer.src = Sounds[song].src

        musicPlayer.play();
        musicPlayer.loop = true
        musicPlayer.volume = VOLUME
        if (song == "none") {
            musicPlayer.pause()
        }
    }


}



let curSoundsPlaying = [];

function playSoundEffect(sound: string) {
    var i = curSoundsPlaying.length
    var similarSoundsPlaying = 0
    while (i--) {
        let loop_idx = curSoundsPlaying[i]
        if (Date.now() - loop_idx.date > 25) {
            curSoundsPlaying.splice(i, 1);
        }
        else {
            if (loop_idx.soundeffect == sound) {
                similarSoundsPlaying += 1
                //console.log("similar sound")
            }
        }
    }
    if (similarSoundsPlaying > 2) {
        console.log("too many sounds")
        return
    }
    let thisSound = { soundeffect: sound, date: Date.now() }
    curSoundsPlaying.push(thisSound)
    // console.log("currently playing", curSoundsPlaying, Sounds[sound])

    // console.log("sound", sound)
    // if (audioSrc.)
    if (!(sound in Sounds)) {
        console.log("could not find sound effect", sound, "in list", Sounds)
    }
    let audioSrc = Sounds[sound].src
    var vol = Sounds[sound].vol


    var audio = new Audio(audioSrc);

    audio.volume = vol * VOLUME * 2

    audio.loop = false
    audio.play();
}
