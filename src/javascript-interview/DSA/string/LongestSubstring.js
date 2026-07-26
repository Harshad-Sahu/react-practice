function longestSubstring(s) {
  const lastSeen = new Map();
  let left = 0;

  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    // Only jump `left` if the duplicate is inside the current window
    if (lastSeen.has(char) && lastSeen.get(char) >= left) {
      left = lastSeen.get(char) + 1;
    }
    lastSeen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}

console.log(longestSubstring("abcabcbb")); // 3 ("abc") O(n))
