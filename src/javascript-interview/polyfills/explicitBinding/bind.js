Function.prototype.myBind = function (context, ...presetArgs) {
  if (typeof this !== "function") throw new TypeError("Not a function");

  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const originalFunc = this;

  function boundFunction(...lateralArgs) {
    const isCalledWithNew = new.target !== undefined;
    const finalContext = isCalledWithNew ? this : context;

    return originalFunc.apply(finalContext, [...presetArgs, ...lateralArgs]);
  }

  if (originalFunc.prototype) {
    boundFunction.prototype = Object.create(originalFunc.prototype);

    boundFunction.prototype.constructor = boundFunction;
  }

  Object.defineProperty(boundFunction, "length", {
    value: Math.max(0, originalFunc.length - presetArgs.length),
    configurable: true,
    editable: false,
    writeable: false,
  });

  Object.defineProperty(boundFunction, "name", {
    value: "bound" + (originalFunc.name || ""),
    configurable: true,
    editable: false,
    writeable: false,
  });

  return boundFunction;
};

const module = {
  x: 42,
  getX() {
    return this?.x;
  },
};

const unboundGetX = module.getX;
console.log(unboundGetX()); // The function gets invoked at the global scope
// Expected output: undefined

const boundGetX = unboundGetX.myBind(module);
console.log(boundGetX());
// Expected output: 42
