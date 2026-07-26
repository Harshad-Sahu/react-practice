function palindromeCheck(s) {
  s = s?.toLowerCase().replace(/[^a-z0-9]/g, "");

  let left = 0,
    right = s.length - 1;

  while (left < right) {
    if (s[left++] !== s[right--]) return false;
  }

  return true;
}

console.log(palindromeCheck("racecar"));
console.log(
  palindromeCheck("A man, a plan, a canal: Panama"), // true O(n) time, O(1) extra
);
