let menustate = false;
function menuOperate () {
    let hamburgerDiv = document.getElementById("menu");
    if(menustate){
        hamburgerDiv.style.animation="leftMenuOutAnim 0.2s reverse 1";
        setTimeout(() => {
                    hamburgerDiv.style.animation="";
                }, 205);
        hamburgerDiv.style.left="calc(-300px)";
        
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
    if(sitenumber=='cad'){
    window.location.href = "cueanddart/";
    }
    else if(sitenumber=='cadinfo'){
        window.open("https://www.google.pl", "_blank");
    }
    else if(sitenumber=='chpk'){
        window.location.href = "checkpack/";
    }
    else if(sitenumber=='chpkinfo'){
        window.open("https://www.google.pl", "_blank");
    }
    else if(sitenumber=='aicad'){
        window.location.href = "cueanddartAI/";
    }
    else if(sitenumber=='aicadinfo'){
        window.open("https://www.google.pl", "_blank");
    }
}