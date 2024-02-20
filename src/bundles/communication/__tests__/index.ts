import { MultiUserController } from '../MultiUserController';
import { GlobalStateController } from '../GlobalStateController';

let multiUser = new MultiUserController();
multiUser.setupController('broker.hivemq.com', 8884);
let globalStateController = new GlobalStateController(
  'test',
  multiUser,
  (_) => {}
);

// Empty Root - Replace root.

test('Empty Root Set Null', () => {
  globalStateController.globalState = undefined;
  globalStateController.parseGlobalStateMessage('', JSON.stringify(null));
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify(null)
  );
});

test('Empty Root Set Object', () => {
  globalStateController.globalState = undefined;
  let object = {
    a: 'b',
  };
  globalStateController.parseGlobalStateMessage('', JSON.stringify(object));
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify(object)
  );
});

// Non-Empty Root - Replace root.

test('Non-Empty Root Set Empty', () => {
  let object = {
    a: 'b',
  };
  globalStateController.globalState = object;
  globalStateController.parseGlobalStateMessage('', JSON.stringify(undefined));
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify(undefined)
  );
});

test('Non-Empty Root Set Null', () => {
  let object = {
    a: 'b',
  };
  globalStateController.globalState = object;
  globalStateController.parseGlobalStateMessage('', JSON.stringify(null));
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify(null)
  );
});

test('Non-Empty Root Set Object', () => {
  globalStateController.globalState = {
    a: 'b',
  };
  let object = {
    c: 'd',
  };
  globalStateController.parseGlobalStateMessage('', JSON.stringify(object));
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify(object)
  );
});

// Branch Value - Replace value if non-empty, remove path if empty.

test('Branch Value Set Empty', () => {
  globalStateController.globalState = {
    a: 'b',
    c: 'd',
  };
  globalStateController.parseGlobalStateMessage('a', JSON.stringify(undefined));
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify({ c: 'd' })
  );
});

test('Nested Branch Value Set Empty', () => {
  globalStateController.globalState = {
    a: {
      b: 'c',
    },
  };
  globalStateController.parseGlobalStateMessage(
    'a/b',
    JSON.stringify(undefined)
  );
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify({ a: {} })
  );
});

test('Branch Value Set Null', () => {
  globalStateController.globalState = {
    a: 'b',
    c: 'd',
  };
  globalStateController.parseGlobalStateMessage('a', JSON.stringify(null));
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify({ a: null, c: 'd' })
  );
});

test('Nested Branch Value Set Null', () => {
  globalStateController.globalState = {
    a: {
      b: 'c',
    },
  };
  globalStateController.parseGlobalStateMessage('a/b', JSON.stringify(null));
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify({ a: { b: null } })
  );
});

test('Branch Value Set Object', () => {
  globalStateController.globalState = {
    a: 'b',
    c: 'd',
  };
  let object = {
    b: 'e',
  };
  globalStateController.parseGlobalStateMessage('a', JSON.stringify(object));
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify({ a: object, c: 'd' })
  );
});

test('Nested Branch Value Set Object', () => {
  globalStateController.globalState = {
    a: {
      b: 'c',
    },
  };
  let object = {
    c: 'd',
  };
  globalStateController.parseGlobalStateMessage('a/b', JSON.stringify(object));
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify({ a: { b: object } })
  );
});

// Branch Object - Replace object if non-empty, remove path if empty.

test('Branch Object Set Empty', () => {
  globalStateController.globalState = {
    a: { b: 'c' },
    d: 'e',
  };
  globalStateController.parseGlobalStateMessage('a', JSON.stringify(undefined));
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify({ d: 'e' })
  );
});

test('Nested Branch Object Set Empty', () => {
  globalStateController.globalState = {
    a: { b: { c: 'd' }, e: 'f' },
  };
  globalStateController.parseGlobalStateMessage(
    'a/b',
    JSON.stringify(undefined)
  );
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify({ a: { e: 'f' } })
  );
});

test('Branch Object Set Null', () => {
  globalStateController.globalState = {
    a: { b: 'c' },
    d: 'e',
  };
  globalStateController.parseGlobalStateMessage('a', JSON.stringify(null));
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify({ a: null, d: 'e' })
  );
});

test('Nested Branch Object Set Null', () => {
  globalStateController.globalState = {
    a: { b: { c: 'd' }, e: 'f' },
  };
  globalStateController.parseGlobalStateMessage('a/b', JSON.stringify(null));
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify({ a: { b: null, e: 'f' } })
  );
});

test('Branch Object Set Object', () => {
  globalStateController.globalState = {
    a: { b: 'c', d: 'e' },
    f: 'g',
  };
  let object = {
    d: 'f',
    g: 'h',
  };
  globalStateController.parseGlobalStateMessage('a', JSON.stringify(object));
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify({ a: object, f: 'g' })
  );
});

test('Nested Branch Object Set Null', () => {
  globalStateController.globalState = {
    a: { b: { c: 'd' }, e: 'f' },
  };
  let object = {
    c: 'g',
    h: 'i',
  };
  globalStateController.parseGlobalStateMessage('a/b', JSON.stringify(object));
  expect(JSON.stringify(globalStateController.globalState)).toBe(
    JSON.stringify({ a: { b: object, e: 'f' } })
  );
});
