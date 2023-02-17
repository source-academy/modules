export default new Proxy({}, {
  get: () => (input) => input,
})