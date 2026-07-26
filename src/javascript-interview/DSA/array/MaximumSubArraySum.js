function maxSubArraySum(arr) {
  if (arr.length === 0) return null;

  let current = arr[0],
    best = arr[0];

  for (let i = 1; i < arr.length; i++) {
    current = Math.max(arr[i], current + arr[i]);
    best = Math.max(best, current);
  }

  return best;
}

console.log(maxSubArraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
