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

var all_enteries = [];
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
            if (snapshot.val().ledgers.six != undefined) {
                extra.push(snapshot.val().ledgers.six.AllEnteries)
            }

        } else {
            console.log("Not Found!");
            return;
        }
    }).catch((error) => {
        console.error(error);
    });
}
getFromFireBase1()
getFromFireBase()

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

var getInvName = document.getElementById("entry1");
var search = document.getElementById("search");
var displayPrice = document.getElementById("displyamount");
var noOfUnits = document.getElementById("entry2");
var typeOfPayment = document.getElementById("entry3");
var description = document.getElementById("entryDescription");
var enter = document.getElementById("entrySubmit");

var invName = "";
var totalpayment = 0;
var units = 0;
var cogs = 0;
search.addEventListener("click", () => {
    if (getInvName.value.toLowerCase() == "") {
        callAlert("Please enter inventory name!", "red");
        return;
    } else if (noOfUnits.value == "") {
        callAlert("Please enter number of units!", "red");
        return;
    } else {
        let count = 0
        for (let index = 0; index < getInfoDB[0].length; index++) {
            if (getInvName.value.toLowerCase() == getInfoDB[0][index].AccountName) {
                callAlert("Inventroy Found!", "green");
                invName = getInfoDB[0][index].AccountName;
                if (getInfoDB[0][index].priceDetails.length == undefined) {
                    totalpayment = 0;
                    if (Number(noOfUnits.value) <= Number(getInfoDB[0][index].priceDetails.units)) {
                        let x = Number(noOfUnits.value);
                        let y = (getInfoDB[0][index].priceDetails.pricePerUnit);
                        cogs = y;
                        units = x;
                        let z = x * y;
                        totalpayment = (z + (y * 5));
                        displayPrice.value = `Return price is ${totalpayment}`;
                    } else {
                        callAlert("Not enough Inventory!", "red");
                        return;
                    }

                } else {
                    totalpayment = 0;
                    let totalUnits = 0;
                    let totalPrice = 0
                    for (let j = 0; j < getInfoDB[0][index].priceDetails.length; j++) {
                        totalUnits += Number(getInfoDB[0][index].priceDetails[j].units);
                        totalPrice += Number(getInfoDB[0][index].priceDetails[j].pricePerUnit);
                    }
                    if (Number(noOfUnits.value) <= totalUnits) {
                        totalPrice /= getInfoDB[0][index].priceDetails.length;
                        let x = Number(noOfUnits.value);
                        let y = totalPrice;
                        cogs = y;
                        units = totalUnits;
                        let z = x * y;
                        totalpayment = (z + (y * 5));
                        displayPrice.value = `Return price is ${totalpayment}`;
                    } else {
                        callAlert("Not enough Inventory!", "red");
                        return;
                    }
                }
                break;
            }
            count++;
        }
        if (count == getInfoDB[0].length) {
            callAlert("Inventory Not Found!", "red");
        }
    }
    console.log("before", getInfoDB[0]);
});
var innerType = "";
function validate() {
    if (typeOfPayment.value == "cash") {
        innerType = "cash";
    } else if (typeOfPayment.value == "accounts reveivable") {
        innerType = "accounts receivable";
    }
    else {
        innerType = 0;
    }
    // console.log(innerType)
}

enter.addEventListener("click", () => {
    if (getInfoDB[0] == undefined) {
        callAlert("Database is not ready! Please wait 1 sec", "red");
        return;
    } else {
        validate();
        if (checkInputs()) {
            factory(innerType, invName, totalpayment, cogs);
        }
    }
});

var GJ_Entry = document.getElementById("GJ_Entry");

