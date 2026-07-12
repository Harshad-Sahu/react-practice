/**
 * Implementation of basicDebounce
 */
function basicDebounce(fn, delay) {
  let intervalId;

  return function (...args) {
    clearTimeout(intervalId);

    intervalId = setTimeout(() => {
      fn.apply(this, args);
    }, [delay]);
  };
}

const fn = basicDebounce((message) => {
  console.log(message);
}, 300);

// Simulate rapid function calls
fn("Hello");
fn("Hello, World!");
fn("Debounced!"); // Only this should log after 300ms

setTimeout(() => {
  fn("Debounced twice");
}, 400);
