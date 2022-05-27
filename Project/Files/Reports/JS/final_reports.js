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
    calculateRevenue();
}

var total_REV = 0
function calculateRevenue() {

    let rev = document.getElementById("rev");
    for (let index = 0; index < all_revenue.length; index++) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.setAttribute("class", "bor");
        let td_1 = document.createElement("td");
        td.innerHTML = all_revenue[index].AccountName;
        td_1.innerHTML = all_revenue[index].Credit;
        td_1.setAttribute("class", "bor");
        total_REV += Number(all_revenue[index].Credit);
        tr.appendChild(td);
        tr.appendChild(td_1);
        rev.appendChild(tr);
    }
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let td_1 = document.createElement("td");
    td.innerHTML = "Total";
    td.classList.add("b");
    td.classList.add("bor");
    td_1.innerHTML = total_REV;
    td_1.setAttribute("class", "bor");
    tr.appendChild(td);
    tr.appendChild(td_1);
    rev.appendChild(tr);
    calculateExpense();
}
var total_EXP = 0
function calculateExpense() {
    let rev = document.getElementById("exp");
    for (let index = 0; index < all_expense.length; index++) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let td_1 = document.createElement("td");
        td.innerHTML = all_expense[index].AccountName;
        td.setAttribute("class", "bor");
        td_1.innerHTML = all_expense[index].Debit;
        td_1.setAttribute("class", "bor");
        total_EXP += Number(all_expense[index].Debit);
        tr.appendChild(td);
        tr.appendChild(td_1);
        rev.appendChild(tr);
    }
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let td_1 = document.createElement("td");
    td.innerHTML = "Total";
    td.classList.add("b");
    td.classList.add("bor");
    td_1.innerHTML = total_EXP;
    td_1.setAttribute("class", "bor");
    tr.appendChild(td);
    tr.appendChild(td_1);
    rev.appendChild(tr);
    IncomeStatement();
}

function IncomeStatement() {
    let calculate_net_income = document.getElementById("calculate_net_income");
    let output_income = document.getElementById("output_income");
    calculate_net_income.innerHTML = `Net Income = ${total_REV} - ${total_EXP}`;
    let net_income = total_REV - total_EXP;
    output_income.innerHTML = `Net Income = ${net_income} PKR`;
    OwnerEquity();
}
var total_CAP = 0;
function OwnerEquity() {
    let capital = document.getElementById("cap");
    for (let index = 0; index < all_capitals.length; index++) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let td_1 = document.createElement("td");
        td.innerHTML = all_capitals[index].AccountName;
        td.setAttribute("class", "bor");
        td_1.innerHTML = all_capitals[index].Credit;
        td_1.setAttribute("class", "bor");
        total_CAP += Number(all_capitals[index].Credit);
        tr.appendChild(td);
        tr.appendChild(td_1);
        capital.appendChild(tr);
    }
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let td_1 = document.createElement("td");
    td.innerHTML = "Total";
    td.classList.add("b");
    td.classList.add("bor");
    td_1.innerHTML = total_CAP;
    td_1.setAttribute("class", "bor");
    tr.appendChild(td);
    tr.appendChild(td_1);
    capital.appendChild(tr);
    calculateOE();
}

function calculateOE() {
    let flag = 0;
    let getIndex = 0;
    let calculate_O = document.getElementById("calculate_OE");
    let output_OE = document.getElementById("output_OE");
    let total_inc = total_REV - total_EXP;
    for (let index = 0; index < getItems.length; index++) {
        if (getItems[index].AccountName.toLowerCase() == "withdraw") {
            flag = 1;
            getIndex = index;
            break;
        }
    }
    let fianl_val = 0
    if (flag == 1) {
        calculate_O.innerHTML = `Owner Capital = ${total_inc} + ${total_CAP} - ${getItems[getIndex].Debit}`;
        fianl_val = total_CAP + total_inc - getItems[getIndex].Debit;
    } else {
        calculate_O.innerHTML = `Owner Capital = ${total_inc} + ${total_CAP} - ${0}`;
        fianl_val = total_CAP + total_inc - 0;
    }

    output_OE.innerHTML = `Owner Capital = ${fianl_val}`;
    assets()
}
var total_ASS = 0;
function assets() {
    let ass = document.getElementById("aasst");
    for (let index = 0; index < all_assets.length; index++) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let td_1 = document.createElement("td");
        td.innerHTML = all_assets[index].AccountName;
        td.setAttribute("class", "bor");
        td_1.innerHTML = all_assets[index].Debit;
        td_1.setAttribute("class", "bor");
        total_ASS += Number(all_assets[index].Debit);
        tr.appendChild(td);
        tr.appendChild(td_1);
        ass.appendChild(tr);
    }
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let td_1 = document.createElement("td");
    td.innerHTML = "Total";
    td.classList.add("b");
    td.classList.add("bor");
    td_1.innerHTML = total_ASS;
    td_1.setAttribute("class", "bor");
    tr.appendChild(td);
    tr.appendChild(td_1);
    ass.appendChild(tr);
    liabilities();
}

var total_LIB = 0;

function liabilities(){
    let lib = document.getElementById("lib");
    for (let index = 0; index < all_liabilities.length; index++) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let td_1 = document.createElement("td");
        td.innerHTML = all_liabilities[index].AccountName;
        td.setAttribute("class", "bor");
        td_1.innerHTML = all_liabilities[index].Credit;
        td_1.setAttribute("class", "bor");
        total_LIB += Number(all_liabilities[index].Credit);
        tr.appendChild(td);
        tr.appendChild(td_1);
        lib.appendChild(tr);
    }
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let td_1 = document.createElement("td");
    td.innerHTML = "Total";
    td.classList.add("b");
    td.classList.add("bor");
    td_1.innerHTML = total_LIB;
    td_1.setAttribute("class", "bor");
    tr.appendChild(td);
    tr.appendChild(td_1);
    lib.appendChild(tr);
    Oe();
}

function Oe(){
    let ooc = document.getElementById("OOC");
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let td_1 = document.createElement("td");
    td.innerHTML = "Total";
    td.classList.add("b");
    td.classList.add("bor");
    td_1.innerHTML = total_CAP;
    td_1.setAttribute("class", "bor");
    tr.appendChild(td);
    tr.appendChild(td_1);
    ooc.appendChild(tr);
    final_balance_sheet();
}

function final_balance_sheet(){
    let calculate_OE1 = document.getElementById("calculate_OE1");
    calculate_OE1.innerHTML = `${total_ASS} = ${total_LIB} + ${total_CAP}`;
    let fin = total_LIB + total_CAP;
    let output_OE1 = document.getElementById("output_OE1");
    if(total_ASS == fin){
        output_OE1.innerHTML = `${total_ASS} = ${fin} (Balanced)`;
    }else{
        output_OE1.innerHTML = `${total_ASS} = ${fin} (Not Balanced)`;
    } 
}

generate_T_Accounts();
