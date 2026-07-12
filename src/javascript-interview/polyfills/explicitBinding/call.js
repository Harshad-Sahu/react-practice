Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== "function") throw new Error("Not a function");

  context =
    context === null || context === undefined ? globalThis : Object(context);

  const uniqueKey = Symbol("fn");

  context[uniqueKey] = this;

  const result = context[uniqueKey](...args);
  delete context[uniqueKey];

  return result;
};

function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  Product.myCall(this, name, price);
  this.category = "food";
}

console.log(new Food("cheese", 5).name);
// Expected output: "cheese"
