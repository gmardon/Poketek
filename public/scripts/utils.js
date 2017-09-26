function loadJSON(url, onsuccess) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if ((request.readyState == 4) && (request.status == 200)) // if DONE and SUCCESS
        onsuccess(JSON.parse(request.responseText));
    }
    request.open("GET", url + ".json", true);
    request.send();
  }

function loadAssets(names, callback) {
    var n,name,
        result = {},
        count  = names.length,
        onload = function() { if (--count == 0) callback(result); };

    for(n = 0 ; n < names.length ; n++) {
        name = names[n];
        result[name] = document.createElement('img');
        result[name].addEventListener('load', onload);
        result[name].src = "assets/" + name + ".png";
    }
}

window.requestAnimFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
  }();