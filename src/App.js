import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
// firebase.initializeApp(firebaseCon)
import firebaseConfig from "./firebase.config";

firebase.initializeApp(firebaseConfig);

function App() {
  const [user,setUser] = useState({

    isSignedIn:false,
    name:'',
    email:'',
    pass: "",

  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleClick =()=>{
    firebase.auth().signInWithPopup(provider)
   .then(res=>{
     const{displayName,email,emailVerified}= res.user;
     const signUser={
       isSignedIn:true,
       name:displayName,
       email:email,
     }
     setUser(signUser);
     console.log(displayName,email,emailVerified)
   })
  .catch(error=>{
    console.log(error)
    console.log(error.message)
  })

  }
  const handleOut=()=>{
    firebase.auth().signOut()
    .then(res=>{
    const isSignOut={
      isSignedIn: false,
      name:"",
      email:"",
     
    }
    setUser(isSignOut)

  })
   .catch(error=>{
     
   })
  }
  const handleBlur=(event)=>{
console.log(event.target.name,event.target.value)
let formValid= true;
if(event.target.name==="email"){
 formValid= /\S+@\S+\.\S+/.test(event.target.value);

}
if(event.target.name==="pass"){
  const isPassValid = event.target.value.length>6;
const passwordValue= /\d{1}/.test(event.target.value)

  formValid = isPassValid && passwordValue;
}
if(formValid){
const newInfo= {...user};
newInfo[event.target.name]= event.target.value;
setUser(newInfo)

}

  }
  const handleSubmit=(event)=>{
console.log(user.email,user.pass)
if(user.email && user.pass){

console.log("submitted")
}
event.preventDefault();
  }
  return (
    <div >
      {
        user.isSignedIn ?  <button onClick={handleOut}> sign out</button> : <button onClick={handleClick}> sign in</button>
      }
      {
        user.isSignedIn && <div> <p>welcome {user.name} </p>
        <p> email:{user.email} </p>
      
        </div>
}
       <h2> my own authentication </h2>
       
       <form onSubmit={handleSubmit}>
         <input type="text" name="name"onBlur={handleBlur} placeholder="ur name"/>
         <br/>
      <input type="email" name="email" onBlur={handleBlur} id="" placeholder="write your email here" required/>
      <br/>
        <input type="password" onBlur={handleBlur} name="pass" id="" placeholder="pass here" required/>
        <br/>
        <input type="submit" value="submit"/>
        </form>

    </div>
  );
}

export default App;
