/* eslint-disable @typescript-eslint/no-unused-vars */
Promise.myAllSettled = function (promises) {
  return new Promise((res, rej) => {
    if (promises.length === 0) {
      res([]);
      return;
    }

    const result = [];
    let completed = 0;

    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i])
        .then((value) => {
          result[i] = {
            status: "fulfilled",
            value,
          };
        })
        .catch((reason) => {
          result[i] = {
            status: "rejected",
            reason,
          };
        })
        .finally(() => {
          completed++;
          if (completed === promises.length) res(result);
        });
    }
  });
};

const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) =>
  setTimeout(reject, 100, "foo"),
);
const promises = [promise1, promise2];

Promise.myAllSettled(promises).then((results) =>
  results.forEach((result) => console.log(result.status)),
);

// Expected output:
// "fulfilled"
// "rejected"
