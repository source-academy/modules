import __Params from '../../typings/__Params';

function share(f: Function) {
  return f;
}

function then(promise: any, f: Function) {
  return f(promise);
}

function connect(s: string) {
  return 'Connection successful';
}

function disconnect(s: string) {
  return 'Disconnected';
}

export default function (_params: __Params) {
  return {
    share,
    then,
    connect,
    disconnect,
  };
}
