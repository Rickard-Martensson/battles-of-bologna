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
    
        console.log(song)
        musicPlayer.play();
        musicPlayer.loop = true
        musicPlayer.volume = VOLUME
        console.log(music)
        if (song == "none") {
            musicPlayer.pause()
        }
    }


}



let curSoundsPlaying = [];

function playSoundEffect(sound) {
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
    if (similarSoundsPlaying > 3) {
        console.log("too many sounds")
        return
    }
    let thisSound = {soundeffect: sound, date: Date.now()}
    curSoundsPlaying.push(thisSound)
    console.log("hoppsan", curSoundsPlaying)

    let audioSrc = Sounds[sound].src
    vol = Sounds[sound].vol
    console.log(Sounds[sound])


    audio = new Audio(audioSrc);

    audio.volume = vol * VOLUME * 2

    audio.loop = false
    audio.play();
}
