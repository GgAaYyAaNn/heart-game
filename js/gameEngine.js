export const NUMBER_OF_TILES = 16;
export const NUMBER_OF_GUESSES = 5;
export const SCORE_PER_GUESS = 10;

export const GameEngine = (() => {
    let tiles = [];
    let remainingGuesses = 0;
    let guessedCorrectlyCount = 0;
    let heartsCount = 0;

    function generateNewGame() {
        tiles = [];
        guessedCorrectlyCount = 0;
        remainingGuesses = NUMBER_OF_GUESSES;
        heartsCount = Math.floor(Math.random() * (NUMBER_OF_TILES - 5)) + 2;

        for (let i = 0; i < heartsCount; i++) {
            let tile = new Tile("heart")
            tile.addEventListener("click", ()=> onTileGuessed(tile))
            tiles.push(tile);
        }
        for (let i = 0; i < NUMBER_OF_TILES - heartsCount; i++) {
            let tile = new Tile("carrot")
            tile.addEventListener("click", ()=> onTileGuessed(tile))
            tiles.push(tile);
        }

        shuffle(tiles);
    }

    function onTileGuessed(tile){
        if (tile.revealed) return;
        if (remainingGuesses <= 0) return;
        if (guessedCorrectlyCount >= heartsCount) return;

        tile.reveal();
        if (tile.guessedCorrectly) {
            guessedCorrectlyCount++;
            if(guessedCorrectlyCount >= heartsCount){
                window.dispatchEvent(new CustomEvent('game-won'));
            }

        } else {
            remainingGuesses--;
            if (remainingGuesses <= 0) {
                window.dispatchEvent(new CustomEvent('game-over'));
            }
        }
        window.dispatchEvent(
            new CustomEvent("tile-guessed", {
                detail: {
                    remainingGuesses,
                    guessedCorrectly: tile.guessedCorrectly,
                },
            })
        )
    }

    function getTiles(){
        return tiles;
    }

    function getHeartCount(){
        return heartsCount;
    }

    function getRemainingGuesses(){
        return remainingGuesses;
    }

    function resetRemainingGuesses(){
        remainingGuesses = NUMBER_OF_GUESSES;
    }

    return {
        generateNewGame, getTiles, getHeartCount, getRemainingGuesses, resetRemainingGuesses

    }
})();

class Tile extends Image {
    constructor(type) {
        super();
        this.type = type;
        this.revealed = false;
        this.guessedCorrectly = false;
        this.src = "img/question_mark.png";
    }
    reveal() {
        if (this.revealed) return;
        this.revealed = true;
        if (this.type === "heart") {
            this.guessedCorrectly = true;
        }

        this.classList.add("flipping");

        setTimeout(() => {
            this.src = this.type === "heart" ? "img/heart.png" : "img/carrot.png";
        }, 250)

        setTimeout(() => {
            this.classList.remove("flipping");
        }, 500)
    }
}


function shuffle(array) {
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}