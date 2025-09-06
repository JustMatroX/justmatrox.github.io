let langData = {};
let dailyChecks = [];
let weeklyChecks = [];
let siteSettings = [];
let locaData = [];
let availableLanguages=["en","pl","de","es"];
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
// SETTINGS FUNCTIONS
function setLanguage(lang) {
    //menu
    document.getElementById("menuAbout").innerText = langData[lang].menu.about;
    document.getElementById("menuLanguage").innerText = "Language: "+langData[lang].menu.language;
    document.getElementById("menuDailyList").innerText = langData[lang].menu.dailyList;
    document.getElementById("menuWeeklyList").innerText = langData[lang].menu.weeklyList;
    //checklist
    document.getElementById("welcomemessageDaily").innerText = langData[lang].checklist.titleToday;
    document.getElementById("welcomemessageWeek").innerText = langData[lang].checklist.titleWeek;
    document.getElementById("addButton").innerText = langData[lang].checklist.addButton;
    document.getElementById("addButton2").innerText = langData[lang].checklist.addButton;
    document.getElementById("uncheckallButton").innerText = langData[lang].checklist.uncheckAllButton;
    document.getElementById("uncheckallButton2").innerText = langData[lang].checklist.uncheckAllButton;
    document.getElementById("deleteallButton").innerText = langData[lang].checklist.deleteAllButton;
    document.getElementById("deleteallButton2").innerText = langData[lang].checklist.deleteAllButton;
}
function saveSettings () {
    let JSONsettings = JSON.stringify(siteSettings);
    setCookie('siteSettings',JSONsettings,365);
}
function applySettings () {
    let settingsSaved = getCookie('siteSettings');
    if(settingsSaved!=""){
        settingsSaved = JSON.parse(settingsSaved);
        //language
        siteSettings[0]=settingsSaved[0];
        setLanguage(availableLanguages[siteSettings[0]]);
        //is dailyopen?
        siteSettings[1]=settingsSaved[1];
        if(siteSettings[1]) {
            document.getElementById("dailyContainer").style.display="block";
        }
        else {
            document.getElementById("dailyContainer").style.display="none";
        }
        //is weekly open?
        siteSettings[2]=settingsSaved[2];
        if(siteSettings[2]) {
            document.getElementById("weeklyContainer").style.display="block";
        }
        else {
            document.getElementById("weeklyContainer").style.display="none";
        }
        //is split view on?
        siteSettings[3]=settingsSaved[3];
        if(siteSettings[3]){
            document.getElementById("mainpage").classList.add("split-scr");
        }
        else{
            document.getElementById("mainpage").classList.remove("split-scr");
        }
    }
    else {
        siteSettings[0]=0;
        siteSettings[1]=true;
        siteSettings[2]=false;
        siteSettings[3]=false;
        saveSettings();
        applySettings();
    }
}
function changeSettings (which) {
    switch (which) {
        case 0:
            if(siteSettings[0]<availableLanguages.length-1){
                siteSettings[0]++;
            }
            else{
                siteSettings[0]=0;
            }
            break;
        case 1:
            if(siteSettings[1]==true){
                //if(siteSettings[2]==false){siteSettings[2]=true}
                siteSettings[1]=false;
            }
            else{
                siteSettings[1]=true;
                //if(siteSettings[2]==true){siteSettings[2]=false}
            }
            break;
        case 2:
            if(siteSettings[2]==true){
                //if(siteSettings[1]==false){siteSettings[1]=true}
                siteSettings[2]=false;
            }
            else{
                siteSettings[2]=true;
                //if(siteSettings[1]==true){siteSettings[1]=false}
            }
            break;
        case 3:
            if(siteSettings[3]==true){
                siteSettings[3]=false;
            }
            else{
                siteSettings[3]=true;
            }
            break;
        default:
            break;
    }
    saveSettings();
    applySettings();
}
//LANGUAGE LOADING
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
function loadingProcedures () {
    fetch("loca.json")
    .then(response => response.json())
    .then(data => {
        langData = data;
        locaData = data;
    })
    .catch(err => console.error("Error loading languages:", err));
    setTimeout(() => {
        applySettings();
        createList("dailyChecks","checkListDaily");
        createList("weeklyChecks","checkListWeekly");
        updateDates();
    }, 300);
    
}
function updateDates () {
    let currenttime = new Date();
    let dateToday = currenttime.getFullYear()+"."+(1+currenttime.getMonth())+"."+currenttime.getDate();
    let dayToday = langData[availableLanguages[siteSettings[0]]].daysOfWeek[currenttime.getDay()];
    document.getElementById("dayToday").innerText=dayToday;
    document.getElementById("dateToday").innerText=dateToday;
    let minutesNow=currenttime.getMinutes();
    if(minutesNow<10)minutesNow="0"+minutesNow;
    document.getElementById("timeNow").innerText=currenttime.getHours()+":"+minutesNow
    setInterval(() => {
        dateToday = currenttime.getFullYear()+"."+(1+currenttime.getMonth())+"."+currenttime.getDate();
        dayToday = langData[availableLanguages[siteSettings[0]]].daysOfWeek[currenttime.getDay()];
        document.getElementById("dayToday").innerText=dayToday;
        document.getElementById("dateToday").innerText=dateToday;
        currenttime = new Date();
        minutesNow=currenttime.getMinutes();
        if(minutesNow<10)minutesNow="0"+minutesNow;
        document.getElementById("timeNow").innerText=currenttime.getHours()+":"+minutesNow
    }, 1000);

}

