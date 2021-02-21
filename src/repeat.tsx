(_params: any) => {
  function repeat(f: Function, n: any) {
    return n === 0 ? (x: any) => x : (x: any) => f(repeat(f, n - 1)(x));
  }

  function twice(f: any) {
    return repeat(f, 2);
  }

  function thrice(f: any) {
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
