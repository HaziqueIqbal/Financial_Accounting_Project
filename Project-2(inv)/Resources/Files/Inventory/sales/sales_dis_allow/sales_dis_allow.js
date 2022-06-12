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
            if (snapshot.val().ledgers.seven != undefined) {
                extra.push(snapshot.val().ledgers.seven.AllEnteries)
            }

        } else {
            console.log("Not Found!");
            return;
        }
    }).catch((error) => {
        console.error(error);
    });
}


var all_enteries = []

getFromFireBase();
getFromFireBase1();


setTimeout(() => {
    all_enteries = extra[0];
}, 2500);


const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();
if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;
let current = dd + '/' + mm + '/' + yyyy;





var name = document.getElementById("entry1");
var type = document.getElementById("entry2");
var discount = document.getElementById("entry3");
var description = document.getElementById("entryDescription");
var displayAP = document.getElementById("entryX");

var innerType = "";
function validate() {
    if (type.value == "discount") {
        discount.removeAttribute("readonly")
        innerType = "discount";
    } else {
        innerType = 0;
        discount.value = "";
        discount.setAttribute("readonly", "readonly");
    }
}

var TAccounts = [];
type.addEventListener("change", () => {
    validate();
});
var finalvalue = 0;
var enter = document.getElementById("entrySubmit");
enter.addEventListener("click", () => {
    validate()
    if (checkInputs()) {
        factory(innerType);
    }
});
var GJ_Entry = document.getElementById("GJ_Entry");

function factory(getType) {
    if (getType == "discount") {
        for (let index = 0; index < getInfoDB[0].length; index++) {
            if (name.value.toLowerCase() == getInfoDB[0][index].AccountName) {
                let x = discount.value / 100;
                let y = finalvalue * x;
                let z = finalvalue - y;
                // console.log(z);
                let tr = document.createElement("tr");
                let date = document.createElement("td");
                let accName = document.createElement("td");
                let deb = document.createElement("td");
                let cre = document.createElement("td");
                date.setAttribute("rowspan", "4");
                date.innerHTML = current;
                accName.innerHTML = "cash";
                deb.innerHTML = z;
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
                accName1.innerHTML = name.value;
                deb1.innerHTML = y;
                cre1.innerHTML = "";
                tr1.append(accName1);
                tr1.append(deb1);
                tr1.append(cre1);
                GJ_Entry.append(tr1);

                let tr2 = document.createElement("tr");
                let accName2 = document.createElement("td");
                let deb2 = document.createElement("td");
                let cre2 = document.createElement("td");
                accName2.innerHTML = "accounts receivable";
                deb2.innerHTML = "";
                cre2.innerHTML = finalvalue;
                tr2.append(accName2);
                tr2.append(deb2);
                tr2.append(cre2);
                GJ_Entry.append(tr2);
                AddDescription(description.value);

                if (all_enteries == undefined) {
                    all_enteries = [];
                }
                all_enteries.push({ "AccountName": "cash", "Debit": z, "Credit": 0, "typeOfAccount": "asset", "v": 0, "date": current });
                all_enteries.push({ "AccountName": name.value.toLowerCase(), "Debit": y, "Credit": 0, "typeOfAccount": "asset", "v": 1 });
                all_enteries.push({ "AccountName": "accounts receivable", "Debit": 0, "Credit": finalvalue, "typeOfAccount": "asset", "v": 2 });
                all_enteries.push({ "Description": entryDescription.value, "v": 3 });
                for (let m = 0; m < getInfoDB[0].length; m++) {
                    if (getInfoDB[0][m].AccountName == "cash") {
                        getInfoDB[0][m].Debit += z;
                        break;
                    }
                }
                getInfoDB[0][index].Debit += y;
            }
        }
        let nm = 0
        for (let index = 0; index < getInfoDB[0].length; index++) {
            if (getInfoDB[0][index].AccountName == "accounts receivable") {
                getInfoDB[0][index].Credit += finalvalue;
                break;
            }
            nm++;
        }
        if (nm == getInfoDB[0].length) {
            getInfoDB[0].push({ "AccountName": "accounts receivable", "Debit": 0, "Credit": finalvalue, "typeOfAccount": "asset" });
        }
        console.log("before", getInfoDB[0])
    }
}

var search = document.getElementById("search");
search.addEventListener("click", () => {
    if (name.value.toLowerCase() == "") {
        callAlert("Please enter inventory name!", "red");
        return;
    } else {
        let bb = 0;
        let j = 0;
        for (let index = j; index < getInfoDB[0].length; index++) {
            if (name.value.toLowerCase() == getInfoDB[0][index].AccountName) {
                if (getInfoDB[0][index].priceDetails.length == undefined) {
                    // console.log(getInfoDB[0][index].priceDetails)
                    var price = Number(getInfoDB[0][index].priceDetails.pricePerUnit);
                    var items = Number(getInfoDB[0][index].priceDetails.units);
                    finalvalue = price * items;
                    displayAP.value = `${finalvalue} Rs`;
                } else {
                    var price = 0;
                    var items = 0
                    for (; j < getInfoDB[0][index].priceDetails.length; j++) {
                        console.log(getInfoDB[0][index].priceDetails[j])
                        price = Number(getInfoDB[0][index].priceDetails[j].pricePerUnit);
                        items = Number(getInfoDB[0][index].priceDetails[j].units);
                        finalvalue += price * items
                    }
                    displayAP.value = `${finalvalue} Rs`;
                }
                callAlert("Inventory Found!", "green");
                break;
            }
            bb++;
        }
        if (bb == getInfoDB[0].length) {
            callAlert("Inventory Not FOund!", "red");
            return;
        }
    }
    console.log("afterr", getInfoDB[0])
});


function checkInputs() {
    if (name.value == "") {
        callAlert("Please enter inventory name!", "red");
        return false;
    } else if (type.value == 0) {
        callAlert("Please select type!", "red");
        return false;
    } else if (displayAP.value == "") {
        callAlert("Kindly make select in first box!", "red");
        return false;
    }
    else if (type.value == "discount") {
        if (discount.value == "") {
            callAlert("Please enter discount value!", "red");
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
            set(ref(db, "inventory_management/" + getUser.Username + `/ledgers/seven`), {
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