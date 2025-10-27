import {auth, db, firebaseAuth, firebaseDB} from "./firebaseConfig.js";

const Player = (() => {
    let score = 0;
    let name = ""; // "Gayan Jeewantha";

    let avatar = new Image();
    // avatar.src = "https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light";

    let loggedIn = false;

    firebaseAuth.setPersistence(auth, firebaseAuth.browserLocalPersistence);
    firebaseAuth.onAuthStateChanged(auth, async (user) => {
        if (user) {
            loggedIn = true;
            name = user["displayName"];
            avatar.src = user["photoURL"];

            const userRef = firebaseDB.ref(db, `scores/${user.uid}`);
            const snapshot = await firebaseDB.get(userRef);
            if (snapshot.exists()) {
                const scoreData = snapshot.val();
                console.log("user's score", scoreData);
                score = scoreData.score;
            } else {
                score = 0;
            }
        } else {
            loggedIn = false;
            name = "";
            avatar.src = "";
        }
        window.dispatchEvent(new CustomEvent("auth-changed", {
            detail: { loggedIn, name, avatar }
        }));
    });

    function getName() {
        return name;
    }

    function getScore() {
        return score;
    }

    function getAvatar(){
        return avatar;
    }

    function incrementScore(by){
        score += by;
        const user = firebaseAuth.getAuth().currentUser;
        if (!user) return;
        const userRef = firebaseDB.ref(db, `scores/${user.uid}`);
        void firebaseDB.set(userRef, {
            score: score,
            name: user.displayName,
            timestamp: Date.now(),
        });
    }

    function isLoggedIn(){
        return loggedIn;
    }

    async function login(){
        await firebaseAuth.signInWithPopup(auth, provider)
    }

    async function logout(){
        score = 0;
        await firebaseAuth.signOut(auth)
    }

    async function getTopPlayers(limit = 10) {
        try {
            const scoresQuery = firebaseDB.query(
                firebaseDB.ref(db, "scores"),
                firebaseDB.orderByChild("score"),
                firebaseDB.limitToLast(limit)
            );

            const snapshot = await firebaseDB.get(scoresQuery);
            if (!snapshot.exists()) {
                return [];
            }

            const data = snapshot.val();
            const players = Object.values(data);

            // Firebase returns lowest-to-highest, so reverse
            return players.reverse();
        } catch (error) {
            console.error("failed to get leaderboard:", error);
            return [];
        }
    }

    return {
        getScore,  incrementScore, getTopPlayers,
        getName, isLoggedIn, login, logout, getAvatar
    }
})()


export default Player;
