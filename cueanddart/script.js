let setopen = false;
let clockrunning = false;
let savedtime = false;
let savedminutes = 0;
let savedseconds = 0;
let p1turn = true;
let minutes = 0;
let seconds = 0;
let timerID;
let turnofwho = 0;
let didswitchturnoccur = false;
let wasextused = false;
let timeForShot = 30;
let timePlayer = timeForShot;
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
function getLastGameFromCookie (restriction) {

    let cookey = getCookie('savedata');
    if(cookey != ""&restriction!=2){
        let Tt = JSON.parse(getCookie('savedata'));
        if(Tt.score1>0||Tt.score2>0){
            document.getElementById("lastGameType").innerHTML= `<a href="${Tt.gameTypeLink}">LAST GAME: ${Tt.gameType} (First to ${Tt.bestofset})</a>`;
            document.getElementById("lastGame").innerHTML= `<a href="${Tt.gameTypeLink}">${Tt.player1}: ${Tt.score1}&nbsp;|&nbsp;${Tt.player2}: ${Tt.score2}</a>`;
        }
        else{
            document.getElementById("lastGame").innerHTML= "No last game found";
        }
    }
    else if(restriction==2){
        document.getElementById("lastGame").innerHTML= "Save will appear here after you quit";
    }
    else{
        document.getElementById("lastGame").innerHTML= "No last game found";
    }
}
//MENU FUNCTIONS
function loadingMain () {
    getLastGameFromCookie ();
}
function backToMenu () {
    
    document.getElementById("poolMenu").style.visibility= "hidden"
    document.getElementById("dartsMenu").style.visibility= "hidden"
    document.getElementById("back").style.visibility= "hidden"
    document.getElementById('gameChoice').style.animation = "mainMenuInTiles 0.4s reverse";
    document.getElementById("gameChoice").style.visibility= "visible"
    setTimeout(() => {
            document.getElementById('gameChoice').style.animation = "";
        }, 400);
    
}
function hideGameChoice () {
    document.getElementById('gameChoice').style.animation = "mainMenuOutTiles 0.4s normal";
    setTimeout(() => {
            document.getElementById('gameChoice').style.visibility= "hidden";
            document.getElementById('back').style.visibility= "visible";
            document.getElementById('gameChoice').style.animation = "";
        }, 300);
}
function poolMenu () {
    hideGameChoice();
    setTimeout(() => {
            document.getElementById("poolMenu").style.visibility= "visible"
        }, 300);
}
function dartsMenu () {
    hideGameChoice();
    setTimeout(() => {
            document.getElementById("dartsMenu").style.visibility= "visible"
        }, 300);
}
function openinfo ()  {
    let temp = document.getElementById("infoMenu");
    console.log (temp.style.display);
    if(temp.style.display=="none"||temp.style.display==""){
        console.log (temp.style.display);
        temp.style.display="block";
    }
    else {
        temp.style.display="none";
    }
}
//8BALL FUNCTIONS
function loading8ball () {    
    getLastGameFromCookie (2);
    switchplayer(1);
    let cookieValue = getCookie("savedata");
    if (cookieValue != "") {
        let boop = JSON.parse(cookieValue);
        //GAME ITEMS
        timeForShot = boop.timepershot;
        document.getElementById('player1name').innerText = boop.player1;
        document.getElementById('player2name').innerHTML = boop.player2;
        document.getElementById('player1score').innerHTML=boop.score1;
        document.getElementById('player2score').innerHTML=boop.score2;
        if(boop.timerOn==0){
            document.getElementById('actualClock').innerHTML=boop.timersetting+":00";
            document.getElementById('gameclockoperator').style.visibility="visible";
            document.getElementById('controllers').style.visibility="visible";
        } 
        else {
            document.getElementById('actualClock').innerHTML="--:--";
            document.getElementById('gameclockoperator').style.visibility="hidden";
            document.getElementById('controllers').style.visibility="hidden";
            document.getElementById('p1active').classList.remove("playingRN");
            document.getElementById('p2active').classList.remove("playingRN");
        }
        document.getElementById('howmanygames').innerHTML="Best of "+boop.bestofset+" ("+Math.ceil(boop.bestofset/2)+")";
        //SETTINGS
        document.getElementById('player1').value=boop.player1;
        document.getElementById('player2').value=boop.player2;
        document.getElementById('timer').value=boop.timersetting;
        document.getElementById('gameclock').selectedIndex=boop.timerOn;
        document.getElementById('bestof').value=boop.bestofset;
        document.getElementById('timeshot').value=boop.timepershot;
        
    } else {
        // The cookie does not exist.
        document.getElementById('settings').style.visibility = "visible";
    }
}
function backToMenuFromPoolGame () {
    saveGame();
    window.location.href = "index.html";  
}
function backToMenuFromSnooker () {
    window.location.href = "index.html"; 
}
function backToMenuFromDartsGame () {
    window.location.href = "index.html";       
}
function saveGame(){
    //Get names, type of game and scores into variables
    let name1 = document.getElementById("player1name").innerText;
    let name2 = document.getElementById("player2name").innerText;
    let score1 = document.getElementById("player1score").innerText;
    let score2 = document.getElementById("player2score").innerText;
    let bestofset = document.getElementById('bestof').value;
    let gameType = "8 Ball";
    let gameTypeLink = "8ball.html";
    let scoreboard = name1+": "+score1+"<br/>"+name2+": "+score2;
    let timersetting = document.getElementById("timer").value;
    let timerOn = document.getElementById("gameclock").selectedIndex;
    let timepershot = document.getElementById('timeshot').value;
    const savedata = {
        player1: name1.trim(),
        player2: name2.trim(),
        score1: score1.trim(),
        score2: score2.trim(),
        gameType: gameType,
        gameTypeLink: gameTypeLink,
        scoreboard: scoreboard,
        bestofset: bestofset,
        timersetting: timersetting,
        timerOn: timerOn,
        timepershot: timepershot
    };
    const jsonsavedata = JSON.stringify(savedata);
    setCookie('savedata',jsonsavedata,365);
    document.getElementById("lastGameType").innerHTML= savedata.gameType;
    document.getElementById("lastGame").innerHTML= savedata.scoreboard;
} 
function settings8ball () {
    if (setopen){
        document.getElementById("settings").style.visibility="hidden";
        document.getElementById("timechoicevis").style.visibility="hidden";
        setopen=false;
    }
    else{
    document.getElementById("settings").style.visibility="visible";
    setopen = true;
    poolCheckIfTimeSetting();
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
    let timepershot = document.getElementById('timeshot').value;
    
    document.getElementById("settings").style.visibility="hidden"
    // 1. Create a JavaScript object with the current settings.
    const settings = {
        player1: p1name.trim(),
        player2: p2name.trim(),
        gametime: gametime.trim(),
        istimed: clock.trim(),
        bestofgoto: length,
        bestof: bestofset.trim(),
        timepershot: timepershot.trim()
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
        document.getElementById('actualClock').innerHTML="--:--";
        document.getElementById('gameclockoperator').style.visibility="hidden";
    }
    saveGame();
    settings8ball ();
    loading8ball ();
    getLastGameFromCookie (2);
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
        if(clockrunning){gameClock8Ball()};
        if(s1.innerHTML>=max){
            alert("Player 1 won!");
            s1.innerHTML=0;
            s2.innerHTML=0;
        }
    }
    else if (typeOfOperation==2){
        if(s1.innerHTML>0)s1.innerHTML--;
    }
    else if (typeOfOperation==3){
        if(clockrunning){gameClock8Ball()};
        s2.innerHTML++;
        if(s2.innerHTML>=max){
            alert("Player 2 won!");
            s1.innerHTML=0;
            s2.innerHTML=0;
        }
    }
    else if (typeOfOperation==4){
        if(s2.innerHTML>0)s2.innerHTML--;
    }
    //save game
    saveGame();
}
function gameClock8Ball() {
    // Set the duration of the countdown in seconds
    let fetchsettings = JSON.parse(getCookie('jsonSettings'));
    var timeInSeconds = fetchsettings.gametime*60; 
    var display = document.getElementById("actualClock");
    var button = document.getElementById("gameclockoperator");
    var timer1 = document.getElementById("p1timer");
    var timer2 = document.getElementById("p2timer");
    if(!clockrunning){
        button.innerHTML="<i class='fa-solid fa-pause fa-1x'>&nbsp;</i>STOP CLOCK";
        button.style.backgroundColor="#110000";
        
        timerID = setInterval(function() {
            button.innerHTML="<i class='fa-solid fa-pause fa-1x'>&nbsp;</i>STOP CLOCK";
            button.style.backgroundColor="#110000";
            //checks if there was already a pause and gets time left from relevant source
            if(savedtime){
                timeInSeconds = savedminutes*60+savedseconds;
                savedtime = false; 
            }
            else{
            minutes = Math.floor(timeInSeconds / 60);
            seconds = timeInSeconds % 60;
            if(turnofwho==1){
                if(didswitchturnoccur){
                    timePlayer=timeForShot;
                    didswitchturnoccur=false;
                }
                else{
                    timePlayer--;
                    if(timePlayer==0){switchplayer(3);}
                }
                timer1.innerHTML=timePlayer;
                timer2.innerHTML="";
            }
            else{
                
                if(didswitchturnoccur){
                    timePlayer=timeForShot;
                    didswitchturnoccur=false;
                }
                else{
                    timePlayer--;
                    if(timePlayer==0){switchplayer(3);}
                }
                timer2.innerHTML=timePlayer;
                timer1.innerHTML="";
            }
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
                savedtime=false;
                display.textContent = "Time's Up!";
            }
        }, 1000);
    }
    else {
        button.innerHTML="<i class='fa-solid fa-play fa-1x'>&nbsp;</i>RESUME";
        button.style.backgroundColor="#222200";
        clearInterval(timerID); //stop of interval
        savedtime=true; // forces not using set time
        savedminutes = minutes;
        savedseconds = seconds;
        clockrunning=false;
    }
}
function reset8ballGame() {
    clearInterval(timerID);
    savedtime=false;
    document.getElementById('player1score').innerText=0;
    document.getElementById('player2score').innerText=0;
    saveSettingsToJSON();
    switchplayer(4);
}
function poolCheckIfTimeSetting() {
    if(document.getElementById("gameclock").value==1){
        document.getElementById("timechoicevis").style.visibility="visible";
    } else {
        document.getElementById("timechoicevis").style.visibility="hidden";
    }
}
function switchplayer(param) {
    let insp1s = document.getElementById('player1score').innerText;
    let insp2s = document.getElementById('player2score').innerText;
    let bothps = Math.floor(insp1s)+Math.floor(insp2s);
    let p1a = document.getElementById('p1active');
    let p2a = document.getElementById('p2active');
    let timerek = document.getElementById('gameclock').selectedIndex;
    var timer1 = document.getElementById("p1timer");
    var timer2 = document.getElementById("p2timer");
    if(param==1&timerek==0){
        if(bothps%2==0){
            p2a.classList.remove("playingRN");
            p1a.classList.add("playingRN");
            turnofwho = 1;
            didswitchturnoccur = true;
        } else {
            p1a.classList.remove("playingRN");
            p2a.classList.add("playingRN");
            turnofwho = 2;
            didswitchturnoccur = true;
        }
    }
    else if(param==2){
        timePlayer=Math.ceil(timeForShot)+1;
    }
    else if(param==3){
        if(turnofwho==1){
            turnofwho=2;
            didswitchturnoccur = true;
            p1a.classList.remove("playingRN");
            p2a.classList.add("playingRN"); 
            if(clockrunning == false){gameClock8Ball()}
        }
        else {
            p2a.classList.remove("playingRN");
            p1a.classList.add("playingRN");
            turnofwho=1;
            didswitchturnoccur = true;
        }
        wasextused=false;
        document.getElementById('extension').style.opacity= "1";
    }
    else if(param==4){
        timer1.innerHTML="";
        timer2.innerHTML="";
        if(bothps%2==0){
            p2a.classList.remove("playingRN");
            p1a.classList.add("playingRN");
            turnofwho = 1;
            didswitchturnoccur = true;
        } else {
            p1a.classList.remove("playingRN");
            p2a.classList.add("playingRN");
            turnofwho = 2;
            didswitchturnoccur = true;
        }

    }
}
function extension () {
    if(wasextused){

    }else{
        document.getElementById('extension').style.opacity= "0.1";
        wasextused=true;
        timePlayer+=30;
    }
}
//SNOOKER FUNCTIONS
let activeplayer = 2;
let redNum = 15;
let fouled = false;
function loadingsnooker() {
    getLastGameFromCookie (2);
    addsnookerpoints(0);
}
function addsnookerpoints(points) {
    let p1 = document.getElementById('snp1score');
    let p2 = document.getElementById('snp2score');
    if(points==1){
        if(redNum==0){redNum=15;}
        redNum--;
        document.getElementById("red").innerHTML="1 ("+redNum+")";
    }
    if(points!=0){
        if(fouled==true){
            if(activeplayer==1){
                let temp = Math.ceil(p1.innerHTML);
                temp+=points;
                p1.innerHTML=temp;
            }
            else if(activeplayer==2) {
                let temp = Math.ceil(p2.innerHTML);
                temp+=points;
                p2.innerHTML=temp;
            }
        }
        else {
            if(activeplayer==1){
                let temp = Math.ceil(p1.innerHTML);
                temp+=points;
                p1.innerHTML=temp;
            }
            else if(activeplayer==2) {
                let temp = Math.ceil(p2.innerHTML);
                temp+=points;
                p2.innerHTML=temp;
            }
        }
    }
    else {
        playerswitchsnooker();
    }
}
function playerswitchsnooker() {
    if (activeplayer==1) {
            activeplayer=2;
            document.getElementById('snp2name').style.borderBottom="10px solid white";
            document.getElementById('snp1name').style.borderBottom="10px solid var(--second-color-dark)";
        } else {
            activeplayer=1;
            document.getElementById('snp1name').style.borderBottom="10px solid white";
            document.getElementById('snp2name').style.borderBottom="10px solid var(--second-color-dark)";
        }
}
//DARTS FUNCTIONS
let p1score = 0;
let p2score = 0;
let throworder = 0;
let ismulti2active = false;
let ismulti3active = false;
let memoryp1 = 0;
let memoryp2 = 0;
const dartNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 50];
function loadingDarts () {
    getLastGameFromCookie ();
}
function pointadd (val) {
    p1 = document.getElementById("p1score");
    p2 = document.getElementById("p2score");
    if(throworder<3){
        if(throworder==0){memoryp1=Math.floor(p1.innerText)}
        p1score = Math.floor(p1.innerText)-val;
        if (p1score<0) {
            p1.innerHTML= memoryp1;
            throworder=2;
        } else {
            p1.innerHTML= p1score;
        }   
        throworder++;
        if(throworder==3){memoryp2=Math.floor(p2.innerText)}
    } else {
        p2score = Math.floor(p2.innerText)-val;
        if (p2score<0) {
            p2.innerHTML= memoryp2;
            throworder=5;
        } else {
            p2.innerHTML= p2score;
        }
        throworder++;
        if(throworder==6){
            throworder=0;
        }
    }

}
function settingsDarts () {

}
function pointChange (mult) {
    if(mult==1){
    document.getElementById("points").innerHTML = 
        Array.from({length: 21}, (_, i) => 
            `<div id="dart${i+1}" class="dartnumber multiplier-1" onclick="pointadd(${dartNumbers[i]*mult})">${dartNumbers[i]}</div>`
        ).join('');
    }
    else if(mult==2){
    document.getElementById("points").innerHTML = 
        Array.from({length: 21}, (_, i) => 
            `<div id="dart${i+1}" class="dartnumber multiplier-1" onclick="pointadd(${dartNumbers[i]*mult})">${dartNumbers[i]}<h5 class="text-info">${dartNumbers[i]*mult}</h5></div>`
        ).join('');
    }
    else if(mult==3){
        document.getElementById("points").innerHTML = 
        Array.from({length: 20}, (_, i) => 
            `<div id="dart${i+1}" class="dartnumber multiplier-1" onclick="pointadd(${dartNumbers[i]*mult})">${dartNumbers[i]}<h5 class="text-info">${dartNumbers[i]*mult}</h5></div>`
        ).join('');
    }
}
function multiactive (multiplier) {
    let x2=document.getElementById("x2multi");
    let x3=document.getElementById("x3multi");
    if(ismulti2active==false&ismulti3active==false){
        if(multiplier==2){
            x2.classList.replace("multiOFF","multiON");
            pointChange(2);
            ismulti2active=true;
        } else if (multiplier==3){
            x3.classList.replace("multiOFF","multiON");
            pointChange(3);
            ismulti3active=true;
        }
        
    }
    else if(ismulti2active==true){
        if(multiplier==2){
            x2.classList.replace("multiON","multiOFF");
            pointChange(1);
            ismulti2active=false;
        } else if (multiplier==3){
            x2.classList.replace("multiON","multiOFF");
            setTimeout(() => {
                x3.classList.replace("multiOFF","multiON");
            }, 10);
            pointChange(3);
            ismulti2active=false;
            ismulti3active=true;
        }
    }
    else if(ismulti3active==true){
        if(multiplier==3){
            x3.classList.replace("multiON","multiOFF");
            pointChange(1);
            ismulti3active=false;
        } else if (multiplier==2){
            x3.classList.replace("multiON","multiOFF");
            pointChange(2);
            ismulti3active=false;
            x2.classList.replace("multiOFF","multiON");
            ismulti2active=true;
        }
    }
}