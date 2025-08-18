let menustate = false;
function menuOperate () {
    let hamburgerDiv = document.getElementById("menu");
    if(menustate){
        hamburgerDiv.style.left="calc(-250px)";
        menustate = false;
    }
    else {
       hamburgerDiv.style.left="0"; 
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
}