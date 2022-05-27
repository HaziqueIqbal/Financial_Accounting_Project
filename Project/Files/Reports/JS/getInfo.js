var getInfo = JSON.parse(sessionStorage.getItem("user"));
// console.log(getInfo[2022].three.additional)

var GJ_Entry = document.getElementById("AJ_Entry");
var j = 0;
if (getInfo[2022].three != undefined) {
    if (getInfo[2022].three.additional != undefined) {
        for (let index = 0; index < getInfo[2022].three.additional.length; index++) {
            // console.log(`j start = ${j}`)
            for (j = index; j < index + getInfo[2022].three.additional.length; j++) {
                if (getInfo[2022].three.additional[j].v == 0) {
                    console.log(getInfo[2022].three.additional[j]);
                    let tr = document.createElement("tr");
                    let date = document.createElement("td");
                    let accName = document.createElement("td");
                    let deb = document.createElement("td");
                    let cre = document.createElement("td");
                    date.innerHTML = getInfo[2022].three.additional[j].date;
                    date.setAttribute("rowspan", "3");
                    accName.innerHTML = getInfo[2022].three.additional[j].AccountName;
                    if (getInfo[2022].three.additional[j].Debit == 0) {
                        deb.innerHTML = "";
                        cre.innerHTML = getInfo[2022].three.additional[j].Credit;
                    }
                    if (getInfo[2022].three.additional[j].Credit == 0) {
                        deb.innerHTML = getInfo[2022].three.additional[j].Debit;
                        cre.innerHTML = "";
                    }
                    tr.appendChild(date);
                    tr.appendChild(accName);
                    tr.appendChild(deb);
                    tr.appendChild(cre);
                    GJ_Entry.append(tr);
                } else if (getInfo[2022].three.additional[j].v == 1) {
                    // console.log(getInfo[2022].three.additional[j])
                    let tr = document.createElement("tr");
                    // let date = document.createElement("td");
                    let accName = document.createElement("td");
                    let deb = document.createElement("td");
                    let cre = document.createElement("td");
                    accName.innerHTML = getInfo[2022].three.additional[j].AccountName;
                    if (getInfo[2022].three.additional[j].Debit == 0) {
                        deb.innerHTML = "";
                        cre.innerHTML = getInfo[2022].three.additional[j].Credit;
                    }
                    if (getInfo[2022].three.additional[j].Credit == 0) {
                        deb.innerHTML = getInfo[2022].three.additional[j].Debit;
                        cre.innerHTML = "";
                    }
                    tr.appendChild(accName);
                    tr.appendChild(deb);
                    tr.appendChild(cre);
                    GJ_Entry.append(tr);
                } else if (getInfo[2022].three.additional[j].v == 2) {
                    // console.log(getInfo[2022].three.additional[j])
                    let tr = document.createElement("tr");
                    let desc = document.createElement("td");
                    desc.setAttribute("colspan", "3");
                    desc.innerHTML = "Description: " + getInfo[2022].three.additional[j].Description;
                    tr.appendChild(desc);
                    GJ_Entry.append(tr);
                }
            }
            // console.log(`j = ${j}`);
            index += j - 1;
            // console.log(`index=${index}`)
        }
    }
}