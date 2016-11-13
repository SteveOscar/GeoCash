import * as firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyC0lYpQBtg9XObd6b9tedmhiQmQRObVDLY",
  authDomain: "groceryapp-acfa4.firebaseapp.com",
  databaseURL: "https://groceryapp-acfa4.firebaseio.com",
  storageBucket: "groceryapp-acfa4.appspot.com",
  messagingSenderId: "45316330250"
}

firebase.initializeApp(firebaseConfig)

export const itemsRef = firebase.database().ref()
export default firebase
