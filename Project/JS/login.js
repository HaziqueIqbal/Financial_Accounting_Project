import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyBs34yvugpJjNktqOXqP5h2KhbRsW8oaBY",
    authDomain: "cap-accounts-handler.firebaseapp.com",
    databaseURL: "https://cap-accounts-handler-default-rtdb.firebaseio.com",
    projectId: "cap-accounts-handler",
    storageBucket: "cap-accounts-handler.appspot.com",
    messagingSenderId: "498900144284",
    appId: "1:498900144284:web:6e0a5088e21938deb6dd59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase();

var login = document.getElementById("login");
login.addEventListener("click", function () {
    Login();
});


function Login() {
    let fullName = document.getElementById("userName");
    let password = document.getElementById("psw");
    if (!validate(fullName, password)) {
        return;
    }
    const dbRef = ref(db);
    get(child(dbRef, `organization/${fullName.value}`)).then((snapshot) => {
        if (snapshot.exists()) {
            let dbPass = snapshot.val().Password;
            if (password.value == dbPass) {
                saveInfo(snapshot.val());
                fullName.value = "";
                password.value = "";
                window.location.replace("Files/Dashbord.html");
            }
            else {
                callAlert("Incorrect password!", "red");
                return;
            }
        } else {
            callAlert("Record not found! try again.", "red");
            return;
        }
    }).catch((error) => {
        console.error(error);
    });
}

function saveInfo(getValues) {

    sessionStorage.setItem("user", JSON.stringify(getValues));
}
function validate(email, password) {
    if (email.value == "") {
        callAlert("Please enter your name!", "red");
        return false;
    }
    if (password.value == "") {
        callAlert("Please enter Password!", "red");
        return false;
    }
    return true;
}


var x = document.getElementById("x");
function callAlert(msg, value) {
    x.innerHTML = msg;
    x.style.display = "block"
    x.style.color = value;
    setTimeout(() => {
        x.style.display = "none"
    }, 5000)
}