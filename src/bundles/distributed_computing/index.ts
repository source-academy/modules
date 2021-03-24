import firebase from "firebase";

const firebaseConfig = {
  apiKey: "dummy",
  authDomain: "distributed-computing-478ce.firebaseapp.com",
  projectId: "distributed-computing-478ce",
  storageBucket: "distributed-computing-478ce.appspot.com",
  messagingSenderId: "dummy",
  appId: "dummy"
};

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
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  db.collection("users").add({
    first: "Ada",
    last: "Lovelace",
    born: 1815
  })
  .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
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
