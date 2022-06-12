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
var getInfoDB = []
function getFromFireBase() {
    const dbRef = ref(db);
    get(child(dbRef, `inventory_management/${gets.Username}`)).then((snapshot) => {
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



getFromFireBase();




if (gets == null) {
    window.location.replace("Invalid/Invalid.html");
}

var getUserName = document.getElementById("un");
var getAddress = document.getElementById("addr");
var email = document.getElementById("email");
var fye = document.getElementById("fye");

var getTitle = document.getElementById("getTitle");

getTitle.innerHTML = gets.OrganizationName;
getUserName.innerHTML = gets.Username;
getAddress.innerHTML = gets.Address;
fye.innerHTML = gets.Financial;
email.innerHTML = gets.Email;

var SignOut = document.getElementById("SignOut");
SignOut.addEventListener("click", function () {
    window.location.replace("../index.html");
    sessionStorage.removeItem("user");
});


var purchase_e = document.getElementById("purchase_e");
purchase_e.addEventListener("click", function () {
    window.location.href = "Inventory/purchase/purchase_event/purchase.html";
});

var purchase_r = document.getElementById("purchase_r");
purchase_r.addEventListener("click", function () {
    window.location.href = "Inventory/purchase/purchase_return/p_return.html";
});

var purchase_a = document.getElementById("purchase_a");
purchase_a.addEventListener("click", function () {
    window.location.href = "Inventory/purchase/purchase_dis_allow/p_r_a.html";
});

var purchase_cost = document.getElementById("purchase_cost");
purchase_cost.addEventListener("click", function () {
    window.location.href = "Inventory/purchase/fright_cost/fright_cost.html";
});

var sales_e = document.getElementById("sales_e");
sales_e.addEventListener("click", function () {
    window.location.href = "Inventory/sales/sales_event/sales_event.html";
});

var sales_r = document.getElementById("sales_r");
sales_r.addEventListener("click", function () {
    window.location.href = "Inventory/sales/sales_return/sales_return.html";
});

var sales_a = document.getElementById("sales_a");
sales_a.addEventListener("click", function () {
    window.location.href = "Inventory/sales/sales_dis_allow/sales_dis_allow.html";
});

var sales_cost = document.getElementById("sales_cost");
sales_cost.addEventListener("click", function () {
    window.location.href = "Inventory/sales/sales_cost/sales_cost.html";
});
var ledger = document.getElementById("ledger");
var trial_balance = [];
var sort_trial_balance = [];

var TB_Entry = document.getElementById("TB_Entry");
setTimeout(() => {

    if (getInfoDB[0] == undefined) {
        let doc = document.getElementById("dis");
        doc.style.display = "block";
    } else {
        let doc = document.getElementById("dis2");
        doc.style.display = "block";

        generate_T_Accounts()
    }
}, 2000)
function generate_T_Accounts() {
    for (let index = 0; index < getInfoDB[0].length; index++) {
        let container = document.createElement("div");
        container.setAttribute("class", "container");
        let p = document.createElement("p");
        p.setAttribute("class", "text");
        p.innerHTML = getInfoDB[0][index].AccountName;
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
        td_1.innerHTML = getInfoDB[0][index].Debit;
        td_2.innerHTML = getInfoDB[0][index].Credit;
        tr_1.appendChild(td_1);
        tr_1.appendChild(td_2);

        container.appendChild(p);
        table.appendChild(tr);
        table.appendChild(tr_1);

        container.appendChild(table);
        ledger.appendChild(container);
    }
    calculateTrailBalance(getInfoDB[0])
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