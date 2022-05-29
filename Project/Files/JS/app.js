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

var GJ_Entry = document.getElementById("GJ_Entry");

const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();
if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;
let current = dd + '/' + mm + '/' + yyyy;

var x = document.getElementById("co");

var reports = document.getElementById("reports");

var counter = 0;
var T_Accounts = [];

var all_Enteries = [];



var gets = JSON.parse(sessionStorage.getItem("user"));
var getInfoDB = []
var getInfoDB2 = []
function getFromFireBase() {
    const dbRef = ref(db);
    get(child(dbRef, `organization/${gets.Username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach(c => {
                if (c.val().one != undefined) {
                    getInfoDB.push(c.val().one.TAccounts)
                    getInfoDB2.push(c.val().one.AllEnteries);
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

if (gets != null) {

    getFromFireBase()

    setTimeout(() => {
        T_Accounts = getInfoDB[0];
        all_Enteries = getInfoDB2[0];
    }, 2000)



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
            all_Enteries.push({ "AccountName": getDebitAccount.value, "Debit": getDebitAmount.value, "Credit": 0, "typeOfAccount": typeD.value, "date": current, "v": 0 });
            all_Enteries.push({ "AccountName": getCreditAccount.value, "Debit": 0, "Credit": getCreditAmount.value, "typeOfAccount": typeC.value, "v": 1 });
            all_Enteries.push({ "Description": getEntryDescription.value, "counter": counter, "v": 2 });
            counter += 1;
            getDebitAccount.value = "";
            getDebitAmount.value = "";
            typeD.selectedIndex = 0;
            getCreditAccount.value = "";
            getCreditAmount.value = "";
            typeC.selectedIndex = 0;
            getEntryDescription.value = "";
            callAlert("Added Successfully!", "green");
            console.log(T_Accounts)
        }


    });


    reports.addEventListener("click", function () {
        if (T_Accounts.length == 0) {
            callAlert("Your accounts are empty, kindly add something!", "#8B8000");
        } else {
            let getUser = JSON.parse(sessionStorage.getItem("user"));
            saveToFirebase(getUser);
            // sessionStorage.setItem("Accounts", JSON.stringify(T_Accounts));
            // sessionStorage.setItem("All Enteries GJ", JSON.stringify(all_Enteries));
            setTimeout(() => {
                callPage();
            }, 3000);
        }
    });

    var SignOut = document.getElementById("SignOut");
    SignOut.addEventListener("click", function () {
        window.location.replace("../index.html");
    });

} else {
    window.location.replace("Invalid/Invalid.html");
}


function callAlert(msg, value) {
    x.innerHTML = msg;
    x.style.display = "block"
    x.style.color = value;
    setTimeout(() => {
        x.style.display = "none"
    }, 5000)
}


function AddAccount(account, debit_val, credit_val, type, val) {
    let accountName = account;
    let debit = debit_val;
    let credit = credit_val;
    let getType = type;
    let tempAccountIndex;
    let flag = 0;
    if (T_Accounts.length == 0) {
        T_Accounts.push({ "AccountName": accountName.toLowerCase(), "Debit": debit, "Credit": credit, "typeOfAccount": getType });
    } else {
        for (let index = 0; index < T_Accounts.length; index++) {
            if (accountName.toLowerCase() === T_Accounts[index].AccountName.toLowerCase()) {
                flag = 1;
                tempAccountIndex = index;
                break;
            }
        }
        if (flag == 0) {
            T_Accounts.push({ "AccountName": accountName.toLowerCase(), "Debit": debit, "Credit": credit, "typeOfAccount": getType });
        }
        else {
            if (debit_val == 0) {
                let cre = T_Accounts[tempAccountIndex].Credit;
                cre = Number(cre) + Number(credit_val);
                T_Accounts[tempAccountIndex].Credit = cre;
            }
            if (credit_val == 0) {
                let deb = T_Accounts[tempAccountIndex].Debit;
                deb = Number(deb) + Number(debit_val);
                T_Accounts[tempAccountIndex].Debit = deb;
            }
        }
    }
    let tr = document.createElement("tr");
    let date = document.createElement("td");
    let accName = document.createElement("td");
    let deb = document.createElement("td");
    let cre = document.createElement("td");

    if (val == 1) {
        date.innerHTML = current;
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
        GJ_Entry.append(tr);
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
        GJ_Entry.append(tr);
    }

}


function AddDescription(getDesc) {
    let tr = document.createElement("tr");
    let desc = document.createElement("td");
    desc.setAttribute("colspan", "3");
    desc.innerHTML = "Description: " + getDesc;
    tr.appendChild(desc);
    GJ_Entry.append(tr);
}

function callPage() {
    window.location.href = "Reports/reports.html";
}

function saveToFirebase(getUser) {
    const dbRef = ref(db);
    get(child(dbRef, `organization/${getUser.Username}`)).then((snapshot) => {
        console.log("true")
        if (snapshot.exists()) {
            set(ref(db, "organization/" + getUser.Username + `/2022/one`), {
                TAccounts: T_Accounts,
                AllEnteries: all_Enteries
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
