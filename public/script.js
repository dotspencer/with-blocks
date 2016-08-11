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

if(window.location.href.indexOf("?state=") != -1){
  console.log("loading from url.");
  $("#update").text("Updated");
  $("#update").addClass("current");
  var decompressed = decompress(window.location.href.split("=")[1]);
  console.log(decompressed);
  var urlState = decompressed.split("");

  for(var i = 0; i < urlState.length; i++){
    state[i] = urlState[i]
    switch(urlState[i]){
      case "0":
        continue;
        break;
      case "1":
        toggle($boxes.eq(i));
        break;
      case "2":
        toggle($boxes.eq(i));
        toggle($boxes.eq(i));
        break;
      default:
        break;
    }
  }
} else {
  $('#update').addClass("hidden");
}

$boxes.mousedown(function(e){
    toggle($(this));
    updateLink();
});

function toggle($el){
  var index = getIndex($el);
  if($el.hasClass("black")){
    $el.removeClass("black");
    $el.addClass("color");
    state[index] = "2";
  } else if($el.hasClass("color")){
    $el.removeClass("color");
    state[index] = "0";
  } else {
    $el.addClass("black");
    state[index] = "1";
  }
}

function getIndex($el){
  return $el.index() + ($el.parent().index() * 20);
}

function updateLink(){
  var compressed = compress(state.join(""));
  var link = "?state=" + compressed;
  $("#update").attr("href", link);
  $("#update").removeClass("current hidden");
  $("#update").text("Update");
}

function compress(string){
  string = string.replace(/(0{5,})/g, function(match){
    return "z(" + match.length + ")";
  });
  string = string.replace(/(1{5,})/g, function(match){
    return "o(" + match.length + ")";
  });
  string = string.replace(/(2{5,})/g, function(match){
    return "t(" + match.length + ")";
  });
  return string;
}

function decompress(string){
  string = string.replace(/z\(([0-9]*)\)/g, function(match){
    var occ = parseInt(match.substring(2, match.length - 1));
    var result = "";
    for(var i = 0; i < occ; i++){
      result += "0";
    }
    return result;
  });
  string = string.replace(/o\(([0-9]*)\)/g, function(match){
    var occ = parseInt(match.substring(2, match.length - 1));
    var result = "";
    for(var i = 0; i < occ; i++){
      result += "1";
    }
    return result;
  });
  string = string.replace(/t\(([0-9]*)\)/g, function(match){
    var occ = parseInt(match.substring(2, match.length - 1));
    var result = "";
    for(var i = 0; i < occ; i++){
      result += "2";
    }
    return result;
  });
  return string;
}
