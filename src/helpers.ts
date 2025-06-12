import { ConsecutiveNumber, DirectionVector } from "./types";

export function lerp(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function splitNumberIntoDigits(n: number) {
  return Array.from(String(n), Number);
}

export function isSameDirection(
  dir: DirectionVector,
  dirToCompare: DirectionVector
) {
  return dir.x === dirToCompare.x && dir.y === dirToCompare.y;
}

export function isOppositiveDirection(
  dir: DirectionVector,
  dirToCompare: DirectionVector
) {
  return dir.x * -1 === dirToCompare.x && dir.y * -1 === dirToCompare.y;
}

export function generateArrayWithDifferentAdjacentDigits(arr: number[]) {
  let result = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== result[result.length - 1]) {
      result.push(arr[i]);
    }
  }
  return result;
}

export function getConsecutiveNumbers(arr: number[]) {
  const result: ConsecutiveNumber[] = [];
  let currentConsecutive: ConsecutiveNumber = { digit: 0, occurence: 0 };
  arr.toReversed().forEach((digit, index, reversedArray) => {
    if (digit === reversedArray[index + 1]) {
      currentConsecutive.digit = digit;
      currentConsecutive.occurence++;
    } else if (currentConsecutive.occurence > 0) {
      result.push(currentConsecutive);
      currentConsecutive = { digit: 0, occurence: 0 };
    }
  });

  return result;
}

export function getPerpendicularDirection(direction: DirectionVector) {
  // If x and y are both 0, there's no perpendicular direction
  if (direction.x === 0 && direction.y === 0) {
    throw new Error("Input direction cannot be (0, 0)");
  }

  // Perpendicular direction to (x, y) is (-y, x)
  return { x: -direction.y, y: direction.x } as DirectionVector;
}

export default {
  lerp,
  splitNumberIntoDigits,
  isSameDirection,
  isOppositiveDirection,
  generateArrayWithDifferentAdjacentDigits,
  getConsecutiveNumbers,
  getPerpendicularDirection,
};
