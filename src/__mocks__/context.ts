export default {
  moduleContexts: new Proxy({}, {
    get: (t, p) => {
      if (!(p in t)) {
        t[p] = {};
      }

      return t[p];
    }
  })
};
