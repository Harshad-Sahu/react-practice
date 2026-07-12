/**
 * Implementation of basicThrottle
 */
function basicThrottle(fn, delay) {
  let lastExecuted = 0;
  let timerId = 0;

  return function (...args) {
    const now = Date.now();
    const remaining = delay - (now - lastExecuted);

    if (remaining <= 0) {
      clearTimeout(timerId);
      timerId = null;

      lastExecuted = now;
      fn.apply(this, args);
    } else {
      clearTimeout(timerId);

      timerId = setTimeout(() => {
        lastExecuted = Date.now();
        fn.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * Execution of above code
 */
const throttledFunction = basicThrottle((msg) => {
  console.log(msg, Date.now());
}, 2000);

throttledFunction("Call 1"); // Executes immediately
throttledFunction("Call 2"); // Throttled
throttledFunction("Call 3"); // Throttled

setTimeout(() => throttledFunction("Call 4"), 1100);
// Executes after 1.1 seconds
setTimeout(() => throttledFunction("Call 5"), 900);
// throttle
setTimeout(() => throttledFunction("Call 6"), 2100);
