var model = document.getElementById('myModel');
var rulebtn = document.getElementById('rule');
var closebtn = document.getElementById('close');
rulebtn.onclick = function () {
    model.style.display = "block";
}
closebtn.onclick = function() {
    model.style.display = "none";
}
