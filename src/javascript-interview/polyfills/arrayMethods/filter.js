Array.prototype.myFilter = function (callback, thisArgs) {
  if (this === null) throw new TypeError("Not an array");

  if (typeof callback !== "function") throw new TypeError("Not a function");

  const array = Object(this);
  const length = array.length >>> 0;

  const result = [];

  for (let i = 0; i < length; i++) {
    if (i in array) {
      if (callback.call(thisArgs, array[i], i, array)) {
        result.push(array[i]);
      }
    }
  }

  return result;
};

const array = [1, 2, 3, 4, 5];
console.log(
  array.myFilter((n) => {
    return n % 2 === 0;
  }),
);
