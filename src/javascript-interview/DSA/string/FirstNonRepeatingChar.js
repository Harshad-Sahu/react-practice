function firstNonRepeatingChar(s) {
  const freqMap = new Map();

  for (const char of s) {
    freqMap.set(char, (freqMap.get(char) ?? 0) + 1);
  }

  for (let i = 0; i < s.length; i++) {
    const count = freqMap.get(s[i]);

    if (count === 1) {
      return s[i];
    }
  }

  return null;
}

firstNonRepeatingChar("swiss");
