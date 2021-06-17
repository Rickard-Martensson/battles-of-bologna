


// const SOUND_DICTIONARY = [
//     ["title_music", './bilder/audio/title_music.mp3'],
//     ["ingame_music", './bilder/audio/ingame_music.mp3'],
//     ["ingame_hurry", './bilder/audio/ingame_fast.mp3']
// ]
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
        console.log(musicPlayer.src)


        // musicPlayer.src = './bilder/audio/title_music.mp3'
        // url("./bilder/audio/title_music.mp3")
        // "http://127.0.0.1:5501/bilder/audio/title_music.mp3";
        // musicPlayer.volume(1)

        // musicPlayer.pause()
        curAudio = song
        // console.log(song)
        if (song == "title") {
            musicPlayer.src = './bilder/audio/musik/title_music.mp3';
        }
        else if (song == "ingame") {
            musicPlayer.src = './bilder/audio/musik/ingame_music.mp3';
        }
        else if (song == "ingame_hurry") {
            musicPlayer.src = './bilder/audio/musik/ingame_fast.mp3';
        }
        else if (song == "win") {
            musicPlayer.loop = false
            musicPlayer.src = './bilder/audio/musik/victory_theme.mp3';
        }
        else if (song == "defeat") {
            musicPlayer.loop = false
            musicPlayer.src = './bilder/audio/musik/defeat_theme.mp3';
        }

        else {
            console.log("unknown sound", song)
            musicPlayer.pause()
        }
        // if (song == "ingame_hurry") {
        //     // setTimeout(function () { musicPlayer.play(); }, 2400);
        // }
        // else {
        //     musicPlayer.play();
        // }
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
    // let audio = elemId("soundEffects");
    let vol = 0.3
    let audioSrc = './bilder/audio/'

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

    if (sound == "sword") {
        setTimeout(function () { audio.play(); }, 220);
        audioSrc += 'zap/sword_strike2.mp3'
    }
    else if (sound == "arrow") {
        audioSrc += 'zap/arrow_fly.mp3'
    }
    else if (sound == "buy") {
        vol = 0.0
        audioSrc += 'SIDSNARE.wav'
    }
    else if (sound == "damage") {
        vol = 0.3
        audioSrc += 'zap/body_hit2.mp3'
        // audio = new Audio('./bilder/audio/SIDKICK.wav')
    }
    else if (sound == "hurry_up") {
        audioSrc += 'hurry_up.mp3'
        //setTimeout(playAudio("ingame_hurry"), 1000);
    }
    else if (sound == "btn_press") {
        audioSrc += 'click.wav';
    }
    else if (sound == "repair") {
        audioSrc += 'hammer3.mp3';
    }
    else if (sound == "arrow_hit") {
        vol = 0.3
        audioSrc += 'zap/arrow_hit5.mp3'

    }
    audio = new Audio(audioSrc);

    audio.volume = vol * VOLUME * 2

    audio.loop = false
    audio.play();
}
