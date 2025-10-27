export const NUMBER_OF_TILES = 16;
export const NUMBER_OF_GUESSES = 5;
export const SCORE_PER_GUESS = 10;

export const GameEngine = (() => {
    function generateNewGame() {
        let tiles = [];
        let heartsCount = Math.floor(Math.random() * (NUMBER_OF_TILES - 5)) + 2;
        for (let i = 0; i < heartsCount; i++) {
            tiles.push(new Tile("heart"));
        }
        for (let i = 0; i < NUMBER_OF_TILES - heartsCount; i++) {
            tiles.push(new Tile("carrot"));
        }

        shuffle(tiles);
        return {
            tiles, heartsCount
        };
    }

    return {
        generateNewGame,

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