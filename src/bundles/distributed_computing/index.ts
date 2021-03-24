function share(f: Function) {
  return f;
}

function then(promise: any, f: Function) {
  return f(promise);
}

function connect(s: string) {
  console.log(s);
  return 'Connection successful';
}

function disconnect(s: string) {
  console.log(s);
  return 'Disconnected';
}

function init() {}

export default function distributed_computing() {
  return {
    share,
    then,
    connect,
    disconnect,
    init,
  };
}
