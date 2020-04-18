import * as firebase from "firebase-admin";

let _app: firebase.app.App;

export function getFirebaseApp(): firebase.app.App {
  if (!_app) {
    _app = firebase.initializeApp({
      credential: firebase.credential.applicationDefault(),
    });
  }

  return _app;
}
