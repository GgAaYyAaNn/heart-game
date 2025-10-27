import Player from "./player.js";
import { GameEngine, NUMBER_OF_GUESSES, SCORE_PER_GUESS } from "./gameEngine.js";

const UI = (() => {
    let remainingGuesses = 0;
    let guessedCorrectly = 0;
    let currentHeartsCount = 0;

    const gameSection = document.getElementById("game");
    const scoreELe = document.getElementById("score");
    const userEle = document.getElementById("user");
    let headerText = document.createElement("h1");
    const scoreboardSection = document.getElementById("scoreboard");

    let heartSection = document.createElement("div");
    heartSection.className = "hearts";

    let remainingGuessesText = document.createElement("h3");
    remainingGuessesText.className = "py-1"

    const title = document.createElement("p");
    title.className = "title";
    title.textContent = "Heart Hop";

    const playBtn = document.createElement('button');
    playBtn.className = "btn btn-1";
    playBtn.innerText = "Play";
    playBtn.addEventListener("click", () => {
        showGame();
    })

    const playAgainBtn = document.createElement('button');
    playAgainBtn.className = "btn btn-1 btn-small";
    playAgainBtn.innerText = "Play again";
    playAgainBtn.addEventListener("click", () => {
        showGame();
    })

    const anotherChanceBtn = document.createElement('button');
    anotherChanceBtn.className = "btn btn-3 btn-small";
    anotherChanceBtn.innerText = "Give me another chance";
    anotherChanceBtn.addEventListener("click", () => {
        void giveAnotherChance();
    })

    const scoreboardBtn = document.createElement('button')
    scoreboardBtn.className = "btn btn-2";
    scoreboardBtn.innerText = "Scoreboard";
    scoreboardBtn.addEventListener("click", ()=>{
        showScoreboard();
    })

    const restartBtn = document.createElement("button");
    restartBtn.className = "btn btn-1 btn-small";
    restartBtn.innerText = "Restart";
    restartBtn.addEventListener("click", () => {
        if (confirm("Do you want to restart the game?")) {
            showGame();
        }
    })

    const backtoMenuBtn = document.createElement("button");
    backtoMenuBtn.className = "btn btn-2 btn-small";
    backtoMenuBtn.innerText = "Back to main menu";
    backtoMenuBtn.addEventListener("click", () => {
        if (confirm("Do you want to go back to the main menu?")) {
            showMainMenu();
        }
    })

    const anotherChanceSection = document.getElementById("another-chance");
    anotherChanceSection.style.display = "none";
    document.querySelector("#another-chance .close-btn").addEventListener("click", ()=>{
        anotherChanceSection.style.display = "none";
        document.querySelector("#another-chance img").src = "";
    })

    const loginButton = document.createElement("div");
    loginButton.className = "login-btn";
    loginButton.innerHTML = `
        Login <i class="fa fa-sign-in" aria-hidden="true"></i>
    `;
    loginButton.addEventListener("click", loginUser);

    const logoutButton = document.createElement("div");
    logoutButton.className = "logout-btn";
    logoutButton.innerHTML = `
        <i class="fa fa-sign-out" aria-hidden="true"></i>
    `;
    logoutButton.addEventListener("click", logoutUser);

    window.addEventListener("auth-changed", updatePlayerStats);

    const loadingSpinner = document.createElement("span");
    loadingSpinner.className = "loader";

    let anotherChanceAnswer = null;
    document.getElementById("another-chance-confirm-btn").addEventListener("click", ()=>{
        confirmAnotherChance()
    })

    function showMainMenu() {
        clearUI();
        gameSection.appendChild(title);

        let controls = document.createElement("div");
        controls.className = "controls";

        controls.appendChild(playBtn);
        controls.appendChild(scoreboardBtn);

        gameSection.appendChild(title);
        gameSection.appendChild(controls);
    }

    function showGame() {
        remainingGuesses = NUMBER_OF_GUESSES;
        guessedCorrectly = 0;
        clearUI();

        remainingGuessesText.innerText = `You have ${remainingGuesses} ${remainingGuesses === 1 ? "guess" : "guesses"} remaining`;

        let { tiles, heartsCount } = GameEngine.generateNewGame();
        currentHeartsCount = heartsCount;
        tiles.forEach(tile => {
            heartSection.appendChild(tile);

            tile.addEventListener("click", () => {
                if (tile.revealed) return;
                if (remainingGuesses <= 0) return;
                if (guessedCorrectly >= heartsCount) return;

                tile.reveal();

                if (tile.guessedCorrectly) {
                    guessedCorrectly++;
                    Player.incrementScore(guessedCorrectly * SCORE_PER_GUESS);
                    updatePlayerStats();

                    if(guessedCorrectly >= heartsCount){
                        headerText.innerText = "You won!";
                        headerText.insertAdjacentElement("afterend", playAgainBtn);
                    }

                } else {
                    remainingGuesses--;
                    remainingGuessesText.innerText = `You have ${remainingGuesses} ${remainingGuesses === 1 ? "guess" : "guesses"} remaining`;
                    if (remainingGuesses <= 0) {
                        headerText.innerText = "Oops! You failed!"
                        headerText.insertAdjacentElement("afterend", anotherChanceBtn);
                    }
                }
            })
        })

        headerText.innerText = `Find all the hidden ${heartsCount} hearts`;

        let controls = document.createElement("div");
        controls.className = "controls";
        controls.appendChild(restartBtn);
        controls.appendChild(backtoMenuBtn);

        gameSection.appendChild(headerText);
        gameSection.appendChild(remainingGuessesText);
        gameSection.appendChild(heartSection);
        gameSection.appendChild(controls);

        updatePlayerStats();
    }

    function showScoreboard(){
        clearUI();
        scoreboardSection.innerHTML = `
            <h1>Scoreboard</h1>
        `;

        let controls = document.createElement("div");
        controls.className = "controls";
        controls.appendChild(backtoMenuBtn);

        const table = document.createElement("table");
        table.innerHTML = `
             <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
            </tr>
        `;

        Player.getTopPlayers().then(players=>{
            scoreboardSection.removeChild(loadingSpinner);
            players.forEach((player, index)=> {
                let tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${player.name}</td>
                    <td>${player.score}</td>
                `;
                table.appendChild(tr);
            })

        })
        scoreboardSection.appendChild(table);
        scoreboardSection.appendChild(loadingSpinner);
        scoreboardSection.appendChild(controls)

    }
    async function giveAnotherChance() {
        anotherChanceSection.style.display = "";
        document.querySelector("#another-chance img").src = "";
        document.getElementById("another-chance-input").value = "";

        let resp = await fetch("https://marcconrad.com/uob/heart/api.php");
        let data = JSON.parse(await resp.text());
        let img = data["question"];
        anotherChanceAnswer = parseInt(data["solution"]);

        document.querySelector("#another-chance img").src = img;
    }

    function confirmAnotherChance(){
        let userAnswer = document.getElementById("another-chance-input").value;
        if (parseInt(userAnswer) === anotherChanceAnswer){
            anotherChanceSection.style.display = "none";
            document.querySelector("#another-chance img").src = "";

            remainingGuesses = NUMBER_OF_GUESSES;
            remainingGuessesText.innerText = `You have ${remainingGuesses} ${remainingGuesses === 1 ? "guess" : "guesses"} remaining`;
            headerText.innerText = `Find all the hidden ${currentHeartsCount} hearts`;

            gameSection.removeChild(anotherChanceBtn);

            alert(`Your answer is correct. You are given ${NUMBER_OF_GUESSES} chances.`)
        }else{
            alert("Your answer is not correct!")
        }
    }


    function updatePlayerStats() {
        scoreELe.innerHTML = `
            <i class="fa fa-trophy" aria-hidden="true"></i>x${Player.getScore()}
        `;
        if (Player.isLoggedIn()){
            userEle.innerHTML = `
                <p>${Player.getName()}</p>
            `;
            userEle.appendChild(Player.getAvatar());
            userEle.appendChild(logoutButton)
        }else{
            userEle.innerHTML = "";
            userEle.appendChild(loginButton);
        }

    }

    function clearUI(){
        gameSection.innerHTML = "";
        heartSection.innerHTML = "";
        scoreboardSection.innerHTML = "";
    }


    function loginUser(){
        userEle.innerHTML = "";
        userEle.appendChild(loadingSpinner);
        Player.login().then(()=>{
            updatePlayerStats();
        })
    }
    function logoutUser(){
        Player.logout().then(()=>{
            updatePlayerStats();
        })
    }

    Player.getTopPlayers().then(players=>{
        console.log("top players", players)
    })

    return {
        init: ()=>{
            showMainMenu();
        },
        // showMainMenu,
        // showGame,
        // giveAnotherChance
    };
})();

export default UI;