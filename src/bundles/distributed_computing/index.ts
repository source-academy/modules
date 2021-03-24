import firebase from 'firebase/app';
import 'firebase/firestore';

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

function init() {
  firebase.initializeApp({
    apiKey: 'dummy',
    authDomain: 'distributed-computing-478ce.firebaseapp.com',
    projectId: 'distributed-computing-478ce',
    storageBucket: 'distributed-computing-478ce.appspot.com',
    messagingSenderId: 'dummy',
    appId: 'dummy',
  });
}

export default function distributed_computing() {
  return {
    share,
    then,
    connect,
    disconnect,
    init,
  };
}
