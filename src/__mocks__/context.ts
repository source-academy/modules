export default {
  moduleContexts: new Proxy({}, {
    get: () => ({ state: {} })
  })
}