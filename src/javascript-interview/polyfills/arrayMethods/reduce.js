Array.prototype.myReduce = function (...args) {
  if (this === null || this === undefined) {
    throw new TypeError("Not an array");
  }

  const callback = args[0];
  if (typeof callback !== "function") {
    throw new TypeError("Not a function");
  }

  const array = Object(this);
  const length = array.length >>> 0;

  let accumulator;
  let startIndex = 0;

  // Corrected the variable check here
  const isInitialValueProvided = args.length > 1;

  if (isInitialValueProvided) {
    accumulator = args[1]; // args[1] is the initialValue
  } else {
    // Find the first occupied index if no initial value is provided
    while (startIndex < length && !(startIndex in array)) {
      startIndex++;
    }
    if (startIndex >= length) {
      throw new TypeError("Reduce of empty array with no initial value");
    }

    accumulator = array[startIndex];
    startIndex++;
  }

  for (; startIndex < length; startIndex++) {
    if (startIndex in array) {
      // Pass accumulator and current value directly as normal arguments
      accumulator = callback(accumulator, array[startIndex], startIndex, array);
    }
  }

  // CRITICAL: Remember to return the final result!
  return accumulator;
};

const array = [1, 2, 3, 4];
const initialValue = 0;

const sumWithInitial = array.myReduce(
  (accumulator, currentValue) => accumulator + currentValue,
  initialValue,
);

console.log(sumWithInitial); // Output: 10