function UpdateChecklistTimestamp (updateIndex,cookiet){
    if(cookiet=="dailyChecks"){
    dailyChecks[updateIndex][2] = new Date();
    }
    else if (cookiet=="weeklyChecks"){
    weeklyChecks[updateIndex][2] = new Date();
    }
}
function AddChecklistItem(type) {
    const text = document.getElementById("itemText"+type).value.trim();
    if (!text) return; // ignore empty input
    if(type=="day"){
        dailyChecks.push([text,false,new Date()]);
        let dailyChecksJSON = JSON.stringify(dailyChecks);
        setCookie('dailyChecks',dailyChecksJSON,365);
        createList("dailyChecks","checkListDaily",type);
    }
    else if(type=="week") {
        weeklyChecks.push([text,false,new Date()]);
        let weeklyChecksJSON = JSON.stringify(weeklyChecks);
        setCookie('weeklyChecks',weeklyChecksJSON,365);
        createList("weeklyChecks","checkListWeekly",type);
    }
}
function RemoveChecklistItem (cookiet,containert,removedIndex) {
    if(cookiet=="dailyChecks"){
        console.log("dailydel");
        if(dailyChecks.length==1){
            dailyChecks=[];
            let listJSON = JSON.stringify(dailyChecks);
            setCookie('dailyChecks',listJSON,365);
        }
        else{
            dailyChecks.splice(removedIndex, 1);
            let listJSON = JSON.stringify(dailyChecks);
            setCookie('dailyChecks',listJSON,365);
        }
    }
    else if(cookiet=="weeklyChecks"){
        console.log("weeklydel");
        if(weeklyChecks.length==1){
            weeklyChecks=[];
            let listJSON = JSON.stringify(weeklyChecks);
            setCookie('weeklyChecks',listJSON,365);
        }
        else{
            weeklyChecks.splice(removedIndex, 1);
            let listJSON = JSON.stringify(weeklyChecks);
            setCookie('weeklyChecks',listJSON,365);
        }
    }
    createList(cookiet,containert);
}
function EditChecklistItem(abbr,indexEdit,cookiet,containert) {
    //get text to edit
    let text = document.getElementById(abbr+"taskName"+indexEdit);
    //check if save of edit
    if(document.getElementById(abbr+"editbtn"+indexEdit).innerText=="Save"){
        //EDIT SITE
        let newVal = document.getElementById(abbr+'inp'+indexEdit).value;
        text.replaceChildren();
        //edit JSON
        if(cookiet=="dailyChecks"){
            dailyChecks[indexEdit][0]=newVal;
            let listJSON = JSON.stringify(dailyChecks);
            setCookie('dailyChecks',listJSON,365);
        }
        else if(cookiet=="weeklyChecks"){
            weeklyChecks[indexEdit][0]=newVal;
            let listJSON = JSON.stringify(weeklyChecks);
            setCookie('weeklyChecks',listJSON,365);
        }
        UpdateChecklistTimestamp (indexEdit,cookiet);
        createList(cookiet,containert);
    }
    else{
    //render input
    let prev = text.innerText;
    text.innerHTML=`<input id='${abbr}inp${indexEdit}' type='text' value='${prev}'>`;
    //change button text
    document.getElementById(abbr+"editbtn"+indexEdit).innerText="Save";
    }
}
function UncheckAll (houhou) {
    if(houhou=='d'&dailyChecks.length>0){
        for (let index = 0; index < dailyChecks.length; index++) {
            dailyChecks[index][1]=false;
            UpdateChecklistTimestamp (index,"dailyChecks");
        }
        let dailyChecksJSON = JSON.stringify(dailyChecks);
        setCookie('dailyChecks',dailyChecksJSON,365);
        createList("dailyChecks","checkListDaily");
    }
    else if(houhou=='w'&weeklyChecks.length>0){
        for (let index = 0; index < weeklyChecks.length; index++) {
            weeklyChecks[index][1]=false;
            UpdateChecklistTimestamp (index,"weeklyChecks");
        }
        let weeklyChecksJSON = JSON.stringify(weeklyChecks);
        setCookie('weeklyChecks',weeklyChecksJSON,365);
        createList("weeklyChecks","checkListWeekly");
    }
}
function DeleteAll (houhou) {
    if(houhou=='d'&dailyChecks.length>0){
        let confirmDeletion = prompt(locaData[availableLanguages[siteSettings[0]]].checklist.confirmDeletion, "");
        let text;
        if (confirmDeletion == "OK") {
            dailyChecks=[];
            let dailyChecksJSON = JSON.stringify(dailyChecks);
            setCookie('dailyChecks',dailyChecksJSON,365);
            createList("dailyChecks","checkListDaily");
            alert(locaData[availableLanguages[siteSettings[0]]].checklist.infoDeletedAll);
        } 
        else {
            alert(locaData[availableLanguages[siteSettings[0]]].checklist.infoDidntDeleteAll);
        }
    }
    else if(houhou=='w'&weeklyChecks.length>0){
        if (confirmDeletion == "OK") {
            weeklyChecks=[];
            let weeklyChecksJSON = JSON.stringify(weeklyChecks);
            setCookie('weeklyChecks',weeklyChecksJSON,365);
            alert(locaData[availableLanguages[siteSettings[0]]].checklist.infoDeletedAll);
        } 
        else {
            alert(locaData[availableLanguages[siteSettings[0]]].checklist.infoDidntDeleteAll);
        }
    }
}
function AlterItemState (alteredIndex,cookiet,containert){
    if(cookiet=="dailyChecks"){
        if(dailyChecks[alteredIndex][1]==true){
            dailyChecks[alteredIndex][1]=false;
        }
        else {
            dailyChecks[alteredIndex][1]=true;
        }
        UpdateChecklistTimestamp (alteredIndex,cookiet);
        let dailyChecksJSON = JSON.stringify(dailyChecks);
        setCookie('dailyChecks',dailyChecksJSON,365);
    }
    if(cookiet=="weeklyChecks"){
        if(weeklyChecks[alteredIndex][1]==true){
            weeklyChecks[alteredIndex][1]=false;
        }
        else {
            weeklyChecks[alteredIndex][1]=true;
        }
        UpdateChecklistTimestamp (alteredIndex,cookiet);
        let weeklyChecksJSON = JSON.stringify(weeklyChecks);
        setCookie('weeklyChecks',weeklyChecksJSON,365);
    }

    createList(cookiet,containert);
}
function createList (cookietype,listtype,shorttype) {
    //clear input if added new one
    if(shorttype=='week'||shorttype=='day'){
        document.getElementById("itemText"+shorttype).value = "";
    }
    //assign cookie to variable
    let listCookie = getCookie(cookietype);
    let ChecklistCreation = [];
    let abbr= "";
    //check if list exists and parse if yes
    if(listCookie!=""&cookietype=="dailyChecks"){
        dailyChecks = JSON.parse(listCookie);
        ChecklistCreation = dailyChecks;
        abbr  = "d";
    } 
    else if(listCookie!=""&cookietype=="weeklyChecks"){
        weeklyChecks = JSON.parse(listCookie);
        ChecklistCreation = weeklyChecks;
        abbr  = "w";
    }
    //select container to edit and clear it
    let container = document.getElementById(listtype);
    container.innerHTML="";

    //simple variable to track index while creating
    let indexCheck = 0;
    //create list if cookie is not empty
    if(ChecklistCreation!=""){
        ChecklistCreation.forEach(element => {
            // create checkbox
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add('cb-List');
            if(element[1]==true){checkbox.checked = true;}
            // create label
            let label = document.createElement("label");
            const baton = document.createElement("button");
            baton.classList.add('removeButton');
            const baton2 = document.createElement("button");
            baton2.id= abbr + "editbtn" + indexCheck;
            const span = document.createElement("span");
            span.id = abbr + "taskName"+indexCheck;
            span.classList.add("sp-List");
            span.appendChild(document.createTextNode(" "+element[0]));
            label.appendChild(checkbox);
            label.appendChild(span);
            label.appendChild(baton);
            label.appendChild(baton2);
            baton.innerHTML="<i class='fa-solid fa-trash fa-1x'></i>";
            baton2.innerHTML="<i class='fa-solid fa-pencil fa-1x'></i>";
            container.appendChild(label);
            // clear input
            indexCheck++;
        });
        let buttons = container.querySelectorAll("button");
        let checkboxes = container.querySelectorAll("input");

        //add so that json saves the change to all checkboxes
        checkboxes.forEach((checkbox_, index) => {
            checkbox_.addEventListener("click", () => {
                AlterItemState(index,cookietype,listtype);
            });
        });

        //add so that you can delete
        buttons.forEach((btn, index) => {
            if(index % 2==0){
                btn.addEventListener("click", () => {
                    RemoveChecklistItem(cookietype,listtype,index/2);
                });
            }
            else{
                btn.addEventListener("click", () => {
                    EditChecklistItem(abbr,Math.floor(index/2),cookietype,listtype);
                });
            }
        });
    }
    else{
        container.innerHTML="";
    }
}