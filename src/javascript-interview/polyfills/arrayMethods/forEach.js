Array.prototype.myForEach = function (callback, args) {
  if (this === null) {
    throw new TypeError("Not a array");
  }

  if (typeof callback !== "function") {
    throw new TypeError("Not a function");
  }

  const array = Object(this);
  const length = array.length >>> 2;

  for (let i = 0; i < length; i++) {
    if (i in array) {
      callback.call(args, array[i], i, array);
    }
  }
};

const array = [1, 2, 3, 4, 5];
array.myForEach((n) => {
  console.log(n * 2);
});
