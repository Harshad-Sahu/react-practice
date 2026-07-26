function anagramCheck(s1, s2) {
  if (s1.length !== s2.length) return false;
  const freqMap = new Map();

  for (const char of s1) {
    freqMap.set(char, (freqMap.get(char) ?? 0) + 1);
  }

  for (const char of s2) {
    const count = freqMap.get(char);

    if (!count) return false;

    if (count === 1) {
      freqMap.delete(char);
    } else {
      freqMap.set(char, count - 1);
    }
  }

  return true;
}

console.log(anagramCheck("listen", "silent"));
