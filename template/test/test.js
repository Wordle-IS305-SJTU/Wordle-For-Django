var model = document.getElementById('model');
var btn = document.getElementById('btn');
var closebtn = document.getElementById('closebtn');
closebtn.onclick = function() {
    model.style.display = "none";
}
btn.onclick = function (){
    model.style.display = "block";
}

var startBtn = document.getElementById('startBtn');
startBtn.onclick = function() {
    startBtn.style.display = "none";
}