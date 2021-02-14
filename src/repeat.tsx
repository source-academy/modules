(_params) => {
  function repeat(f, n) {
    return n === 0 ? (x) => x : (x) => f(repeat(f, n - 1)(x));
  }

  function twice(f) {
    return repeat(f, 2);
  }

  function thrice(f) {
    return repeat(f, 3);
  }

  return {
    functions: {
      repeat: repeat,
      twice: twice,
      thrice: thrice,
    },
    sideContents: [],
  };
};
