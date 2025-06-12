export function lerp(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function splitNumberIntoDigits(n) {
  return Array.from(String(n), Number);
}

export function isSameDirection(dir, dirToCompare) {
  return dir.x === dirToCompare.x && dir.y === dirToCompare.y;
}

export function generateArrayWithDifferentAdjacentDigits(arr) {
  let result = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== result[result.length - 1]) {
      result.push(arr[i]);
    }
  }
  return result;
}

export function getConsecutiveNumbers(arr) {
  const result = [];
  let currentConsecutive = { digit: 0, times: 0 };
  arr.reverse().forEach((digit, index, reversedArray) => {
    if (digit === reversedArray[index + 1]) {
      currentConsecutive.digit = digit;
      currentConsecutive.times++;
    } else if (currentConsecutive.times > 0) {
      result.push(currentConsecutive);
      currentConsecutive = { digit: 0, times: 0 };
    }
  });

  return result;
}

export default {
  lerp,
  splitNumberIntoDigits,
  isSameDirection,
  generateArrayWithDifferentAdjacentDigits,
  getConsecutiveNumbers,
};
