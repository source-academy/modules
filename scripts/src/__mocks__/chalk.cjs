module.exports.default = new Proxy({
}, {
  get: () => (input) => input,
});
