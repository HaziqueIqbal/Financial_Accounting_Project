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
