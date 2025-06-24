const canvas = document.querySelector("#canvas");
const displayNumber = 1973;
const ctx = canvas.getContext("2d");
function drawBgCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#C0C0C0";
    ctx.fill();
}
// Draw help circles
for(let i = 0; i < 9; i++){
    const x = canvas.clientWidth / 3 * (i % 3) + 50;
    const y = canvas.clientHeight / 3 * Math.floor(i / 3) + 50;
    drawBgCircle(x, y);
}

//# sourceMappingURL=number-glyph.816e7b21.js.map
