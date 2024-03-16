jest.mock('chalk', () => ({
  default: new Proxy({}, {
    get: () => x => x,
  })
}))

