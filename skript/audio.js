

var VOLUME = 0.2

//===AUDIO===\\
var curAudio = "none"
function playAudio(song = "title") {

    if (song != curAudio) {

        // audio.volume(1)

        audio.pause()
        curAudio = song
        if (song == "title") {
            audio = new Audio('./bilder/audio/TITLE MUSIC MP3.mp3');
        }
        else if (song == "ingame") {
            audio = new Audio('./bilder/audio/INGAME MUSIC MP3.mp3');
        }
        else if (song == "fast") {
            audio = new Audio('./bilder/audio/INGAME FAST MP3.mp3');
        }
        else if (song == "win") {
            audio.loop = false
            audio = new Audio('./bilder/audio/VICTORY THEME MP3.mp3');
        }
        else if (song == "defeat") {
            audio.loop = false
            audio = new Audio('./bilder/audio/DEFEAT THEME MP3.mp3');
        }
        else {
            console.log("unknown sound", song)
        }
    }
    audio.play();
    audio.loop = true
    audio.volume = VOLUME
}
