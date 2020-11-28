

var VOLUME = 0.2

//===AUDIO===\\
var curAudio = "none"
var musicPlayer;

function setupAudio() {
    musicPlayer = elemId("music")
}
function playAudio(song = "title") {
    // musicPlayer.pause()
    if (song != curAudio) {
        console.log(musicPlayer.src)


        // musicPlayer.src = './bilder/audio/title_music.mp3'
        // url("./bilder/audio/title_music.mp3")
        // "http://127.0.0.1:5501/bilder/audio/title_music.mp3";
        // musicPlayer.volume(1)

        // musicPlayer.pause()
        curAudio = song
        // console.log(song)
        if (song == "title") {
            musicPlayer.src = './bilder/audio/title_music.mp3';
        }
        else if (song == "ingame") {
            musicPlayer.src = './bilder/audio/ingame_music.mp3';
        }
        else if (song == "ingame_hurry") {
            musicPlayer.src = './bilder/audio/ingame_fast.mp3';
        }
        else if (song == "win") {
            musicPlayer.loop = false
            musicPlayer.src = './bilder/audio/victory_theme.mp3';
        }
        else if (song == "defeat") {
            musicPlayer.loop = false
            musicPlayer.src = './bilder/audio/DEFEAT THEME MP3.mp3';
        }
        else {
            console.log("unknown sound", song)
        }
    }
    musicPlayer.play();
    musicPlayer.loop = true
    musicPlayer.volume = VOLUME
    console.log(music)

}





function playSoundEffect(sound) {
    // let audio = elemId("soundEffects");
    if (sound == "sword") {
        audio = new Audio('./bilder/audio/BASH MP3.mp3')
    }
    else if (sound == "arrow") {
        audio = new Audio('./bilder/audio/swish_2.wav')
    }
    else if (sound == "buy") {
        audio = new Audio('./bilder/audio/SIDSNARE.wav')
    }
    else if (sound == "damage") {
        audio = new Audio('./bilder/audio/SIDKICK.wav')
    }
    else if (sound == "hurry_up") {
        audio.loop = false;
        audio = new Audio('./bilder/audio/HURRY UP NEW MP3.mp3')
        //setTimeout(playAudio("ingame_hurry"), 1000);
    }


    audio.loop = false
    audio.volume = VOLUME
    audio.play();
}
