function flattenArrayIterative(arr) {
  if (arr.length === 0) return [];

  const stack = [...arr];
  const result = [];

  while (stack.length > 0) {
    const value = stack.pop();

    if (Array.isArray(value)) {
      stack.push(...value);
    } else {
      result.unshift(value);
    }
  }

  return result;
}

console.log(flattenArrayIterative([1, 2, [3, 4, [5, [6, [7, [8, 9]]]]]]));
