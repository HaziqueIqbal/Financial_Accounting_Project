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

// var getItems = JSON.parse(sessionStorage.getItem("Accounts"));

var gets = JSON.parse(sessionStorage.getItem("user"));
var getInfoDB = []
function getFromFireBase() {
    const dbRef = ref(db);
    get(child(dbRef, `organization/${gets.Username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach(c => {
                if (c.val().one != undefined) {
                    getInfoDB.push(c.val().one.TAccounts)

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






var trial_balance = [];
var sort_trial_balance = [];

var TB_Entry = document.getElementById("TB_Entry");

var ledger = document.getElementById("ledger");

var adjustment = document.getElementById("adjustment");

if (gets != null) {
    getFromFireBase()
    var getItems;
    // console.log(getItems)

    setTimeout(() => {
        getItems = getInfoDB[0];
        // console.log(getItems)
        generate_T_Accounts();
    }, 2000)


    var SignOut = document.getElementById("SignOut");
    SignOut.addEventListener("click", function () {
        window.location.replace("../../index.html");
        sessionStorage.removeItem("user");
    });


    adjustment.addEventListener("click", function () {
        let getUser = JSON.parse(sessionStorage.getItem("user"));
        saveToFirebase(getUser);
        // sessionStorage.setItem("Trial Balance", JSON.stringify(sort_trial_balance));
        setTimeout(() => {
            callPage();
        }, 3000);

    });
}else{
    window.location.replace("Invalid/Invalid.html");
}

function generate_T_Accounts() {
    for (let index = 0; index < getItems.length; index++) {
        let container = document.createElement("div");
        container.setAttribute("class", "container");
        let p = document.createElement("p");
        p.setAttribute("class", "text");
        p.innerHTML = getItems[index].AccountName;
        p.style.textTransform = "capitalize";
        let table = document.createElement("table");
        table.setAttribute("class", "cen");
        let tr = document.createElement("tr");
        let th_1 = document.createElement("th");
        let th_2 = document.createElement("th");
        th_1.innerHTML = "Debit";
        th_2.innerHTML = "Credit";
        tr.appendChild(th_1);
        tr.appendChild(th_2);

        let tr_1 = document.createElement("tr");
        let td_1 = document.createElement("td");
        let td_2 = document.createElement("td");
        td_1.innerHTML = getItems[index].Debit;
        td_2.innerHTML = getItems[index].Credit;
        tr_1.appendChild(td_1);
        tr_1.appendChild(td_2);

        container.appendChild(p);
        table.appendChild(tr);
        table.appendChild(tr_1);

        container.appendChild(table);
        ledger.appendChild(container);
    }
    calculateTrailBalance(getItems);
}


function calculateTrailBalance(getInfo) {
    for (let index = 0; index < getInfo.length; index++) {
        // console.log(getInfo[index]);
        let debit = getInfo[index].Debit;
        let credit = getInfo[index].Credit;
        let total = debit - credit;
        if (total > 0) {
            trial_balance.push({ "AccountName": getInfo[index].AccountName, "Debit": total, "Credit": 0, "typeOfAccount": getInfo[index].typeOfAccount });
        } else {
            trial_balance.push({ "AccountName": getInfo[index].AccountName, "Debit": 0, "Credit": Math.abs(total), "typeOfAccount": getInfo[index].typeOfAccount });
        }
    }
    sortTrialBalance();
}


function sortTrialBalance() {
    for (let index = 0; index < trial_balance.length; index++) {
        if (trial_balance[index].typeOfAccount.toLowerCase() == "asset") {
            sort_trial_balance.push(trial_balance[index]);
        }
    }
    for (let index = 0; index < trial_balance.length; index++) {
        if (trial_balance[index].typeOfAccount.toLowerCase() == "liability") {
            sort_trial_balance.push(trial_balance[index]);
        }
    }
    for (let index = 0; index < trial_balance.length; index++) {
        if (trial_balance[index].typeOfAccount.toLowerCase() == "owner") {
            sort_trial_balance.push(trial_balance[index]);
        }
    }
    for (let index = 0; index < trial_balance.length; index++) {
        if (trial_balance[index].typeOfAccount.toLowerCase() == "revenue") {
            sort_trial_balance.push(trial_balance[index]);
        }
    }
    for (let index = 0; index < trial_balance.length; index++) {
        if (trial_balance[index].typeOfAccount.toLowerCase() == "expense") {
            sort_trial_balance.push(trial_balance[index]);
        }
    }
    generateTrialBalance();
}


function generateTrialBalance() {
    let total_debit = 0;
    let total_credit = 0;
    for (let index = 0; index < sort_trial_balance.length; index++) {
        let tr = document.createElement("tr");
        let accountName = document.createElement("td");
        accountName.style.textTransform = "capitalize"
        let debit = document.createElement("td");
        let credit = document.createElement("td");
        accountName.innerHTML = sort_trial_balance[index].AccountName;
        if (sort_trial_balance[index].Debit == 0) {
            debit.innerHTML = ""
            credit.innerHTML = sort_trial_balance[index].Credit;
            total_credit += Number(sort_trial_balance[index].Credit);
        } else {
            debit.innerHTML = sort_trial_balance[index].Debit;
            total_debit += Number(sort_trial_balance[index].Debit);
            credit.innerHTML = "";
        }

        tr.appendChild(accountName);
        tr.appendChild(debit);
        tr.appendChild(credit);
        TB_Entry.appendChild(tr);
    }
    if (total_debit == total_credit) {
        let tr = document.createElement("tr");
        let total = document.createElement("td");
        let debit_side = document.createElement("td");
        let credit_side = document.createElement("td");
        total.innerHTML = "Total"
        total.setAttribute("class", "b");
        debit_side.innerHTML = total_debit;
        debit_side.setAttribute("class", "b");
        credit_side.innerHTML = total_credit;
        credit_side.setAttribute("class", "b");
        tr.appendChild(total);
        tr.appendChild(debit_side);
        tr.appendChild(credit_side);
        TB_Entry.appendChild(tr);
    } else {
        alert("Debit != Credit");
    }
}


function callPage() {
    window.location.href = "adjustment.html";
}

function saveToFirebase(getUser) {
    const dbRef = ref(db);
    get(child(dbRef, `organization/${getUser.Username}`)).then((snapshot) => {
        console.log("true")
        if (snapshot.exists()) {
            set(ref(db, "organization/" + getUser.Username + `/2022/two`), {
                sortTB: sort_trial_balance
            }).then(() => {
                console.log("Added to DB!")
            }).catch((error) => {
                callAlert("error" + error, "red");
            });
        } else {
            callAlert("Record not found! try again.", "red");
            return;
        }
    }).catch((error) => {
        console.error(error);
    });
}
