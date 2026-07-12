Promise.myAny = function (promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      reject(new AggregateError([], "All promises rejected"));
    }

    const errors = [];
    let rejectedCount = 0;

    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i])
        .then(resolve)
        .catch((error) => {
          errors[i] = error;
          rejectedCount++;
          if (promises.length === rejectedCount) {
            reject(new AggregateError([], "All promises rejected"));
          }
        });
    }
  });
};

const promise1 = Promise.reject(new Error("error"));
const promise2 = new Promise((resolve) => setTimeout(resolve, 100, "quick"));
const promise3 = new Promise((resolve) => setTimeout(resolve, 500, "slow"));

const promises = [promise1, promise2, promise3];

Promise.any(promises).then((value) => console.log(value));

// Expected output: "quick"
