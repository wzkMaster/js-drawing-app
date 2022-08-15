// 初始化canvas
const canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const ctx = canvas.getContext("2d");
ctx.lineWidth = 5;

const history = [];
// 清除按钮
const clearBtn = document.querySelector(".clear");
clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
// 保存按钮
const saveBtn = document.querySelector(".save");
saveBtn.addEventListener("click", () => {
  const data = canvas.toDataURL("imag/png");
  const a = document.createElement("a");
  a.href = data;
  a.download = "草图.png";
  a.click();
});
// 撤销按钮
const undoBtn = document.querySelector(".undo");
undoBtn.addEventListener("click", () => {
  console.log(history);
  const data = history.pop();
  if (data) {
    ctx.putImageData(data, 0, 0);
  }
});
// 笔刷相关功能
const colorPicker = document.getElementById("colorpicker");
const rangeSelector = document.getElementById("range");
const rangePicker = document.getElementById("rangepicker");
const rangeNum = document.getElementById("range-num");
const rangeInner = document.querySelector("#range .inner");
const popover = rangePicker.parentNode;
// 颜色设置
const defaultColors = ["#f54242", "#f5d442", "#03bb56", "#0f65d4", "#e28743"];
const colors = document.createElement("div");
colors.className = "default-colors";
const setColor = (e) => {
  const c = e.currentTarget.dataset.color;
  ctx.strokeStyle = c;
  rangeInner.style.backgroundColor = c;
  colorPicker.value = c;
};
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
// 点击其他地方，弹窗自动关闭
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
// 画布
let prevX, prevY, isDrawing;
const stop = () => {
  prevX = null;
  prevY = null;
  isDrawing = false;
};
const start = () => {
  history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  isDrawing = true;
};
const move = (e) => {
  if (prevX == null || prevY == null || !isDrawing) {
    prevX = e.clientX;
    prevY = e.clientY;
    return;
  }

  let currentX = e.clientX;
  let currentY = e.clientY;

  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();

  prevX = currentX;
  prevY = currentY;
};
canvas.addEventListener("pointerdown", start);
canvas.addEventListener("pointermove", move);
canvas.addEventListener("pointerup", stop);
