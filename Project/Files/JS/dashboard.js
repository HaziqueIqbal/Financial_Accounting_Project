var getUserName = document.getElementById("un");
var getAddress = document.getElementById("addr");
var email = document.getElementById("email");
var fye = document.getElementById("fye");

var getTitle = document.getElementById("getTitle");

var getDB = JSON.parse(sessionStorage.getItem("user"));

getTitle.innerHTML = getDB.OrganizationName;
getUserName.innerHTML = getDB.Username;
getAddress.innerHTML = getDB.Address;
fye.innerHTML = getDB.Financial;
email.innerHTML = getDB.Email;

var addYear = document.getElementById("addYear");
addYear.addEventListener("click",function(){
    window.location.href = "index.html";
});

function call(){
    window.location.href = "index.html";
}
var getInfo = JSON.parse(sessionStorage.getItem("user"));
console.log(getInfo[2022]);
if(getInfo[2022] != null){
    let GJ_Entry = document.getElementById("GJ_Entry");
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let td_1 = document.createElement("td");
    td.innerHTML = "2022";
    td_1.innerHTML = "Open";
    td_1.setAttribute("class","yr");
    td_1.setAttribute("onclick","call()");
    tr.appendChild(td);
    tr.appendChild(td_1);
    GJ_Entry.appendChild(tr);
    addYear.style.display ="none";
}else{
    addYear.style.display="inline-block";
}

var SignOut = document.getElementById("SignOut");
SignOut.addEventListener("click",function(){
    window.location.replace("../index.html");
});
