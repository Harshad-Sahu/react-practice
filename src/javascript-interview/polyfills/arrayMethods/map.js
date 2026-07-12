Array.prototype.myMap = function (callback, args) {
  if (this === null) {
    throw new TypeError("Not a array");
  }

  if (typeof callback !== "function") {
    throw new TypeError("Not a function");
  }

  const array = Object(this);
  const length = array.length >>> 0;

  const result = [];

  for (let i = 0; i < length; i++) {
    if (i in array) {
      result[i] = callback.call(args, array[i], i, array);
    }
  }

  return result;
};

const array = [1, 2, 3, 4, 5];
console.log(
  array.myMap((n) => {
    return n * 2;
  }),
);
