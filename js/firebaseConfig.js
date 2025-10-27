import * as firebaseApp from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import * as firebaseDB from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
import * as firebaseAuth from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDCFWOSGDEj7_un_OLBVPDOuSHgZkoE4yE",
    authDomain: "heart-game-12540.firebaseapp.com",
    projectId: "heart-game-12540",
    storageBucket: "heart-game-12540.firebasestorage.app",
    messagingSenderId: "458969262141",
    appId: "1:458969262141:web:5796725486a62e70346254",
    measurementId: "G-142KBZ2KL0",
    databaseURL: "https://heart-game-12540-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = firebaseApp.initializeApp(firebaseConfig);
const db = firebaseDB.getDatabase(app);
const auth = firebaseAuth.getAuth(app);

export { firebaseDB, firebaseAuth, db, auth };
