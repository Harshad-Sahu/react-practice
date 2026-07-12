Array.prototype.myFlat = function (depth = 1) {
  if (this === null) throw new TypeError("Not a function");

  const array = Object(this);
  const result = [];

  const flatten = (arr, currentDept) => {
    const arrLength = arr.length >>> 0;

    for (let i = 0; i < arrLength; i++) {
      if (!(i in arr)) continue;

      const value = arr[i];

      if (Array.isArray(value) && currentDept > 0) {
        flatten(value, currentDept - 1);
      } else {
        result.push(value);
      }
    }
  };

  flatten(array, Number(depth));

  return result;
};

const arr1 = [0, 1, 2, [3, 4]];

console.log(arr1.myFlat());
// expected output: Array [0, 1, 2, 3, 4]

const arr2 = [0, 1, [2, [3, [4, 5]]]];

console.log(arr2.myFlat());
// expected output: Array [0, 1, 2, Array [3, Array [4, 5]]]

console.log(arr2.myFlat(2));
// expected output: Array [0, 1, 2, 3, Array [4, 5]]

console.log(arr2.myFlat(Infinity));
// expected output: Array [0, 1, 2, 3, 4, 5]
