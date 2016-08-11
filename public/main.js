var $boxes = $('.row div');
var $lastclick;

// Array of string values, state of the artboard
// 0 -- transparent
// 1 -- black
// 2 -- color
var state = [];
for(var i = 0; i < 400; i++){
  state.push("0");
}

if(getURLParameter("state") == null){
  $('#update').addClass("hidden");
} else {
  loadState();
}

$boxes.mousedown(function(e){
    toggle($(this));
    updateLink();
});
