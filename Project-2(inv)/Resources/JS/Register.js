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

var reg = document.getElementById("reg");
var ra = document.getElementById("ra");
reg.addEventListener("click", function () {
    register(ra.value);
});



function register(ra_val) {
    let Name = document.getElementById("nameOrg");
    let email = document.getElementById("email");
    let userName = document.getElementById("userName");
    let address = document.getElementById("addr");
    let fy = document.getElementById("financial_yr");
    let password = document.getElementById("psw");
    let passCheck = document.getElementById("psw-repeat");

    if (!validate(Name.value, email.value, userName.value, address.value, password.value, passCheck.value, fy.value, ra.value)) { return; }
    const dbRef = ref(db);
    get(child(dbRef, `${ra_val}/` + userName.value)).then((snapshot) => {
        // console.log(snapshot)
        if (snapshot.exists()) {
            callAlert("Account already exists!", "red");
        } else {
            // console.log(snapshot)
            set(ref(db, `${ra_val}/` + userName.value), {
                OrganizationName: Name.value,
                Email: email.value,
                Username: userName.value,
                Address: address.value,
                Financial: fy.value,
                Password: password.value,
            }).then(() => {
                callAlert("Successfully Registered!", "green");
                Name.value = "";
                email.value = "";
                userName.value = "";
                address.value = "";
                fy.selectedIndex = 0;
                password.value = "";
                passCheck.value = "";
            }).catch((error) => {
                callAlert("error" + error, "red");
            });

        }
    });
}

function validate(Name, email, userName, address, password, checkPassword) {
    let nameR = /^[a-zA-Z0-9]+$/;
    if (Name == "") {
        callAlert("Please enter name!", "red")
        return false;
    }
    if (email == "") {
        callAlert("Please enter email!", "red")
        return false;
    }
    if (userName == "") {
        callAlert("Please enter username!", "red")
        return false;
    }
    if (address == "") {
        callAlert("Please enter address!", "red")
        return false;
    }
    if (password == "") {
        callAlert("Please enter password!", "red")
        return false;
    }
    if (checkPassword == "") {
        callAlert("Please enter password again!", "red")
        return false;
    }
    if (!nameR.test(userName)) {
        callAlert("Username syntax is incorrect!", "red")
        return false;
    }

    if (checkPassword !== password) {
        callAlert("Password doesn't matches!", "red");
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