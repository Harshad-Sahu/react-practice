function deepClone(value) {
  if (value === null || typeof value !== "object") return value;

  if (Array.isArray(value)) {
    return value.map(deepClone);
  }

  const result = {};

  for (const key of Object.keys(value)) {
    result[key] = deepClone(value[key]);
  }

  return result;
}

// Usage
const original = { a: 1, nested: { b: 2 } };
const copy = deepClone(original);
copy.nested.b = 99;
console.log(original.nested.b); // 2 (unaffected)
