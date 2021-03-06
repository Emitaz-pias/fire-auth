import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase config";
import { useState } from "react";

firebase.initializeApp(firebaseConfig);

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const [newUser, setNewUser] = useState(false);
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
    let isFormValid = true;
    if (event.target.name === "email") {
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if (event.target.name === "password") {
      const isStrong = event.target.value.length > 6;
      const containsNumbers = /\d{1}/.test(event.target.value);
      isFormValid = containsNumbers && isStrong;
    }
    if (isFormValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  };
  const handleSubmit = (e) => {
    if (newUser && user.email && user.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = " ";
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const newUserInfo = { ...user };
          newUserInfo.error = errorMessage;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    if (!newUser && user.email && user.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = " ";
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const newUserInfo = { ...user };
          newUserInfo.error = errorMessage;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    e.preventDefault();
  };
  const updateUserName = (name) => {
    var user = firebase.auth().currentUser;
    user
      .updateProfile({
        displayName: name,
      })
      .then(function (res) {})
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleFbSignIn = () => {
    firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
   const credential = result.credential;

    // The signed-in user info.
    const user = result.user;
    console.log("facebook user:", user)
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage)
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
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
      <h1>Our own authentication</h1>
      <h4>Name:{user.name}</h4>
      <h4>Email:{user.email}</h4>
      <h4>Password:{user.password}</h4>
      <button onClick={() => handleFbSignIn()}>sign in with facebook</button>
      <br />
      <input
        type="checkbox"
        name="newUser"
        onChange={() => setNewUser(!newUser)}
        id=""
      />
      <label htmlFor="newUser">New User</label>
      <form onSubmit={handleSubmit}>
        {newUser && (
          <input
            type="text"
            onBlur={handleBlur}
            placeholder="Enter your Name"
            name="name"
          />
        )}
        <br />
        <input
          type="text"
          placeholder="email"
          onBlur={handleBlur}
          name="email"
        />
        <br />
        <input
          type="password"
          placeholder="password"
          onBlur={handleBlur}
          name="password"
        />
        <br />
        <input
          type="submit"
          value={newUser ? "Sign Up" : "Sign In"}
          name=""
          id=""
        />
      </form>
      {user.success ? (
        <h4 style={{ color: "green" }}>
          User {newUser ? "created " : "signed in"}successfully
        </h4>
      ) : (
        <h4 style={{ color: "red" }}>{user.error}</h4>
      )}
    </div>
  );
}

export default App;