function factory(t, n, total, cogs) {
    if (all_enteries == undefined) {
        all_enteries = [];
    }
    let x = 0;
    for (let j = 0; j < getInfoDB[0].length; j++) {
        if ("sales revenue" == getInfoDB[0][j].AccountName) {
            let x = Number(getInfoDB[0][j].Debit);
            x += Number(total);
            getInfoDB[0][j].Debit = x;
            all_enteries.push({ "AccountName": "sales revenue", "Debit": Number(total), "Credit": 0, "typeOfAccount": "revenue", "v": 0 });
            break;
        }
        x++;
    }
    if (x == getInfoDB[0].length) {
        getInfoDB[0].push({ "AccountName": "sales revenue", "Debit": Number(total), "Credit": 0, "typeOfAccount": "revenue" });
        all_enteries.push({ "AccountName": "sales revenue", "Debit": Number(total), "Credit": 0, "typeOfAccount": "revenue", "v": 0 });
    }
    let accp = 0;
    for (let j = 0; j < getInfoDB[0].length; j++) {
        if (t == getInfoDB[0][j].AccountName) {
            let x = Number(getInfoDB[0][j].Credit);
            x += Number(total);
            getInfoDB[0][j].Credit = x;
            all_enteries.push({ "AccountName": t, "Debit": 0, "Credit": Number(total), "typeOfAccount": "asset", "v": 1, "date": current });
            break;
        }
        accp++;
    }
    if (accp == getInfoDB[0].length) {
        getInfoDB[0].push({ "AccountName": "accounts receivable", "Debit": 0, "Credit": Number(total), "typeOfAccount": "asset" });
        all_enteries.push({ "AccountName": "accounts receivable", "Debit": 0, "Credit": Number(total), "typeOfAccount": "asset", "v": 1, "date": current });
    }

    ///

    for (let m = 0; m < getInfoDB[0].length; m++) {
        if (n == getInfoDB[0][m].AccountName) {
            let x = Number(getInfoDB[0][m].Debit);
            x += Number(cogs * noOfUnits.value);
            getInfoDB[0][m].Debit = x;
            all_enteries.push({ "AccountName": `${n}`, "Debit": cogs * noOfUnits.value, "Credit": 0, "typeOfAccount": "asset", "v": 2 })
            if (getInfoDB[0][m].priceDetails.length == undefined) {
                let xx = Number(getInfoDB[0][m].priceDetails.units);
                let yy = Number(noOfUnits.value);
                let zz = xx + yy;
                getInfoDB[0][m].priceDetails.units = zz;
            } else {
                let bbbb = 0
                for (let mn = 0; mn < getInfoDB[0][m].priceDetails.length; mn++) {
                    if (Number(getInfoDB[0][m].priceDetails[mn].units) == 0) {
                        let xx = Number(getInfoDB[0][m].priceDetails[mn].units);
                        let yy = Number(noOfUnits.value);
                        let zz = xx + yy;
                        getInfoDB[0][m].priceDetails[mn].units = zz;
                        break;
                    }
                    bbbb++;
                }
                if (bbbb == getInfoDB[0][m].priceDetails.length) {
                    var low = 0;
                    var high = getInfoDB[0][m].priceDetails.length;
                    var r = parseInt((Math.random() * (high - low)) + low);
                    let xx = Number(getInfoDB[0][m].priceDetails[r].units);
                    let yy = Number(noOfUnits.value);
                    let zz = xx + yy;
                    getInfoDB[0][m].priceDetails[r].units = zz;
                }
            }
            break;
        }
    }


    let b = 0;
    for (let j = 0; j < getInfoDB[0].length; j++) {
        if (`cogs ${n}` == getInfoDB[0][j].AccountName) {
            let x = Number(getInfoDB[0][j].Credit);
            x += Number(cogs * noOfUnits.value);
            getInfoDB[0][j].Credit = x;
            all_enteries.push({ "AccountName": `cogs ${n}`, "Debit": 0, "Credit": cogs * noOfUnits.value, "typeOfAccount": "expense", "v": 3 })
            break;
        }
        b++;
    }
    if (b == getInfoDB[0].length) {
        getInfoDB[0].push({ "AccountName": `cogs ${n}`, "Debit": 0, "Credit": cogs * noOfUnits.value, "typeOfAccount": "expense" });
        all_enteries.push({ "AccountName": `cogs ${n}`, "Debit": 0, "Credit": cogs * noOfUnits.value, "typeOfAccount": "expense", "v": 3 })
    }


    all_enteries.push({ "Description": entryDescription.value, "v": 4 });


    let date = document.createElement("td");
    let tr1 = document.createElement("tr");
    let accName1 = document.createElement("td");
    let deb1 = document.createElement("td");
    let cre1 = document.createElement("td");
    date.setAttribute("rowspan", "5");
    date.innerHTML = current;
    accName1.innerHTML = "sales revenue";
    deb1.innerHTML = total;
    cre1.innerHTML = "";
    tr1.appendChild(date);
    tr1.append(accName1);
    tr1.append(deb1);
    tr1.append(cre1);
    GJ_Entry.append(tr1);

    let tr = document.createElement("tr");
    let accName = document.createElement("td");
    let deb = document.createElement("td");
    let cre = document.createElement("td");
    accName.innerHTML = t;
    deb.innerHTML = "";
    cre.innerHTML = total;
    tr.append(accName);
    tr.append(deb);
    tr.append(cre);
    GJ_Entry.append(tr);



    let tr3 = document.createElement("tr");
    let accName3 = document.createElement("td");
    let deb3 = document.createElement("td");
    let cre3 = document.createElement("td");
    accName3.innerHTML = `${n}`;
    deb3.innerHTML = cogs * noOfUnits.value;
    cre3.innerHTML = "";
    tr3.append(accName3);
    tr3.append(deb3);
    tr3.append(cre3);
    GJ_Entry.append(tr3);

    let tr2 = document.createElement("tr");
    let accName2 = document.createElement("td");
    let deb2 = document.createElement("td");
    let cre2 = document.createElement("td");
    accName2.innerHTML = `cogs ${n}`;
    deb2.innerHTML = "";
    cre2.innerHTML = cogs * noOfUnits.value;
    tr2.append(accName2);
    tr2.append(deb2);
    tr2.append(cre2);
    GJ_Entry.append(tr2);

    AddDescription(description.value);
    console.log("after", getInfoDB[0])
}



function checkInputs() {
    if (getInvName.value == "") {
        callAlert("Please enter inventory name!", "red");
        return false;
    } else if (noOfUnits.value == "") {
        callAlert("Price enter number of units!", "red");
        return false;
    } else if (displayPrice.value == "") {
        callAlert("Price value is empty!", "red");
        return false;
    } else if (typeOfPayment.value == 0) {
        callAlert("Please select type!", "red");
        return false;
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
            set(ref(db, "inventory_management/" + getUser.Username + `/ledgers/six`), {
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