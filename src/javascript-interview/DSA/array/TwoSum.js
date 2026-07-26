function twoSum(arr, target) {
  if (arr.length === 0) return [];

  const freq = new Map();

  for (let i = 0; i < arr.length; i++) {
    const need = target - arr[i];

    if (freq.has(need)) {
      return [freq.get(need), i];
    } else {
      freq.set(arr[i], i);
    }
  }

  return [];
}

console.log(twoSum([1, 2, 4, 5, 6, 10], 16));
