function rotateByK(arr, k) {
  const length = arr.length >>> 0;
  if (length === 0) return arr;

  // Normalize k to handle negative values and values larger than length
  k = k % length;

  reverse(arr, 0, length - 1);
  reverse(arr, 0, k - 1);
  reverse(arr, k, length - 1);

  return arr; // Return the mutated array
}

function reverse(arr, left, right) {
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
}

// Output: [4, 5, 1, 2, 3] (Right rotation by 2)
console.log(rotateByK([1, 2, 3, 4, 5], 2));
