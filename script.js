const canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const ctx = canvas.getContext("2d");
ctx.lineWidth = 5;

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

const colorPicker = document.getElementById("colorpicker");
const rangeSelector = document.getElementById("range");
const rangePicker = document.getElementById("rangepicker");
const rangeNum = document.getElementById("range-num");
const rangeInner = document.querySelector("#range .inner");
const popover = rangePicker.parentNode;
const defaultColors = ["#f54242", "#f5d442", "#03bb56", "#0f65d4", "#e28743"];
const colors = document.createElement("div");
const setColor = (e) => {
  const c = e.currentTarget.dataset.color;
  ctx.strokeStyle = c;
  rangeInner.style.backgroundColor = c;
  colorPicker.value = c;
};
colors.className = "default-colors";
defaultColors.forEach((color) => {
  const colorNode = document.createElement("span");
  colorNode.style.backgroundColor = color;
  colorNode.setAttribute("data-color", color);
  colorNode.classList.add("default-color");
  colorNode.addEventListener("click", setColor);
  colors.appendChild(colorNode);
});
popover.appendChild(colors);
colorPicker.addEventListener("input", (e) => {
  rangeInner.style.backgroundColor = e.target.value;
});
colorPicker.addEventListener("change", (e) => {
  ctx.strokeStyle = e.target.value;
});
rangeSelector.addEventListener("click", () => {
  const cb = (e) => {
    if (
      ![
        ...popover.childNodes,
        ...colors.childNodes,
        rangeSelector,
        rangeInner,
      ].includes(e.target)
    ) {
      popover.style.display = "none";
      time = 0;
      document.removeEventListener("pointerdown", cb);
    }
  };
  popover.style.display = "grid";
  document.addEventListener("pointerdown", cb);
});
rangePicker.addEventListener("input", (e) => {
  rangeNum.textContent = e.target.value;
  rangeInner.style.width = `${e.target.value * 10}%`;
  rangeInner.style.height = `${e.target.value * 10}%`;
  ctx.lineWidth = Number(e.target.value);
});

let prevX, prevY, isDrawing;

canvas.addEventListener("pointerdown", () => {
  isDrawing = true;
});
canvas.addEventListener("pointerup", () => {
  isDrawing = false;
});

canvas.addEventListener("pointermove", (e) => {
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
