function secondLargestNum(arr) {
  if (arr.length === 0) return null;

  let firstNum = -Infinity,
    secondNum = -Infinity;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > firstNum) {
      secondNum = firstNum;
      firstNum = arr[i];
    } else if (arr[i] < firstNum && arr[i] > secondNum) {
      secondNum = arr[i];
    }
  }

  return secondNum;
}

console.log(secondLargestNum([2, 3, 4, 3, 2, 4, 2, 3, 9, 89]));
