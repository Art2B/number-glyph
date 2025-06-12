import {
  generateArrayWithDifferentAdjacentDigits,
  getConsecutiveNumbers,
  isSameDirection,
  lerp,
  splitNumberIntoDigits,
} from "./helpers";

const displayNumber = 1478;

const canvas = document.querySelector("#canvas");
document.querySelector("#title").innerHTML += ` ${displayNumber}`;

const blockHeight = Math.floor(canvas.clientHeight / 3);
const blockWidth = Math.floor(canvas.clientWidth / 3);

const ctx = canvas.getContext("2d");

function drawBgCircle(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(191, 191, 191, 0.1)";
  ctx.fill();
}

function getNumberCoordinate(num) {
  const yIndex = lerp(num, 1, 9, 8, 0);

  return {
    x: blockWidth * ((num - 1) % 3) + blockWidth / 2,
    y: blockHeight * Math.floor(yIndex / 3) + blockHeight / 2,
  };
}

function getNumberDirection(digit, prevDigit) {
  const coord = getNumberCoordinate(digit);
  const prevCoord = getNumberCoordinate(prevDigit);

  return {
    x: Math.sign(prevCoord.x - coord.x),
    y: Math.sign(prevCoord.y - coord.y),
  };
}

function getPerpendicularDirection(direction) {
  // If x and y are both 0, there's no unique perpendicular direction
  if (direction.x === 0 && direction.y === 0) {
    throw new Error("Input direction cannot be (0, 0)");
  }

  // Perpendicular direction to (x, y) is (-y, x)
  return { x: -direction.y, y: direction.x };
}

function getStartCircleCoordinates(firstCoord, secondCoord) {
  return {
    x: firstCoord.x + Math.sign(firstCoord.x - secondCoord.x) * 10,
    y: firstCoord.y + Math.sign(firstCoord.y - secondCoord.y) * 10,
  };
}

// Draw help circles
for (let i = 0; i < 9; i++) {
  const x = blockWidth * (i % 3) + blockWidth / 2;
  const y = blockHeight * Math.floor(i / 3) + blockHeight / 2;

  drawBgCircle(x, y);
}

const digitsArray = splitNumberIntoDigits(displayNumber);
const digitsCoordinates = digitsArray.map((el) => getNumberCoordinate(el));
const digitsDirections = digitsArray.map((el, index, arr) => {
  if (index === arr.length - 1) {
    return { x: 0, y: 0 };
  }

  return getNumberDirection(el, arr[index + 1]);
});

// Draw small circle
const circleCoord = getStartCircleCoordinates(
  digitsCoordinates[0],
  digitsCoordinates[1]
);
ctx.beginPath();
ctx.arc(circleCoord.x, circleCoord.y, 5, 0, 2 * Math.PI);
ctx.fillStyle = "indianred";
ctx.fill();
ctx.closePath();

// Draw all the lines first
ctx.strokeStyle = "indianred";
ctx.lineWidth = 5;
ctx.lineCap = "round";
ctx.beginPath();
generateArrayWithDifferentAdjacentDigits(digitsArray).forEach(
  (digit, index) => {
    const coordinates = getNumberCoordinate(digit);
    if (index === 0) {
      ctx.moveTo(coordinates.x, coordinates.y);
    } else {
      ctx.lineTo(coordinates.x, coordinates.y);
    }
  }
);
ctx.stroke();
ctx.closePath();
// Draw same directions
digitsArray.forEach((digit, index) => {
  if (
    index !== 0 &&
    isSameDirection(digitsDirections[index], digitsDirections[index - 1]) &&
    digit !== digitsArray[index - 1]
  ) {
    const coordinates = getNumberCoordinate(digit);
    const perpendicularDirection = getPerpendicularDirection(
      digitsDirections[index]
    );

    ctx.beginPath();
    ctx.lineCap = "butt";
    ctx.lineJoin = "butt";
    ctx.moveTo(
      coordinates.x + perpendicularDirection.x * -10,
      coordinates.y + perpendicularDirection.y * -10
    );
    ctx.lineTo(
      coordinates.x + perpendicularDirection.x * 10,
      coordinates.y + perpendicularDirection.y * 10
    );
    ctx.stroke();
    ctx.closePath();

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.moveTo(digitsCoordinates[index - 1].x, digitsCoordinates[index - 1].y);
  }
});
// Draw circle on consecutive numbers
getConsecutiveNumbers(digitsArray).forEach((element) => {
  const coordinates = getNumberCoordinate(element.digit);

  ctx.beginPath();
  ctx.arc(coordinates.x, coordinates.y, 15, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();

  if (element.times >= 2) {
    ctx.beginPath();
    ctx.moveTo(coordinates.x - 15, coordinates.y);
    ctx.lineTo(coordinates.x + 15, coordinates.y);
    ctx.stroke();
    ctx.closePath();
  }

  if (element.times >= 3) {
    ctx.beginPath();
    ctx.moveTo(coordinates.x, coordinates.y - 15);
    ctx.lineTo(coordinates.x, coordinates.y + 15);
    ctx.stroke();
    ctx.closePath();
  }
});
