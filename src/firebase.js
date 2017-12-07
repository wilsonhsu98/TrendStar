import firebase from 'firebase';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyCXHnQNdZn7c2_DaAGL-9apmYzi8LyyLzg",
    authDomain: "glowing-heat-8044.firebaseapp.com",
    // databaseURL: "https://glowing-heat-8044.firebaseio.com",
    projectId: "glowing-heat-8044",
    // storageBucket: "glowing-heat-8044.appspot.com",
    // messagingSenderId: "1073012005802",
};
firebase.initializeApp(config);
const db = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

export {
    db,
    timestamp,
};