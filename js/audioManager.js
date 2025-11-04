export const audioManager = (()=>{
    const background = new Audio("audio/background.mp3");
    background.loop = true;
    background.volume = 0.1;
    background.addEventListener("ended", ()=>{
        background.currentTime = 0;
        background.play();
    })

    return {
        correctGuess: ()=>{
            let audio = new Audio("audio/correct_guess.mp3");
            audio.play();
        },
        wrongGuess: ()=>{
            let audio = new Audio("audio/wrong_guess.mp3");
            audio.play();
        },
        victory: ()=>{
            let audio = new Audio("audio/victory.mp3");
            audio.play();
        },
        gameover: ()=>{
            let audio = new Audio("audio/gameover.mp3");
            audio.play();
        },
        playBackground: ()=>{
            if (!background.paused){
                return;
            }
            background.currentTime = 0;
            background.play();
        },
        stopBackground: ()=>{
            background.stop();
        }
    }
})();
