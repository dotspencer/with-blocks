var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext('2d');

var modifiedButton = document.getElementById('modified');
var downloadButton = document.getElementById('download');

var width = 600;            // Width of board
var cols = 20;              // Number of columns (and rows)
var dim = width / cols;     // Dimension of square

var black = "#333";
var color = "crimson";
var white = "whitesmoke";

var state = createState();  // Creates empty state[][] of board
var state = loadState();  // Creates empty state[][] of board
var compressedState = "";
var lastPos;                // Last block position clicked
var lastHover;              // Last position hovered. Only redraws if hover position changes.
var hoverShowing;

redraw();     // Initial drawing of board

canvas.onclick = click;
canvas.oncontextmenu = rightClick;
document.onmousemove = hover;

downloadButton.addEventListener("click", saveImage);
modifiedButton.addEventListener("click", loadSaved);
