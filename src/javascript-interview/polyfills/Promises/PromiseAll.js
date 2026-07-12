Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([]);
      return;
    }

    const result = [];
    let completed = 0;

    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i])
        .then((value) => {
          result[i] = value;
          completed++;

          if (completed === promises.length) resolve(result);
        })
        .catch(reject);
    }
  });
};

const promise1 = Promise.resolve(3);
const promise2 = 42;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "foo");
});

Promise.myAll([promise1, promise2, promise3]).then((values) => {
  console.log(values);
});
// Expected output: Array [3, 42, "foo"]
