/**
 * Implementation of deepEquals
 */
function deepEquals(a, b) {
  if (Object.is(a, b)) return true;

  if (
    a === null ||
    b === null ||
    typeof a !== "object" ||
    typeof b !== "object"
  )
    return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

  const keysOfObjectA = Object.keys(a);

  if (keysOfObjectA.length !== Object.keys(b)?.length) return false;

  for (const key of keysOfObjectA) {
    if (!Object.hasOwn(b, key)) return false;

    if (!deepEquals(a[key], b[key])) return false;
  }

  return true;
}

/**
 * Execution of above code
 */

const objectOne = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3,
      f: 4,
    },
  },
};

const objectTwo = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3,
      f: 4,
    },
  },
};

console.log(deepEquals(objectOne, objectTwo));
