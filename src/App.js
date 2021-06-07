import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase config";
import { useState } from "react";

firebase.initializeApp(firebaseConfig);

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    photo: "",
    email: "",
  });
  const handleSignOut = ()=>{
    firebase.auth().signOut()
    .then((res)=>{
      const signedOutUser = {
        isSignedIn:false,
        
      }
      setUser(signedOutUser)
    })
    .catch((err)=>{console.log(err)})
  }
  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const { displayName, photoURL, email } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          photoURL: photoURL,
          email: email,
        };
        setUser(signedInUser);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  
  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
      {user.isSignedIn && (
        <div>
          {" "}
          <h2> welcome dear,{user.name}</h2>
          <img src={user.photoURL} alt="" />
          <h5>{user.email}</h5>
        </div>
      )}
    </div>
  );
}

export default App;
