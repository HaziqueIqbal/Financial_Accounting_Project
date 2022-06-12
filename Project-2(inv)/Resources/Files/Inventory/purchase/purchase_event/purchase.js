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
var T_Accounts = [];

var all_Enteries = [];


var eventSumbit = document.getElementById("entrySubmit");

var getAccountName = document.getElementById("entry1");
var getNumberofUnits = document.getElementById("entry2");
var getperUnitPrice = document.getElementById("entry3");
var gettypeofPayment = document.getElementById("entry4");

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


var gets = JSON.parse(sessionStorage.getItem("user"));
var getInfoDB = []
var getInfoDB2 = []
function getFromFireBase() {
    const dbRef = ref(db);
    get(child(dbRef, `inventory_management/${gets.Username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach(c => {
                if (c.val().one != undefined) {
                    getInfoDB.push(c.val().one.TAccounts)
                    getInfoDB2.push(c.val().one.AllEnteries)
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

setTimeout(() => {
    T_Accounts = getInfoDB[0];
    all_Enteries = getInfoDB2[0];
}, 2500)





eventSumbit.addEventListener("click", function () {
    if (getAccountName.value == "") {
        callAlert("Please enter Inventory name!", "red");
    }
    else if (getNumberofUnits.value == "") {
        callAlert("Please enter number of units!", "red")
    } else if (getperUnitPrice.value == "") {
        callAlert("Please enter per unit price!", "red");
    } else if (gettypeofPayment.value == 0) {
        callAlert("Please enter type of payment", "red");
    }
    else {
        let cal = getNumberofUnits.value * getperUnitPrice.value;
        let type = "Accounts Payable";
        //for debit side
        AddAccount(getAccountName.value, cal, 0, "Asset", 1, getperUnitPrice.value, getNumberofUnits.value);
        //for credit side
        AddAccount(type, 0, cal, gettypeofPayment.value, 2, getperUnitPrice.value, getNumberofUnits.value);
        AddDescription(getEntryDescription.value);
        all_Enteries.push({ "AccountName": getAccountName.value, "Debit": cal, "Credit": 0, "typeOfAccount": "Asset", "date": current, "v": 0 });
        all_Enteries.push({ "AccountName": type, "Debit": 0, "Credit": cal, "typeOfAccount": type, "v": 1 });
        all_Enteries.push({ "Description": getEntryDescription.value, "counter": counter, "v": 2 });
        counter += 1;
        getAccountName.value = "";
        getNumberofUnits.value = "";
        getperUnitPrice.value = "";
        gettypeofPayment.selectedIndex = 0;
        getEntryDescription.value = "";
        callAlert("Added Successfully!", "green");
        // console.log(T_Accounts)
    }


});

function AddAccount(account, debit_val, credit_val, type, val, price, noOfUnits) {
    let accountName = account;
    let debit = debit_val;
    let credit = credit_val;
    let getType = type;
    let tempAccountIndex;
    let flag = 0;
    if (T_Accounts == undefined && all_Enteries == undefined) {
        T_Accounts = []
        all_Enteries = []
    }
    if (T_Accounts.length == 0) {
        T_Accounts.push({ "AccountName": accountName.toLowerCase(), "Debit": debit, "Credit": credit, "typeOfAccount": getType, priceDetails: { "pricePerUnit": price, "units": noOfUnits } });
    } else {
        for (let index = 0; index < T_Accounts.length; index++) {
            if (accountName.toLowerCase() === T_Accounts[index].AccountName.toLowerCase()) {
                flag = 1;
                tempAccountIndex = index;
                break;
            }
        }
        if (flag == 0) {
            T_Accounts.push({ "AccountName": accountName.toLowerCase(), "Debit": debit, "Credit": credit, "typeOfAccount": getType, priceDetails: { "pricePerUnit": price, "units": noOfUnits } });
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
            console.log(T_Accounts[tempAccountIndex])

            let temp = [];
            temp.push(T_Accounts[tempAccountIndex].priceDetails);
            temp.push({ "pricePerUnit": price, "units": noOfUnits })
            T_Accounts[tempAccountIndex].priceDetails = temp;
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


reports.addEventListener("click", function () {
    if (T_Accounts.length == 0) {
        callAlert("Your accounts are empty, kindly add something!", "#8B8000");
    } else {
        let getUser = JSON.parse(sessionStorage.getItem("user"));
        saveToFirebase(getUser);
        setTimeout(() => {
            callAlert1("Successfully Added!", "green");
        }, 3000);
    }
});

var SignOut = document.getElementById("SignOut");
SignOut.addEventListener("click", function () {
    window.location.replace("../../../../index.html");
});



function callAlert(msg, value) {
    x.innerHTML = msg;
    x.style.display = "block"
    x.style.color = value;
    setTimeout(() => {
        x.style.display = "none"
    }, 5000)
}

var co1 = document.getElementById("co1");
function callAlert1(msg, value) {
    co1.innerHTML = msg;
    co1.style.display = "block"
    co1.style.color = value;
    setTimeout(() => {
        co1.style.display = "none"
    }, 5000)
}




function AddDescription(getDesc) {
    let tr = document.createElement("tr");
    let desc = document.createElement("td");
    desc.setAttribute("colspan", "3");
    desc.innerHTML = "Description: " + getDesc;
    tr.appendChild(desc);
    GJ_Entry.append(tr);
}


function saveToFirebase(getUser) {
    const dbRef = ref(db);
    get(child(dbRef, `inventory_management/${getUser.Username}`)).then((snapshot) => {
        console.log("true")
        if (snapshot.exists()) {
            set(ref(db, "inventory_management/" + getUser.Username + `/ledgers/one`), {
                TAccounts: T_Accounts,
                AllEnteries: all_Enteries
            }).then(() => {
                console.log("Added to DB!");
            }).catch((error) => {
                console.log("error" + error);
            });
        } else {
            callAlert("Record not found! try again.", "red");
            return;
        }
    }).catch((error) => {
        console.error(error);
    });
}
