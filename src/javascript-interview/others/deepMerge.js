function deepMerge(target, source) {
  if (typeof target !== "object" && typeof source !== "object") return source;

  const result = { ...target };

  for (const key of Object.keys(source)) {
    if (
      result[key] &&
      typeof result[key] === "object" &&
      !Array.isArray(result[key]) &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

// Usage
console.log(
  deepMerge({ a: 1, b: { x: 10, y: 20 } }, { b: { y: 30, z: 40 }, c: 3 }),
);
// { a: 1, b: { x: 10, y: 30, z: 40 }, c: 3 }
