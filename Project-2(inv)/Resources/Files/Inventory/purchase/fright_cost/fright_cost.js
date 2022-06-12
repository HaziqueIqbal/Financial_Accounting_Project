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
var asItIs = []
function getFromFireBase() {
    const dbRef = ref(db);
    get(child(dbRef, `inventory_management/${gets.Username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            if (snapshot.val().ledgers.one.TAccounts != undefined && snapshot.val().ledgers.one.AllEnteries != undefined) {
                getInfoDB.push(snapshot.val().ledgers.one.TAccounts)
                asItIs.push(snapshot.val().ledgers.one.AllEnteries);
            }
        } else {
            console.log("Not Found!");
            return;
        }
    }).catch((error) => {
        console.error(error);
    });
}

var extra = []
function getFromFireBase1() {
    const dbRef = ref(db);
    get(child(dbRef, `inventory_management/${gets.Username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            if (snapshot.val().ledgers.four != undefined) {
                extra.push(snapshot.val().ledgers.four.AllEnteries)
            }

        } else {
            console.log("Not Found!");
            return;
        }
    }).catch((error) => {
        console.error(error);
    });
}




getFromFireBase()
getFromFireBase1();


var name = document.getElementById("entry1");
var type = document.getElementById("entry2");
var amount = document.getElementById("entry3");
var description = document.getElementById("entryDescription");

var all_enteries = [];
setTimeout(() => {
    all_enteries = extra[0];
}, 2000)

var innerType = "";
function validate() {
    if (type.value == "asset") {
        amount.removeAttribute("readonly")
        innerType = "cash";
    } else if (type.value == "liability") {
        amount.removeAttribute("readonly")
        innerType = "accounts payable";
    }
    else {
        innerType = 0;
        amount.value = "";
        amount.setAttribute("readonly", "readonly");
    }
}

type.addEventListener("change", () => {
    validate();
});


const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();
if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;
let current = dd + '/' + mm + '/' + yyyy;

var enter = document.getElementById("entrySubmit");
enter.addEventListener("click", () => {
    if (getInfoDB[0] == undefined) {
        callAlert("Database is not ready! Please wait 1 sec", "red");
        return;
    } else {
        validate();
        if (checkInputs()) {
            factory(innerType, invName);
        }
    }
});
var GJ_Entry = document.getElementById("GJ_Entry");
function factory(typeI, nameI) {
    if (all_enteries == undefined) {
        all_enteries = [];
    }
    for (let j = 0; j < getInfoDB[0].length; j++) {
        if (nameI.toLowerCase() == getInfoDB[0][j].AccountName) {
            let x = Number(getInfoDB[0][j].Debit);
            x += Number(amount.value);
            getInfoDB[0][j].Debit = x;
            all_enteries.push({ "AccountName": getInfoDB[0][j].AccountName, "Debit": amount.value, "Credit": 0, "typeOfAccount": "asset", "v": 0, "date": current });
            break;
        }
    }
    let c = 0;
    for (let index = 0; index < getInfoDB[0].length; index++) {
        // console.log(type.toLowerCase()== getInfoDB[0][index].AccountName.toLowerCase())
        if (typeI.toLowerCase() == getInfoDB[0][index].AccountName.toLowerCase()) {
            let x = Number(getInfoDB[0][index].Credit);
            x += Number(amount.value);
            getInfoDB[0][index].Credit = x;
            all_enteries.push({ "AccountName": getInfoDB[0][index].AccountName, "Debit": 0, "Credit": amount.value, "typeOfAccount": getInfoDB[0][index].typeOfAccount, "v": 1 });
            break;
        }
        c++;
    }
    if (c == getInfoDB[0].length) {
        if (typeI == "cash") {
            all_enteries.push({ "AccountName": "cash", "Debit": 0, "Credit": amount.value, "typeOfAccount": "asset", "v": 1 });
            getInfoDB[0].push({ "AccountName": "cash", "Debit": 0, "Credit": amount.value, "typeOfAccount": "asset" });
        } else if (typeI == "accounts payable") {
            all_enteries.push({ "AccountName": "accounts payable", "Debit": 0, "Credit": amount.value, "typeOfAccount": "liability", "v": 1 });
            getInfoDB[0].push({ "AccountName": "accounts payable", "Debit": 0, "Credit": amount.value, "typeOfAccount": "asset" });
        }
    }
    all_enteries.push({ "Description": description.value, "v": 2 });
    let tr = document.createElement("tr");
    let date = document.createElement("td");
    let accName = document.createElement("td");
    let deb = document.createElement("td");
    let cre = document.createElement("td");
    date.setAttribute("rowspan", "3");
    date.innerHTML = current;
    accName.innerHTML = nameI;
    deb.innerHTML = amount.value;
    cre.innerHTML = "";
    tr.appendChild(date);
    tr.append(accName);
    tr.append(deb);
    tr.append(cre);
    GJ_Entry.append(tr);

    let tr1 = document.createElement("tr");
    let accName1 = document.createElement("td");
    let deb1 = document.createElement("td");
    let cre1 = document.createElement("td");
    if (typeI == "asset") {
        accName1.innerHTML = "cash";
    } else {
        accName1.innerHTML = "accounts payable";
    }
    deb1.innerHTML = "";
    cre1.innerHTML = amount.value;
    tr1.append(accName1);
    tr1.append(deb1);
    tr1.append(cre1);
    GJ_Entry.append(tr1);
    AddDescription(description.value);

    // console.log("after", getInfoDB[0])
    name.value = "";
    type.selectedIndex = 0;
    amount.value = "";
    description.value = "";

}

