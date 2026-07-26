function deepClone(value, seen = new WeakMap()) {
  // Base case: primitives (number, string, boolean, undefined, null) and functions
  // don't need cloning — return as-is. typeof null is "object", so we check
  // value === null separately.
  if (value === null || typeof value !== "object") return value;

  // Circular reference check: if we've already started cloning this exact
  // object earlier in the recursion, return that in-progress clone instead
  // of recursing into it again — this is what prevents infinite recursion
  // on structures like obj.self = obj.
  if (seen.has(value)) return seen.get(value);

  // Decide the shape of the clone up front — array or plain object —
  // based on the input's actual type.
  const out = Array.isArray(value) ? [] : {};

  // Register the clone in the map BEFORE recursing into its properties.
  // This is the key step for circular refs: if a nested property points
  // back to `value`, the recursive call will find `out` already here
  // (even though it's still being filled in) instead of looping forever.
  seen.set(value, out);

  // Recursively clone each own enumerable property.
  // Object.keys() works for both arrays (returns indices as strings)
  // and plain objects, so one loop handles both cases.
  for (const key of Object.keys(value)) {
    out[key] = deepClone(value[key], seen);
  }

  return out;
}

/**
 * USAGE
 */

// 1. Plain object — basic deep clone
const user = { name: "John DOe", address: { city: "Pune" } };
const userCopy = deepClone(user);

userCopy.address.city = "Mumbai";
console.log(user.address.city); // "Pune" — original untouched
console.log(userCopy.address.city); // "Mumbai"
console.log(user === userCopy); // false — different object
console.log(user.address === userCopy.address); // false — nested object also cloned, not shared

// 2. Array of objects
const list = [{ id: 1 }, { id: 2 }];
const listCopy = deepClone(list);

listCopy[0].id = 99;
console.log(list[0].id); // 1 — original untouched
console.log(Array.isArray(listCopy)); // true — shape (array) preserved

// 3. Deeply nested structure
const state = {
  user: { name: "John DOe", roles: ["admin", "editor"] },
  settings: { theme: { mode: "dark" } },
};
const stateCopy = deepClone(state);

stateCopy.settings.theme.mode = "light";
stateCopy.user.roles.push("viewer");

console.log(state.settings.theme.mode); // "dark" — untouched
console.log(state.user.roles); // ["admin", "editor"] — untouched

// 4. Circular reference — the case this implementation specifically handles
const node = { value: 1 };
node.self = node; // points back to itself

const nodeCopy = deepClone(node);
console.log(nodeCopy.self === nodeCopy); // true — cycle correctly preserved
console.log(nodeCopy === node); // false — still a real deep clone, not the same object

// 5. Shared reference cloned only once (not duplicated per occurrence)
const shared = { count: 1 };
const parent = { a: shared, b: shared }; // both keys point to the SAME object

const parentCopy = deepClone(parent);
console.log(parentCopy.a === parentCopy.b); // true — WeakMap ensures shared refs
// stay shared in the clone too,
// instead of becoming two separate copies
