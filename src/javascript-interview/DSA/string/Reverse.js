// Reverse String
function reverse(s) {
  let out = "";

  for (let i = s.length - 1; i >= 0; i--) {
    out += s[i];
  }

  return out;
}

console.log(reverse("HELLO"));

// Reverse WORD ORDER: "how are you" -> "you are how"
function reverseWordOrder(s) {
  return s.trim().split(" ").reverse().join(" ");
}

console.log(reverseWordOrder("how are you"));

// Reverse EACH word in place: "how are you" -> "woh era uoy"
function reverseEachWord(s) {
  return s.trim().split(" ").map(reverse).join(" ");
}

console.log(reverseEachWord("how are you"));
