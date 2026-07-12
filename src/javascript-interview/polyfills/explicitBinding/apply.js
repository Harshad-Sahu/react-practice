Function.prototype.myApply = function (context, argArray = []) {
  if (typeof this !== "function") throw new TypeError("Not a function");

  context =
    context === null || context === undefined ? globalThis : Object(context);

  const uniqueKey = Symbol("fn");

  context[uniqueKey] = this;

  const result = context[uniqueKey](...argArray);
  delete context[uniqueKey];

  return result;
};

const numbers = [5, 6, 2, 3, 7];

const max = Math.max.myApply(null, numbers);

console.log(max);
// Expected output: 7

const min = Math.min.myApply(null, numbers);

console.log(min);
// Expected output: 2