var search = document.getElementById("search");
var invName = "";
search.addEventListener("click", () => {
    if (name.value.toLowerCase() == "") {
        callAlert("Please enter inventory name!", "red");
        return;
    } else {
        let count = 0
        for (let index = 0; index < getInfoDB[0].length; index++) {
            if (name.value.toLowerCase() == getInfoDB[0][index].AccountName) {
                callAlert("Inventroy Found!", "green");
                invName = getInfoDB[0][index].AccountName;
                break;
            }
            count++;
        }
        if (count == getInfoDB[0].length) {
            callAlert("Inventory Not Found!", "red");
        }
    }
    // console.log("Before", getInfoDB[0])
});







function checkInputs() {
    if (name.value == "") {
        callAlert("Please enter inventory name!", "red");
        return false;
    } else if (type.value == 0) {
        callAlert("Please select type!", "red");
        return false;
    }
    else if (type.value == "asset" || type.value == "liability") {
        if (amount.value == "") {
            callAlert("Please enter amount!", "red");
            return false;
        } else if (description.value == "") {
            callAlert("Please enter description!", "red");
            return false;
        } else {
            return true;
        }
    } else if (description.value == "") {
        callAlert("Please enter description!", "red");
        return false;
    } else {
        return true;
    }
}

var x = document.getElementById("co");
function callAlert(msg, value) {
    x.innerHTML = msg;
    x.style.display = "block"
    x.style.color = value;
    setTimeout(() => {
        x.style.display = "none"
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


var reports = document.getElementById("reports");
reports.addEventListener("click", function () {
    if (all_enteries.length == 0) {
        callAlert("Your accounts are empty, kindly add something!", "#8B8000");
    } else {
        let getUser = JSON.parse(sessionStorage.getItem("user"));
        // console.log(getInfoDB[0])
        saveToFirebase(getUser);
        saveToFirebase1(getUser);
        setTimeout(() => {
            callAlert("Successfully Added!", "green");
        }, 3000);
    }
});


function saveToFirebase(getUser) {
    const dbRef = ref(db);
    get(child(dbRef, `inventory_management/${getUser.Username}`)).then((snapshot) => {
        // console.log("true")
        if (snapshot.exists()) {
            set(ref(db, "inventory_management/" + getUser.Username + `/ledgers/four`), {
                AllEnteries: all_enteries
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


function saveToFirebase1(getUser) {
    const dbRef = ref(db);
    get(child(dbRef, `inventory_management/${getUser.Username}`)).then((snapshot) => {
        // console.log("true")
        if (snapshot.exists()) {

            set(ref(db, "inventory_management/" + getUser.Username + `/ledgers/one`), {
                TAccounts: getInfoDB[0],
                AllEnteries: asItIs[0]
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












var SignOut = document.getElementById("SignOut");
SignOut.addEventListener("click", function () {
    window.location.replace("../../../../index.html");
});