let setopen = false;
let clockrunning = false;
let savedtime = false;
let savedminutes = 0;
let savedseconds = 0;
let p1turn = true;
let minutes = 0;
let seconds = 0;
let timerID;
//COOKIE FUNCTIONS
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    // Set the expiration date based on the number of days provided.
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    // Construct the cookie string.
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    let score = getCookie('last');
    document.getElementById("lastGame").innerHTML= score;
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
//WHOLE SITE FUNCTIONS
function getLastGameFromCookie () {
    let cookey = getCookie('savedata');
    if(cookey != ""){
        let Tt = JSON.parse(getCookie('savedata'));
        if(Tt.score1>0||Tt.score2>0){
            document.getElementById("lastGameType").innerHTML= "LAST GAME: "+Tt.gameType+" (First to "+Tt.bestofset+")";
            document.getElementById("lastGame").innerHTML= Tt.player1+": "+Tt.score1+"<br/>"+Tt.player2+": "+Tt.score2;
        }
        else{
            document.getElementById("lastGame").innerHTML= "Here will be your last match";
        }
    }
    else{
        document.getElementById("lastGame").innerHTML= "Here will be your last match";
    }
}
//MENU FUNCTIONS
function loadingMain () {
    getLastGameFromCookie ();
}
function backToMenu () {
    document.getElementById("gameChoice").style.visibility= "visible"
    document.getElementById("poolMenu").style.visibility= "hidden"
    document.getElementById("dartsMenu").style.visibility= "hidden"
    document.getElementById("back").style.visibility= "hidden"
    document.getElementById("gameChoice").style.visibility= "visible"
}
function hideGameChoice () {
    document.getElementById('gameChoice').style.visibility= "hidden";
    document.getElementById('back').style.visibility= "visible";
}
function poolMenu () {
    hideGameChoice();
    document.getElementById("poolMenu").style.visibility= "visible"
}
function dartsMenu () {
    hideGameChoice();
    document.getElementById("dartsMenu").style.visibility= "visible"
}
//8BALL FUNCTIONS
function loading8ball () {
    let cookieValue = getCookie("savedata");
    if (cookieValue != "") {
        let boop = JSON.parse(cookieValue);
        console.log(boop);
        document.getElementById('player1name').innerText = boop.player1;
        document.getElementById('player2name').innerHTML = boop.player2;
        document.getElementById('actualClock').innerHTML= 2;
        document.getElementById('player1score').innerHTML=boop.score1;
        document.getElementById('player2score').innerHTML=boop.score2;
        document.getElementById('actualClock').innerHTML=boop.timersetting+":00";
        document.getElementById('howmanygames').innerHTML="Best of "+boop.bestofset+" ("+Math.ceil(boop.bestofset/2)+")";
    } else {
        // The cookie does not exist.
        document.getElementById('settings').style.visibility = "visible";
    }
    getLastGameFromCookie ();
}
function backToMenuFromGame () {
    saveGame();
    if(true){
        if (confirm("Are you sure you want to go back to menu? (progress will be saved)")){
            window.location.href = "index.html";
        }  
    }       
}
function saveGame(){
    //Get names, type of game and scores into variables
    let name1 = document.getElementById("player1name").innerText;
    let name2 = document.getElementById("player2name").innerText;
    let score1 = document.getElementById("player1score").innerText;
    let score2 = document.getElementById("player2score").innerText;
    let bestofset = document.getElementById('bestof').value;
    let gameType = "8 Ball";
    let scoreboard = name1+": "+score1+"<br/>"+name2+": "+score2;
    let timersetting = document.getElementById("timer").value;
    const savedata = {
        player1: name1.trim(),
        player2: name2.trim(),
        score1: score1.trim(),
        score2: score2. trim(),
        gameType: gameType,
        scoreboard: scoreboard,
        bestofset: bestofset,
        timersetting: timersetting
    };
    const jsonsavedata = JSON.stringify(savedata);
    setCookie('savedata',jsonsavedata,365);

    document.getElementById("lastGameType").innerHTML= savedata.gameType;
    document.getElementById("lastGame").innerHTML= savedata.scoreboard;
    console.log(getCookie('player1'));
} 
function settings8ball () {
    if (setopen){
        document.getElementById("settings").style.visibility="hidden";
        setopen=false;
    }
    else{
    document.getElementById("settings").style.visibility="visible";
    setopen = true;
    }
}
function saveSettingsToJSON () {
    let p1name = document.getElementById('player1').value;
    let p2name = document.getElementById('player2').value;
    let gametime = document.getElementById('timer').value;
    let clock = document.getElementById('gameclock').value;
    let length = document.getElementById('bestof').value/2+0.5;
    let p5name = document.getElementById('player2').value;
    let bestofset = document.getElementById('bestof').value;
    
    document.getElementById("settings").style.visibility="hidden"
    // 1. Create a JavaScript object with the current settings.
    const settings = {
        player1: p1name.trim(),
        player2: p2name.trim(),
        gametime: gametime.trim(),
        istimed: clock.trim(),
        bestofgoto: length,
        bestof: bestofset
    };
    // make a json and save it to cookie
    const jsonSettings = JSON.stringify(settings);
    setCookie('jsonSettings',jsonSettings,1000);
    //apply changes
    document.getElementById('player1name').innerHTML=p1name;
    document.getElementById('player2name').innerHTML=p2name;
    document.getElementById('howmanygames').innerHTML="Best of "+bestofset+" ("+Math.ceil(bestofset/2)+")";
    if(clock==1){
        document.getElementById('actualClock').innerHTML=gametime+":00";
        document.getElementById('gameclockoperator').style.visibility="visible";
    } 
    else {
        document.getElementById('actualClock').innerHTML="Not timed";
        document.getElementById('gameclockoperator').style.visibility="hidden";
    }
    saveGame()
    getLastGameFromCookie ()
}
function alterscore (typeOfOperation) {
    //get current score
    s1 = document.getElementById('player1score');
    s2 = document.getElementById('player2score');
    retrieveSave = JSON.parse(getCookie('jsonSettings'));
    max = retrieveSave.bestofgoto;
    //how to edit the score
    if (typeOfOperation==1){
        s1.innerHTML++;
        if(s1.innerHTML==max){
            alert("Player 1 won!");
            s1.innerHTML=0;
            s2.innerHTML=0;
        }
    }
    else if (typeOfOperation==2){
        if(s1.innerHTML>0)s1.innerHTML--;
    }
    else if (typeOfOperation==3){
        s2.innerHTML++;
        if(s2.innerHTML==max){
            alert("Player 2 won!");
            s1.innerHTML=0;
            s2.innerHTML=0;
        }
    }
    else if (typeOfOperation==4){
        if(s2.innerHTML>0)s2.innerHTML--;
    }
}
function gameClock8Ball() {
    // Set the duration of the countdown in seconds
    let fetchsettings = JSON.parse(getCookie('jsonSettings'));
    var timeInSeconds = fetchsettings.gametime*60; 
    var display = document.getElementById("actualClock");
    var button = document.getElementById("gameclockoperator");
    if(!clockrunning){
        timerID = setInterval(function() {
            button.textContent="STOP CLOCK";
            //checks if there was already a pause and gets time left from relevant source
            if(savedtime){
                timeInSeconds = savedminutes*60+savedseconds;
                savedtime = false; 
            }
            else{
            minutes = Math.floor(timeInSeconds / 60);
            seconds = timeInSeconds % 60;
            }

            clockrunning = true; // forces stopping the interval

            let secondzero = ""
            if(seconds<10)secondzero = "0";
            if(seconds>=10)secondzero = "";
            display.textContent = minutes + ":" + secondzero + seconds; //add zero if <10s
            
            // Decrease the time by one second
            timeInSeconds--;
            
            // When the countdown is finished, stop the timer
            if (timeInSeconds < 0) {
                clearInterval(timerID);
                display.textContent = "Time's Up!";
            }
        }, 1000);
    }
    else {
        button.textContent="RESUME";
        clearInterval(timerID); //stop of interval
        savedtime=true; // forces not using set time
        savedminutes = minutes;
        savedseconds = seconds;
        clockrunning=false;
    }
}