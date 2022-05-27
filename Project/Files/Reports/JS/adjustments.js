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
var eventSumbit = document.getElementById("entrySubmit");

var getDebitAccount = document.getElementById("entryD1");
var getDebitAmount = document.getElementById("entryD_Amount");

var getCreditAccount = document.getElementById("entryC1");
var getCreditAmount = document.getElementById("entryC_Amount");

var typeD = document.getElementById("typeD");
var typeC = document.getElementById("typeC");

var getEntryDescription = document.getElementById("entryDescription");

var x = document.getElementById("co");

var reports = document.getElementById("reports_final");

var AJ_Entry = document.getElementById("AJ_Entry");



var additionalEnteries = [];
var additionalDescriptions = [];

var all_Enteries = [];
var getTrialBalance = [];

var getInfo = JSON.parse(sessionStorage.getItem("user"));
if (getInfo[2022].two != undefined) {
    if (getInfo[2022].three != undefined) {
        getTrialBalance = getInfo[2022].three.AdjTB;
        all_Enteries = getInfo[2022].three.additional;
        additionalEnteries = getInfo[2022].three.AdjTB;
    } else {
        getTrialBalance = getInfo[2022].two.sortTB;
        additionalEnteries = getInfo[2022].two.sortTB;
    }
}


eventSumbit.addEventListener("click", function () {
    if (getDebitAmount.value != getCreditAmount.value) {
        callAlert("Debit & Credit Amount Must be same!", "red");
    }
    else if (getCreditAccount.value == "" || getCreditAmount.value == "" || getDebitAccount.value == "" || getDebitAmount.value == "") {
        callAlert("Please fill all Input fields!", "red");
    }
    else if (typeD.value == 0 || typeC.value == 0) {
        callAlert("Please select account!", "red")
    } else if (getEntryDescription.value == "") {
        callAlert("Please enter description", "red");
    }
    else {
        //for debit side
        AddAccount(getDebitAccount.value, getDebitAmount.value, 0, typeD.value, 1);
        //for credit side
        AddAccount(getCreditAccount.value, 0, getCreditAmount.value, typeC.value, 2);
        AddDescription(getEntryDescription.value);
        all_Enteries.push({ "AccountName": getDebitAccount.value, "Debit": getDebitAmount.value, "Credit": 0, "typeOfAccount": typeD.value, "date": "31/December/2022", "v": 0 });
        all_Enteries.push({ "AccountName": getCreditAccount.value, "Debit": 0, "Credit": getCreditAmount.value, "typeOfAccount": typeC.value, "v": 1 });
        all_Enteries.push({ "Description": getEntryDescription.value, "v": 2 });
        getDebitAccount.value = "";
        getDebitAmount.value = "";
        typeD.selectedIndex = 0;;
        getCreditAccount.value = "";
        getCreditAmount.value = "";
        typeC.selectedIndex = 0;
        getEntryDescription.value = "";
        callAlert("Added Successfully!", "green");
    }
    console.log(getTrialBalance);
    console.log(additionalEnteries)
});

function AddAccount(account, debit_val, credit_val, type, val) {
    let accountName = account;
    let debit = debit_val;
    let credit = credit_val;
    let getType = type;
    let tempAccountIndex;
    let flag = 0;
    for (let index = 0; index < getTrialBalance.length; index++) {
        if (accountName.toLowerCase() === getTrialBalance[index].AccountName.toLowerCase()) {
            flag = 1;
            tempAccountIndex = index;
            break;
        }
    }
    if (flag == 0) {
        additionalEnteries.push({ "AccountName": accountName.toLowerCase(), "Debit": debit, "Credit": credit, "typeOfAccount": getType });
    }
    else {
        if (debit_val == 0) {
            let cre = getTrialBalance[tempAccountIndex].Credit;
            cre = Number(cre) + Number(credit_val);
            getTrialBalance[tempAccountIndex].Credit = cre;
        }
        if (credit_val == 0) {
            let deb = getTrialBalance[tempAccountIndex].Debit;
            deb = Number(deb) + Number(debit_val);
            getTrialBalance[tempAccountIndex].Debit = deb;
        }
    }
    let tr = document.createElement("tr");
    let date = document.createElement("td");
    let accName = document.createElement("td");
    let deb = document.createElement("td");
    let cre = document.createElement("td");

    if (val == 1) {
        date.innerHTML = "31/December/2022";
        date.setAttribute("rowspan", "3");
        accName.innerHTML = accountName;
        if (debit == 0) {
            deb.innerHTML = "";
            cre.innerHTML = credit;
        }
        if (credit == 0) {
            deb.innerHTML = debit;
            cre.innerHTML = "";
        }
        tr.appendChild(date);
        tr.appendChild(accName);
        tr.appendChild(deb);
        tr.appendChild(cre);
        AJ_Entry.append(tr);
    } else {
        accName.innerHTML = accountName;
        if (debit == 0) {
            deb.innerHTML = "";
            cre.innerHTML = credit;
        }
        if (credit == 0) {
            deb.innerHTML = debit;
            cre.innerHTML = "";
        }
        tr.appendChild(accName);
        tr.appendChild(deb);
        tr.appendChild(cre);
        AJ_Entry.append(tr);
    }

}

function saveToFirebase(getUser) {
    const dbRef = ref(db);
    console.log("h")
    get(child(dbRef, `organization/${getUser.Username}`)).then((snapshot) => {
        console.log("true")
        if (snapshot.exists()) {
            set(ref(db, "organization/" + getUser.Username + `/2022/three`), {
                AdjTB: additionalEnteries,
                additional: all_Enteries
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



// var New_TB = [];
// reports.addEventListener("click", function () {
//     // let stored = additionalEnteries;
//     // New_TB = getTrialBalance.concat(stored);
//     Array.prototype.push.apply(New_TB,getTrialBalance);
//     Array.prototype.push.apply(New_TB,additionalEnteries);
//     if (New_TB.length == 0) {
//         callAlert("Your adjusted accounts are empty, kindly add something!", "#8B8000");
//     } else {

//         console.log(New_TB)
//         let getUser = JSON.parse(sessionStorage.getItem("user"));
//         saveToFirebase(getUser);
//         sessionStorage.setItem("Final Trial Balance", JSON.stringify(New_TB));
//         setTimeout(() => {
//             callPage();
//         }, 3000);
//     }
// });
reports.addEventListener("click", function () {
    if (additionalEnteries.length == 0) {
        callAlert("Your accounts are empty, kindly add something!", "#8B8000");
    } else {
        let getUser = JSON.parse(sessionStorage.getItem("user"));
        saveToFirebase(getUser);
        setTimeout(() => {
            callPage();
        }, 3000);
    }
});

var SignOut = document.getElementById("SignOut");
SignOut.addEventListener("click", function () {
    window.location.replace("../../index.html");
});

function callPage() {
    window.location.href = "final_reports.html";
}

function AddDescription(getDesc) {
    additionalDescriptions.push({ "desc": getDesc });
    let tr = document.createElement("tr");
    let desc = document.createElement("td");
    desc.setAttribute("colspan", "3");
    desc.innerHTML = "Description: " + getDesc;
    tr.appendChild(desc);
    AJ_Entry.append(tr);
}

function callAlert(msg, value) {
    x.innerHTML = msg;
    x.style.display = "block"
    x.style.color = value;
    setTimeout(() => {
        x.style.display = "none"
    }, 5000)
}