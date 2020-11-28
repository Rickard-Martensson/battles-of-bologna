

var VOLUME = 0.2

//===AUDIO===\\
var curAudio = "none"
var music;
function playAudio(song = "title", meme = false) {
    if (meme == false) { return }
    let music = elemId("music");
    // music.pause()
    if (song != curAudio) {
        // music.volume(1)

        music.pause()
        curAudio = song
        if (song == "title") {
            music.src = "./bilder/music/TITLE MUSIC MP3.mp3";
        }
        else if (song == "ingame") {
            music.src = "./bilder/music/INGAME MUSIC MP3.mp3";
        }
        else if (song == "fast") {
            music.src = "./bilder/music/INGAME FAST MP3.mp3";
        }
        else if (song == "win") {
            music.loop = false
            music.src = "./bilder/music/VICTORY THEME MP3.mp3";
        }
        else if (song == "defeat") {
            music.loop = false
            music.src = "./bilder/music/DEFEAT THEME MP3.mp3";
        }
        else if (song == "ingame_hurry") {
            music.src = "./bilder/music/INGAME FAST NEW MP3.mp3";
        }
        else {
            console.log("unknown sound", song)
        }
    }
    music.play();
    music.loop = true
    music.volume = VOLUME
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
