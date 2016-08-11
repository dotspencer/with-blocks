function updateLink(){
  var $button = $("#update");
  var compressed = compress(state.join(""));
  var link = "?state=" + compressed;
  $button.attr("href", link);
  $button.removeClass("current hidden");
  $button.text("Update");
}

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

function loadState(){
  // console.log("loading from url.");
  $("#update").text("Updated");
  $("#update").addClass("current");
  var decompressed = decompress(getURLParameter("state"));
  // console.log(decompressed);
  var urlState = decompressed.split("");
  for(var i = 0; i < urlState.length; i++){
    state[i] = urlState[i];
    switch(urlState[i]){
      case "0":
        continue;
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
}

function getIndex($el){
  return $el.index() + ($el.parent().index() * 20);
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}