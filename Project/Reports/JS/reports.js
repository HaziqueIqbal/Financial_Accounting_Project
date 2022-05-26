var getItems = JSON.parse(sessionStorage.getItem("Accounts"));

var trial_balance = [];
var sort_trial_balance = [];
// var all_assets = [];
// var all_liabilities = [];
// var all_capitals = [];

var TB_Entry = document.getElementById("TB_Entry");

var ledger = document.getElementById("ledger");

var adjustment = document.getElementById("adjustment");

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

adjustment.addEventListener("click", function () {
    sessionStorage.setItem("Trial Balance", JSON.stringify(sort_trial_balance));
    window.location.href = "adjustment.html";
});
// var total_asset = 0;
// var total_lib = 0;
// var total_capital = 0;
// function generateBalanceSheet() {
//     let table_1 = document.getElementById("table_1");
//     for (let index = 0; index < all_assets.length; index++) {
//         let tr = document.createElement("tr");
//         let td = document.createElement("td");
//         td.style.textTransform = "capitalize";
//         td.innerHTML = all_assets[index].AccountName;
//         td.style.border = "none"
//         let td_1 = document.createElement("td");
//         td_1.innerHTML = all_assets[index].Debit;
//         td_1.style.border = "none"
//         tr.appendChild(td);
//         tr.appendChild(td_1);
//         table_1.appendChild(tr);
//         total_asset += Number(all_assets[index].Debit);
//     }
//     let tr = document.createElement("tr");
//     let td = document.createElement("td");
//     let td_1 = document.createElement("td");
//     td.style.textTransform = "capitalize";
//     td.setAttribute("class", "b");
//     td.innerHTML = "Total";
//     td.style.border = "none";
//     td_1.setAttribute("class", "b");
//     td_1.innerHTML = total_asset;
//     td_1.style.border = "none";
//     tr.appendChild(td);
//     tr.appendChild(td_1);
//     table_1.appendChild(tr);


//     let table_2 = document.getElementById("table_2");
//     for (let index = 0; index < all_capitals.length; index++) {
//         let tr = document.createElement("tr");
//         let td = document.createElement("td");
//         td.style.textTransform = "capitalize";
//         td.innerHTML = all_capitals[index].AccountName;
//         td.style.border = "none"
//         let td_1 = document.createElement("td");
//         td_1.innerHTML = all_capitals[index].Credit;
//         td_1.style.border = "none"
//         tr.appendChild(td);
//         tr.appendChild(td_1);
//         table_2.appendChild(tr);
//         total_capital += Number(all_capitals[index].Credit);
//     }

//     let table_3 = document.getElementById("table_3");
//     for (let index = 0; index < all_liabilities.length; index++) {
//         let tr = document.createElement("tr");
//         let td = document.createElement("td");
//         td.style.textTransform = "capitalize";
//         td.innerHTML = all_liabilities[index].AccountName;
//         td.style.border = "none"
//         let td_1 = document.createElement("td");
//         td_1.innerHTML = all_liabilities[index].Credit;
//         td_1.style.border = "none"
//         tr.appendChild(td);
//         tr.appendChild(td_1);
//         table_3.appendChild(tr);
//         total_capital += Number(all_liabilities[index].Credit);
//     }    
// }

generate_T_Accounts();
