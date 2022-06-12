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
var all_enteries = [];
function getFromFireBase1() {
    const dbRef = ref(db);
    get(child(dbRef, `inventory_management/${gets.Username}`)).then((snapshot) => {
        if (snapshot.exists()) {
            if (snapshot.val().ledgers.two != undefined) {
                // console.log(snapshot.val().ledgers.two.AllEnteries)
                extra.push(snapshot.val().ledgers.two.AllEnteries)
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

var status = "";
let information = document.getElementById("information");
var getName = document.getElementById("entry1");
var click = document.getElementById("click");
var GJ_Entry = document.getElementById("GJ_Entry");
setTimeout(() => {
    status = "ready"
    all_enteries = extra[0];
}, 2500);


click.addEventListener("click", function () {
    if (status == "ready") {
        if (getName.value == "") {
            callAlert("Please enter inventory name to search", "red");
        } else {
            appendInInformation(getName.value.toLowerCase());
        }
    } else {
        callAlert("Database is NOT loaded, wait for 1 sec!", "red");
    }
});
getName.addEventListener("change", function () {
    information.innerHTML = ""
})

const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();
if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;
let current = dd + '/' + mm + '/' + yyyy;


function appendInInformation(name) {
    let j = 0
    for (let index = j; index < getInfoDB[0].length; index++) {
        if (getInfoDB[0][index].typeOfAccount == "Asset" && getInfoDB[0][index].AccountName == name) {
            if (getInfoDB[0][index].priceDetails.length == undefined) {
                let option = document.createElement("option");
                option.innerHTML = `Items: ${getInfoDB[0][index].priceDetails.units} at price ${getInfoDB[0][index].priceDetails.pricePerUnit}`;
                information.append(option);
            } else {
                for (; j < getInfoDB[0][index].priceDetails.length; j++) {

                    let option = document.createElement("option");
                    option.setAttribute("value", j);
                    option.innerHTML = `Items: ${getInfoDB[0][index].priceDetails[j].units} at price ${getInfoDB[0][index].priceDetails[j].pricePerUnit}`;
                    information.append(option);
                }
            }
        }
    }

}


var noofReturnItems = document.getElementById("entry2");
var entryDescription = document.getElementById("entryDescription");
function process() {
    let info;
    let payment;
    let info2;
    let selectedItem = information.value;
    for (let index = 0; index < getInfoDB[0].length; index++) {
        if (getInfoDB[0][index].AccountName == getName.value) {
            if (getInfoDB[0][index].priceDetails.length == undefined) {
                if (Number(noofReturnItems.value) <= Number(getInfoDB[0][index].priceDetails.units)) {
                    let val = Number(noofReturnItems.value)
                    payment = val * Number(getInfoDB[0][index].priceDetails.pricePerUnit);
                    info = getInfoDB[0][index];
                    let f = Number(getInfoDB[0][index].priceDetails.units) - val;
                    console.log(f)
                    getInfoDB[0][index].Credit += payment;
                    getInfoDB[0][index].priceDetails.units = f;
                } else {
                    callAlert("Not enough inventory", "red");
                    return;
                }
            } else {
                if (Number(noofReturnItems.value) <= Number(getInfoDB[0][index].priceDetails[selectedItem].units)) {
                    let val = Number(noofReturnItems.value)
                    payment = val * Number(getInfoDB[0][index].priceDetails[selectedItem].pricePerUnit);
                    info = getInfoDB[0][index];
                    let f = Number(getInfoDB[0][index].priceDetails[selectedItem].units) - val;
                    console.log(f)
                    getInfoDB[0][index].Credit += payment;
                    getInfoDB[0][index].priceDetails[selectedItem].units = f;
                } else {
                    callAlert("Not enough inventory", "red");
                    return;
                }
            }
        }
    }
    for (let k = 0; k < getInfoDB[0].length; k++) {
        if (getInfoDB[0][k].AccountName == "accounts payable") {
            info2 = getInfoDB[0][k];
            getInfoDB[0][k].Debit += payment;
        }

    }

    let tr = document.createElement("tr");
    let date = document.createElement("td");
    let accName = document.createElement("td");
    let deb = document.createElement("td");
    let cre = document.createElement("td");
    date.setAttribute("rowspan", "3");
    date.innerHTML = current;
    accName.innerHTML = "Accounts Payable";
    deb.innerHTML = payment;
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
    accName1.innerHTML = getName.value;
    deb1.innerHTML = "";
    cre1.innerHTML = payment;
    tr1.append(accName1);
    tr1.append(deb1);
    tr1.append(cre1);
    GJ_Entry.append(tr1);

    AddDescription(entryDescription.value);
    if (all_enteries == undefined) {
        all_enteries = [];
    }
    all_enteries.push({ "AccountName": "Accounts Payable", "Debit": payment, "Credit": 0, "typeOfAccount": "liability", "v": 0, "date": current });
    all_enteries.push({ "AccountName": getName.value.toLowerCase(), "Debit": 0, "Credit": payment, "typeOfAccount": "asset", "v": 1 });
    all_enteries.push({ "Description": entryDescription.value, "v": 2 });
    getName.value = "";
    information.innerHTML = "";
    noofReturnItems.value = "";
    entryDescription.value = "";
}

var enter = document.getElementById('entrySubmit');
enter.addEventListener("click", function () {
    if (getName.value == "") {
        callAlert("Please enter inventory name", "red");
    }
    else if (noofReturnItems.value == "") {
        callAlert("Please enter inventory quantity to return", "red");
    } else if (entryDescription.value == "") {
        callAlert("Please enter description", "red");
    }
    else {
        process();
    }
})


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




var SignOut = document.getElementById("SignOut");
SignOut.addEventListener("click", function () {
    window.location.replace("../../../../index.html");
});

var reports = document.getElementById("reports");
reports.addEventListener("click", function () {
    if (all_enteries.length == 0) {
        callAlert("Your accounts are empty, kindly add something!", "#8B8000");
    } else {
        let getUser = JSON.parse(sessionStorage.getItem("user"));
        saveToFirebase(getUser);
        saveToFirebase1(getUser)
        setTimeout(() => {
            callAlert("Successfully Added!", "green");
        }, 3000);
    }
});


function saveToFirebase(getUser) {
    const dbRef = ref(db);
    get(child(dbRef, `inventory_management/${getUser.Username}`)).then((snapshot) => {
        console.log("true")
        if (snapshot.exists()) {
            set(ref(db, "inventory_management/" + getUser.Username + `/ledgers/two`), {
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
        console.log("true")
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