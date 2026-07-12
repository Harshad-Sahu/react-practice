Array.prototype.myReduce = function (...args) {
  const callback = args[0];
  const initialValue = args[1];

  if (this === null) throw new TypeError("Not an array");

  if (typeof callback !== "function") throw new TypeError("Not a function");

  const array = Object(this);
  const length = array.length >>> 0;

  let accumulator;
  let startIndex = 0;

  if (initialValue) {
    accumulator = initialValue;
  } else {
    while (startIndex < length && !(startIndex in array)) {
      startIndex++;
    }

    if (startIndex >= length) {
      throw new TypeError("Not Found");
    }

    accumulator = array[startIndex];
    startIndex++;
  }

  for (; startIndex < length; startIndex++) {
    if (startIndex in array) {
      accumulator = callback(accumulator, array[startIndex], startIndex, array);
    }
  }

  return accumulator;
};

const array = [1, 2, 3, 4];

// 0 + 1 + 2 + 3 + 4
const initialValue = 0;
const sumWithInitial = array.myReduce(
  (accumulator, currentValue) => accumulator + currentValue,
  initialValue,
);

console.log(sumWithInitial);
