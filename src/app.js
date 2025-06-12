import { Glyph } from "./glyph";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const numbersToDraw = [1474, 1951, 1919];

for (let i = 0; i < numbersToDraw.length; i++) {
  const numberGlyph = new Glyph(
    ctx,
    canvas.clientHeight,
    200,
    { x: 200 * i, y: 0 },
    {
      displayHelpCircles: true,
    }
  );

  numberGlyph.number = numbersToDraw[i];
  numberGlyph.draw();

  // setInterval(() => {
  //   numberGlyph.number = Math.floor(Math.random() * 10000);
  //   numberGlyph.draw();
  // }, 100);
}
