Array.prototype.myFlatMap = function (callback, args) {
  if (this === null) throw new TypeError("Not an array");

  if (typeof callback !== "function") throw new TypeError("Not a function");

  const array = Object(this);
  const length = array.length >>> 0;

  const result = [];

  for (let i = 0; i < length; i++) {
    const mappedValue = callback.call(args, array[i], i, array);

    if (Array.isArray(mappedValue)) {
      for (let j = 0; j < mappedValue.length; j++) {
        if (j in mappedValue) {
          result.push(mappedValue[j]);
        }
      }
    } else {
      result.push(mappedValue);
    }
  }

  return result;
};

const arr = [1, 2, 1];
const result = arr.myFlatMap((num) => (num === 2 ? [2, 2] : 1));
console.log(result);
// Expected output: Array [1, 2, 2, 1]
