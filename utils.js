export const rafIter = () => {
  let id;

  const obj = {
    async next() {
      const promise = new Promise(resolve => {
        id = requestAnimationFrame(resolve);
      });
      await promise;
      return { value: undefined, done: false };
    },
    async return() {
      cancelAnimationFrame(id);
      return { value: undefined, done: true };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };

  return obj;
};
