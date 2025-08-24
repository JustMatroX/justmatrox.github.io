let menustate = false;
function menuOperate () {
    let hamburgerDiv = document.getElementById("menu");
    if(menustate){
        hamburgerDiv.style.animation="leftMenuOutAnim 0.2s reverse 1";
        setTimeout(() => {
                    hamburgerDiv.style.animation="";
                }, 205);
        hamburgerDiv.style.left="calc(-250px)";
        
        menustate = false;
    }
    else {
        hamburgerDiv.style.animation="leftMenuOutAnim 0.2s 1";
        hamburgerDiv.style.left="0";
        setTimeout(() => {
                    hamburgerDiv.style.animation="";
                }, 205);
        menustate = true;
    }
}
function openProject(sitenumber) {
    if(sitenumber==1){
    window.location.href = "cueanddart/";
    }
    else if(sitenumber==2){
        window.open("https://www.google.pl", "_blank");
    }
    else if(sitenumber==3){
        window.location.href = "cueanddartAI/";
    }
}