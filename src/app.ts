import { Glyph } from "./glyph";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const numberInput = document.querySelector("#number-input") as HTMLInputElement;

if (ctx) {
  const numberGlyph = new Glyph(
    ctx,
    canvas.clientHeight,
    canvas.clientWidth,
    { x: 0, y: 0 },
    {
      displayHelpCircles: true,
    }
  );

  numberInput.addEventListener("input", (e: Event) => {
    numberInput.value = e.target.value.replace(/[^0-9]/g, "");
  });

  numberInput.addEventListener("change", (e: Event) => {
    numberGlyph.number = e.target.value.replace(/[^0-9]/g, "");
    numberGlyph.draw();
  });
}
