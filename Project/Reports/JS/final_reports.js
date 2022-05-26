var getItems = JSON.parse(sessionStorage.getItem("Final Trial Balance"));

var final_trial_balance = [];
var final_sort_trial_balance = [];

var all_assets = [];
var all_liabilities = [];
var all_capitals = [];
var all_revenue = [];
var all_expense = [];

var ledger = document.getElementById("ledger");

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
            final_trial_balance.push({ "AccountName": getInfo[index].AccountName, "Debit": total, "Credit": 0, "typeOfAccount": getInfo[index].typeOfAccount });
        } else {
            final_trial_balance.push({ "AccountName": getInfo[index].AccountName, "Debit": 0, "Credit": Math.abs(total), "typeOfAccount": getInfo[index].typeOfAccount });
        }
    }
    sortTrialBalance();
}

function sortTrialBalance() {
    for (let index = 0; index < final_trial_balance.length; index++) {
        if (final_trial_balance[index].typeOfAccount.toLowerCase() == "asset") {
            final_sort_trial_balance.push(final_trial_balance[index]);
            all_assets.push(final_trial_balance[index]);
        }
    }
    for (let index = 0; index < final_trial_balance.length; index++) {
        if (final_trial_balance[index].typeOfAccount.toLowerCase() == "liability") {
            final_sort_trial_balance.push(final_trial_balance[index]);
            all_liabilities.push(final_trial_balance[index]);
        }
    }
    for (let index = 0; index < final_trial_balance.length; index++) {
        if (final_trial_balance[index].typeOfAccount.toLowerCase() == "owner") {
            final_sort_trial_balance.push(final_trial_balance[index]);
            all_capitals.push(final_trial_balance[index]);
        }
    }
    for (let index = 0; index < final_trial_balance.length; index++) {
        if (final_trial_balance[index].typeOfAccount.toLowerCase() == "revenue") {
            final_sort_trial_balance.push(final_trial_balance[index]);
            all_revenue.push(final_trial_balance[index]);
        }
    }
    for (let index = 0; index < final_trial_balance.length; index++) {
        if (final_trial_balance[index].typeOfAccount.toLowerCase() == "expense") {
            final_sort_trial_balance.push(final_trial_balance[index]);
            all_expense.push(final_trial_balance[index]);
        }
    }
    generateTrialBalance();
}

function generateTrialBalance() {
    let total_debit = 0;
    let total_credit = 0;
    for (let index = 0; index < final_sort_trial_balance.length; index++) {
        let tr = document.createElement("tr");
        let accountName = document.createElement("td");
        accountName.style.textTransform = "capitalize"
        let debit = document.createElement("td");
        let credit = document.createElement("td");
        accountName.innerHTML = final_sort_trial_balance[index].AccountName;
        if (final_sort_trial_balance[index].Debit == 0) {
            debit.innerHTML = ""
            credit.innerHTML = final_sort_trial_balance[index].Credit;
            total_credit += Number(final_sort_trial_balance[index].Credit);
        } else {
            debit.innerHTML = final_sort_trial_balance[index].Debit;
            total_debit += Number(final_sort_trial_balance[index].Debit);
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




generate_T_Accounts();
