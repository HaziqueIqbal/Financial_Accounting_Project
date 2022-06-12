// var getInfo = JSON.parse(sessionStorage.getItem("user"));
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


var gets = JSON.parse(sessionStorage.getItem("user"));
var getInfoDB = [];
function getFromFireBase() {
    const dbRef = ref(db);
    get(child(dbRef, `inventory_management/${gets.Username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach(c => {
                if (c.val().four != undefined) {
                    getInfoDB.push(c.val().four.AllEnteries)
                    //    console.log(c.val().one.AllEnteries)
                }
            })
        } else {
            console.log("Not Found!");
            return;
        }
    }).catch((error) => {
        console.error(error);
    });
}



getFromFireBase()



// console.log(getInfo)
var getInfo;
setTimeout(() => {
    getInfo = getInfoDB[0];
    var GJ_Entry = document.getElementById("GJ_Entry");
    var j = 0;
    if (getInfo != undefined) {
        for (let index = 0; index < getInfo.length; index++) {
            // console.log(`j start = ${j}`)
            for (j = index; j < index + getInfo.length; j++) {
                if (getInfo[j].v == 0) {
                    // console.log(getInfo[j]);
                    let tr = document.createElement("tr");
                    let date = document.createElement("td");
                    let accName = document.createElement("td");
                    let deb = document.createElement("td");
                    let cre = document.createElement("td");
                    date.innerHTML = getInfo[j].date;
                    date.setAttribute("rowspan", "3");
                    accName.innerHTML = getInfo[j].AccountName;
                    if (getInfo[j].Debit == 0) {
                        deb.innerHTML = "";
                        cre.innerHTML = getInfo[j].Credit;
                    }
                    if (getInfo[j].Credit == 0) {
                        deb.innerHTML = getInfo[j].Debit;
                        cre.innerHTML = "";
                    }
                    tr.appendChild(date);
                    tr.appendChild(accName);
                    tr.appendChild(deb);
                    tr.appendChild(cre);
                    GJ_Entry.append(tr);
                } else if (getInfo[j].v == 1) {
                    // console.log(getInfo[j])
                    let tr = document.createElement("tr");
                    // let date = document.createElement("td");
                    let accName = document.createElement("td");
                    let deb = document.createElement("td");
                    let cre = document.createElement("td");
                    accName.innerHTML = getInfo[j].AccountName;
                    if (getInfo[j].Debit == 0) {
                        deb.innerHTML = "";
                        cre.innerHTML = getInfo[j].Credit;
                    }
                    if (getInfo[j].Credit == 0) {
                        deb.innerHTML = getInfo[j].Debit;
                        cre.innerHTML = "";
                    }
                    tr.appendChild(accName);
                    tr.appendChild(deb);
                    tr.appendChild(cre);
                    GJ_Entry.append(tr);
                } else if (getInfo[j].v == 2) {
                    // console.log(getInfo[j])
                    let tr = document.createElement("tr");
                    let desc = document.createElement("td");
                    desc.setAttribute("colspan", "3");
                    desc.innerHTML = "Description: " + getInfo[j].Description;
                    tr.appendChild(desc);
                    GJ_Entry.append(tr);
                }
            }
            // console.log(`j = ${j}`);
            index += j - 1;
            // console.log(`index=${index}`)
        }
    }
}, 2500);