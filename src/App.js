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
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        const signedOutUser = {
          isSignedIn: false,
        };
        setUser(signedOutUser);
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
const handleBlur = (event) => {
      console.log(event.target.name,event.target.value);
    if(event.target.name ==="email"){
      const isValid = /\S+@\S+\.\S+/.test(event.target.value);
      console.log(isValid)
    }
    if(event.target.name ==="password"){
      const isStrong = event.target.value.length >6
      const containsNumbers =/\d{1}/.test(event.target.value)
      console.log(isStrong&&containsNumbers)
    }

}
const handleSubmit=()=>{

}
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
      <h1>Our own authentication</h1>
      <form action="">
        <input type="text" placeholder="email" onBlur={handleBlur} name="email" />
        <br />
        <input type="password" placeholder="password" onBlur={handleBlur} name="password" />
        <br />
        <input type="submit" onSubmit={handleSubmit} name="" id="" />
      </form>
    </div>
  );
}

export default App;
