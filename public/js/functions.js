// Creates empty 2d array for state
function createState(){
  var state = [];
  for(var i = 0; i < cols; i++){
    state.push(createRow());
  }
  return state;
}

function showModified(){
  modifiedButton.classList.remove("updated");
  modifiedButton.firstElementChild.src = "img/modified.svg";
}

function hideModified(){
  if(!modifiedButton.classList.contains("updated")){
    modifiedButton.classList.add("updated");
    modifiedButton.firstElementChild.src = "img/check.svg";
  }
}

// Loads saved state from url
function loadState(){
  var path = location.pathname.substring(1);
  if(path == ""){
    return state;
  }

  hideModified();
  var expanded = expand(path);

  var newState = createState();
  var position = 0;

  for(var i = 0; i < newState.length; i++){
    for(var j = 0; j < newState[i].length; j++){
      newState[i][j] = parseInt(expanded[position]);
      position++;
    }
  }

  return newState;
}

function expand(text){
  var expanded = text.replace(/[abc]\d+/g, function(m) {
    var letter = m[0];
    var count = parseInt(m.substring(1));
    var result = "";
    for(var i = 0; i < count; i++){
      result += letter;
    }
    return result;
  });

  expanded = expanded.replace(/a/g, "0");
  expanded = expanded.replace(/b/g, "1");
  expanded = expanded.replace(/c/g, "2");
  return expanded;
}

// Returns an array of all zeros
function createRow(){
  var row = [];
  for(var i = 0; i < cols; i++){
    row.push(0);
  }
  return row;
}

// Returns a single continuous string representing the state
function stateString(){
  var result = "";
  for(var i = 0; i < state.length; i++){
    result += state[i].join('');
  }
  return result;
}

function compress(text) {
  text = text.replace(/0/g, "a");
  text = text.replace(/1/g, "b");
  text = text.replace(/2/g, "c");

  // Regex matches characters repeated more than 2 times
  text = text.replace(/(\w)\1{2,}/g, function(m) {
    return m[0] + m.length;
  });

  return text;
}

function loadSaved(){
  window.location = "/" + compressedState;
}

// Gets the mouse position relative to the canvas
// e: the event
function mousePosition(e) {
  var rect = canvas.getBoundingClientRect();
  var pos = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  return pos;
}

// Gets the block coordinates in columns and rows
// e: the event
function getBlock(e){
  var pos = mousePosition(e);
  return {
    col: Math.floor(getCol(pos.y)),
    row: Math.floor(getRow(pos.x))
  }
}

// Returns the column from y coordinate
function getCol(y){
  return y / dim;
}

// Returns the row from x coordinate
function getRow(x){
  return x / dim;
}

function redraw() {
  for(var i = 0; i < state.length; i++){
    for(var k = 0; k < state[i].length; k++){
      var blockState = state[i][k];
      var x = i * dim;
      var y = k * dim;
      switch (blockState) {
        case 1:
          ctx.fillStyle = black;
          ctx.rect(x, y, dim, dim);
          ctx.fill();
          break;
        case 2:
          ctx.fillStyle = color;
          ctx.rect(x, y, dim, dim);
          ctx.fill();
          break;
        default:
          ctx.fillStyle = white;
          ctx.rect(x, y, dim, dim);
          //ctx.clearRect(x, y, dim, dim);
          ctx.fill();
          break;
      }
      ctx.closePath();
      ctx.beginPath();
    }
  }
}

function toggleState(e){
  var pos = getBlock(e);
  toggleBlock(pos);
}

function toggleBlock(pos){
  showModified();

  lastPos = pos; // Saves as last position
  var blockState = state[pos.row][pos.col];
  switch (blockState) {
    case 1:
      state[pos.row][pos.col] = 2;
      break;
    case 2:
      state[pos.row][pos.col] = 0;
      break;
    default:
      state[pos.row][pos.col] = 1;
      break;
  }
}

function toggleMultiple(e){
  var pos = getBlock(e);
  toggleRow(pos, lastPos);
  toggleCol(pos, lastPos);
}

// Toggles blocks on the same row between shift clicks
function toggleRow(pos, lastPos){
  if(pos.col != lastPos.col){
    return;
  }
  var col = pos.col;
  if(pos.row > lastPos.row ){
    for(var i = lastPos.row + 1; i <= pos.row; i++){
      toggleBlock({row: i, col: col});
    }
  } else {
    for(var i = lastPos.row - 1; i >= pos.row ; i--){
      toggleBlock({row: i, col: col});
    }
  }
}

// Toggles blocks on the same col between shift clicks
function toggleCol(pos, lastPos){
  if(pos.row != lastPos.row){
    return;
  }
  var row = pos.row;
  if(pos.col > lastPos.col ){
    for(var i = lastPos.col + 1; i <= pos.col; i++){
      toggleBlock({row: row, col: i});
    }
  } else {
    for(var i = lastPos.col - 1; i >= pos.col ; i--){
      toggleBlock({row: row, col: i});
    }
  }
}

// Checks if the mouse is inside the canvas
function insideBoard(e){
  var pos = getBlock(e);
  var col = pos.col;
  var row = pos.row;
  return (col >= 0 && col <= 19) && (row >= 0 && row <= 19);
}

function drawHover(current){
  var x = current.row * dim;
  var y = current.col * dim;

  var lineWidth = 4;
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = "lightgray";
  //ctx.clearRect(0, 0, dim, dim);
  ctx.strokeRect(x + (lineWidth / 2), y + (lineWidth / 2), dim - lineWidth, dim - lineWidth);
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  hoverShowing = true;
}

function click(e){
  if(!insideBoard(e)){
    return;
  }
  if(e.shiftKey == true && lastPos != null){
    toggleMultiple(e);
  } else {
    toggleState(e);
  }
  redraw();
  compressedState = compress(stateString());
}

function hover(e){
  if(!insideBoard(e)){ // Outside canvas
    if(hoverShowing){
      redraw();
      hoverShowing = false;
      lastHover = null;
    }
    return;
  }

  var current = getBlock(e);
  if(lastHover == null){ // lastHover is null if cursor left the canvas
    drawHover(current);
    lastHover = current;
  }
  if(sameBlock(current, lastHover)){ // Cursor moved but didn't leave block
    lastHover = current;
    return;
  }
  redraw();
  drawHover(current);
  lastHover = current;
}

function sameBlock(current, last){
  return current.col == last.col && current.row == last.row;
}

// Redraws the canvas to prevent saving of the hover rectangle
function rightClick(){
  redraw();
}

function saveImage(){
  var a = document.createElement("a");  // Creates new hyperlink
  a.href = canvas.toDataURL();
  a.download = "withblocks-" + randomName() + ".png";
  a.click();
}
