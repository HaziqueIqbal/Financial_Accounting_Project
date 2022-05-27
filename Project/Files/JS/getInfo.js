var getInfo = JSON.parse(sessionStorage.getItem("All Enteries GJ"));

var GJ_Entry = document.getElementById("GJ_Entry");
var j = 0;
if (getInfo != null) {
  
    for (let index = 0; index < getInfo.length; index++) {
        // console.log(`j start = ${j}`)
        for (j = index; j < index + 3; j++) {
            if (getInfo[j].v == 0) {
                // console.log(getInfo[j]);
                let tr = document.createElement("tr");
                let date = document.createElement("td");
                let accName = document.createElement("td");
                let deb = document.createElement("td");
                let cre = document.createElement("td");
                date.innerHTML = getInfo[j].date;
                date.setAttribute("rowspan", "3");
                accName.innerHTML = getInfo[j].AccountName;
                if (getInfo[j].Debit == 0) {
                    deb.innerHTML = "";
                    cre.innerHTML = getInfo[j].Credit;
                }
                if (getInfo[j].Credit == 0) {
                    deb.innerHTML = getInfo[j].Debit;
                    cre.innerHTML = "";
                }
                tr.appendChild(date);
                tr.appendChild(accName);
                tr.appendChild(deb);
                tr.appendChild(cre);
                GJ_Entry.append(tr);
            } else if (getInfo[j].v == 1) {
                // console.log(getInfo[j])
                let tr = document.createElement("tr");
                // let date = document.createElement("td");
                let accName = document.createElement("td");
                let deb = document.createElement("td");
                let cre = document.createElement("td");
                accName.innerHTML = getInfo[j].AccountName;
                if (getInfo[j].Debit == 0) {
                    deb.innerHTML = "";
                    cre.innerHTML = getInfo[j].Credit;
                }
                if (getInfo[j].Credit == 0) {
                    deb.innerHTML = getInfo[j].Debit;
                    cre.innerHTML = "";
                }
                tr.appendChild(accName);
                tr.appendChild(deb);
                tr.appendChild(cre);
                GJ_Entry.append(tr);
            } else if(getInfo[j].v == 2){
                // console.log(getInfo[j])
                let tr = document.createElement("tr");
                let desc = document.createElement("td");
                desc.setAttribute("colspan", "3");
                desc.innerHTML = "Description: " + getInfo[j].Description;
                tr.appendChild(desc);
                GJ_Entry.append(tr);
            }
        }
        // console.log(`j = ${j}`);
        index += j-1;
        // console.log(`index=${index}`)
    }
}