import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

type Props = {
  children?: never;
  className?: string;
};

class Distributedcomputing extends React.Component<Props> {
  componentDidMount() {
    firebase.initializeApp({
      apiKey: 'dummy',
      authDomain: 'distributed-computing-478ce.firebaseapp.com',
      projectId: 'distributed-computing-478ce',
      storageBucket: 'distributed-computing-478ce.appspot.com',
      messagingSenderId: 'dummy',
      appId: 'dummy',
    });
    const db = firebase.firestore();
    db.collection('users')
      .add({
        first: 'Ada',
        last: 'Lovelace',
        born: 1815,
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef.id);
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  }

  public render() {
    return <div>This is spawned from the Distributedcomputing tab.</div>;
  }
}
export default {
  toSpawn: () => true,
  body: () => <Distributedcomputing />,
  label: 'Share Test Tab',
  iconName: 'build',
};
