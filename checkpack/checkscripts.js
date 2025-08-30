let langData = {};
let dailyChecks = [];
//COOKIE FUNCTIONS
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    // Set the expiration date based on the number of days provided.
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    // Construct the cookie string.
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    let score = getCookie('last');
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
//LANGUAGE LOADING
fetch("loca.json")
  .then(response => response.json())
  .then(data => {
    langData = data;
    setLanguage("en"); // initialize after loading
  })
  .catch(err => console.error("Error loading languages:", err));
function dropdownMenu (id) {
    document.getElementById(id).classList.toggle("menuvis")
}
window.onclick = function(e) {
  if (!e.target.matches('.dropdownMenu')) {
  var myDropdown = document.getElementById("sm2");
    if (myDropdown.classList.contains('menuvis')) {
      myDropdown.classList.remove('menuvis');
    }
  }
}
function setLanguage(lang) {
      document.getElementById("welcomemessage").innerText = langData[lang].title;
      document.getElementById("menuAbout").innerText = langData[lang].menu.about;
}
function addItem() {
    const text = document.getElementById("itemText").value.trim();
    if (!text) return; // ignore empty input
    dailyChecks.push([text,false]);
    let dailyChecksJSON = JSON.stringify(dailyChecks);
    setCookie('dailyChecks',dailyChecksJSON,365);
    createDailyList();
}
function removeItem (removedIndex) {
    if(dailyChecks.length==1){
        dailyChecks=[];
        let dailyChecksJSON = JSON.stringify(dailyChecks);
        setCookie('dailyChecks',dailyChecksJSON,365);
    }
    else{
        dailyChecks.splice(removedIndex, 1);
        let dailyChecksJSON = JSON.stringify(dailyChecks);
        setCookie('dailyChecks',dailyChecksJSON,365);
    }
    createDailyList();
}
function editItem(indexEdit) {
    let text = document.getElementById("taskName"+indexEdit);
    if(document.getElementById("editbtn"+indexEdit).innerText=="Save"){
        //EDIT SITE
        let newVal = document.getElementById('inp'+indexEdit).value;
        text.replaceChildren();
        text.innerText=" "+newVal;
        document.getElementById("editbtn"+indexEdit).innerText="Edit";
        //edit JSON
        dailyChecks[indexEdit][0]=newVal;
        let dailyChecksJSON = JSON.stringify(dailyChecks);
        setCookie('dailyChecks',dailyChecksJSON,365);
    }
    else{
    let prev = text.innerText;
    text.innerHTML=`<input id='inp${indexEdit}' type='text' value='${prev}'>`;
    document.getElementById("editbtn"+indexEdit).innerText="Save";
    }
}
function uncheckAll () {
    if(dailyChecks.length>1){
        for (let index = 0; index < dailyChecks.length; index++) {
            dailyChecks[index][1]=false;
        }
        let dailyChecksJSON = JSON.stringify(dailyChecks);
        setCookie('dailyChecks',dailyChecksJSON,365);
        createDailyList();
    }
}
function alterItemState (alteredIndex){
    if(dailyChecks.length>0){
        if(dailyChecks[alteredIndex][1]==true){
            dailyChecks[alteredIndex][1]=false;
        }
        else {
            dailyChecks[alteredIndex][1]=true;
        }
        let dailyChecksJSON = JSON.stringify(dailyChecks);
        setCookie('dailyChecks',dailyChecksJSON,365);
    }
    createDailyList();
}
function createDailyList () {
    let dailyCCookie = getCookie('dailyChecks');
    if(dailyCCookie!=""){dailyChecks = JSON.parse(dailyCCookie)}
    const container = document.getElementById("checkListDaily");
    container.innerHTML="";
    let indexCheck = 0;
    if(dailyChecks!=""){
        dailyChecks.forEach(element => {
            let text = element[0];
            let container = document.getElementById("checkListDaily");
            // create checkbox
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            if(element[1]==true){checkbox.checked = true;}
            // create label
            let label = document.createElement("label");
            const baton = document.createElement("button");
            const baton2 = document.createElement("button");
            baton2.id="editbtn"+indexCheck;
            const span = document.createElement("span");
            span.id = "taskName"+indexCheck;
            span.appendChild(document.createTextNode(" "+text));
            label.appendChild(checkbox);
            label.appendChild(span);
            label.appendChild(baton);
            label.appendChild(baton2);
            baton.appendChild(document.createTextNode("Remove"));
            baton2.appendChild(document.createTextNode("Edit"));
            container.appendChild(label);
            // clear input
            document.getElementById("itemText").value = "";
            indexCheck++;
        });
        let buttons = container.querySelectorAll("button");
        let checkboxes = container.querySelectorAll("input");

        //add so that json saves the change to all checkboxes
        checkboxes.forEach((checkbox_, index) => {
            checkbox_.addEventListener("click", () => {
                alterItemState(index);
            });
        });

        //add so that you can delete
        buttons.forEach((btn, index) => {
            if(index % 2==0){
                btn.addEventListener("click", () => {
                    removeItem(index/2);
                });
            }
            else{
                btn.addEventListener("click", () => {
                    editItem(Math.floor(index/2));
                });
            }
        });
    }
    else{
        container.innerHTML="";
    }
}