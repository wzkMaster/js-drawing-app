const canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const ctx = canvas.getContext("2d");
ctx.lineWidth = 5;

// Selecting all the div that has a class of clr
let clrs = document.querySelectorAll(".clr");
// Converting NodeList to Array
clrs = Array.from(clrs);

clrs.forEach((clr) => {
  clr.addEventListener("click", () => {
    ctx.strokeStyle = clr.dataset.clr;
  });
});

let clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", () => {
  // Clearning the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
// Saving drawing as image
let saveBtn = document.querySelector(".save");
saveBtn.addEventListener("click", () => {
  let data = canvas.toDataURL("imag/png");
  let a = document.createElement("a");
  a.href = data;
  // what ever name you specify here
  // the image will be saved as that name
  a.download = "sketch.png";
  a.click();
});

let prevX, prevY, isDrawing;

window.addEventListener("mousedown", () => {
  isDrawing = true;
});
window.addEventListener("mouseup", () => {
  isDrawing = false;
});

window.addEventListener("mousemove", (e) => {
  // initially previous mouse positions are null
  // so we can't draw a line
  if (prevX == null || prevY == null || !isDrawing) {
    // Set the previous mouse positions to the current mouse positions
    prevX = e.clientX;
    prevY = e.clientY;
    return;
  }

  // Current mouse position
  let currentX = e.clientX;
  let currentY = e.clientY;

  // Drawing a line from the previous mouse position to the current mouse position
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();

  // Update previous mouse position
  prevX = currentX;
  prevY = currentY;
});
