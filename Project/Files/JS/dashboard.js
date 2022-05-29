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

const today = new Date();
const yyyy = today.getFullYear();

var gets = JSON.parse(sessionStorage.getItem("user"));
var getyear;
function getFromFireBase() {
    const dbRef = ref(db);
    get(child(dbRef, `organization/${gets.Username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            if (snapshot.val()[yyyy] != undefined) {
                getyear = snapshot.val()[yyyy];
            }

        } else {
            console.log("Not Found!");
            return;
        }
    }).catch((error) => {
        console.error(error);
    });
}

if (gets != null) {
    getFromFireBase()
    var getInfo;

    var getUserName = document.getElementById("un");
    var getAddress = document.getElementById("addr");
    var email = document.getElementById("email");
    var fye = document.getElementById("fye");

    var getTitle = document.getElementById("getTitle");

    var getDB = JSON.parse(sessionStorage.getItem("user"));

    getTitle.innerHTML = getDB.OrganizationName;
    getUserName.innerHTML = getDB.Username;
    getAddress.innerHTML = getDB.Address;
    fye.innerHTML = getDB.Financial;
    email.innerHTML = getDB.Email;



    var addYear = document.getElementById("addYear");
    addYear.addEventListener("click", function () {
        window.location.replace("index.html");
    });

    setTimeout(() => {
        getInfo = getyear;

        function call() {
            window.location.href = "index.html";
        }

        var td_1;
        // console.log(getInfo[2022]);
        if (getInfo != undefined) {
            let GJ_Entry = document.getElementById("GJ_Entry");
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td_1 = document.createElement("td");
            td.innerHTML = "2022";
            td_1.innerHTML = "Open";
            td_1.setAttribute("class", "yr");
            // td_1.setAttribute("id","call");
            tr.appendChild(td);
            tr.appendChild(td_1);
            GJ_Entry.appendChild(tr);
            addYear.style.display = "none";
        } else {
            addYear.style.display = "inline-block";
        }

        if (td_1 != undefined) {
            td_1.addEventListener("click", call);
        }
    }, 2200);

    var SignOut = document.getElementById("SignOut");
    SignOut.addEventListener("click", function () {
        window.location.replace("../index.html");
        sessionStorage.removeItem("user");
    });
}else{
    window.location.replace("Invalid/Invalid.html");
}