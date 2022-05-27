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

var getTrialBalance = JSON.parse(sessionStorage.getItem("Trial Balance"));

var additionalEnteries = [];
var additionalDescriptions = [];

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

reports.addEventListener("click", function () {
    if (additionalEnteries.length == 0 && additionalDescriptions.length == 0) {
        callAlert("Your adjusted accounts are empty, kindly add something!", "#8B8000");
    }else{
        let New_TB;
        let stored = Object.assign(additionalEnteries);
        New_TB = getTrialBalance.concat(stored);
        sessionStorage.setItem("Final Trial Balance",JSON.stringify(New_TB));
        window.location.href = "final_reports.html";
    }
});

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