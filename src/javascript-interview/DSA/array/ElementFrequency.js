const elementFreq = (arr) =>
  arr.reduce((acc, x) => {
    acc[x] = (acc[x] || 0) + 1;
    return acc;
  }, {});

console.log(elementFreq(["a", "b", "a", "c", "b", "a"])); // { a: 3, b: 2, c: 1 }
