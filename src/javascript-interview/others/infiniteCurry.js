function currySumWithParenthesis(arg1) {
  return function next(arg2) {
    if (arg2 !== undefined || arg2 !== null) {
      return currySumWithParenthesis(arg1 + arg2);
    }

    return arg1;
  };
}

console.log(currySumWithParenthesis(1)(2)());
console.log(currySumWithParenthesis(2)(4)());
console.log(currySumWithParenthesis(5)(5)());
console.log(currySumWithParenthesis(20)(20)(30)());

/**
 * infinite curry without parenthesis
 */

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs]);
    };
  };
}

// Usage
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

curriedAdd(1)(2)(3); // 6
curriedAdd(1, 2)(3); // 6
curriedAdd(1)(2, 3); // 6
curriedAdd(1, 2, 3); // 6
