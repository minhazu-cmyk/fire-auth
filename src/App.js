import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
// firebase.initializeApp(firebaseCon)
import firebaseConfig from "./firebase.config";

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser]= useState(false);
  const [user,setUser] = useState({

    isSignedIn:false,
    
    name:'',
    email:'',
    pass: "",

  });
 ;
  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
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
      error:"",
      success:false,
     
    }
    setUser(isSignOut)

  })
   .catch(error=>{
     
   })
  }
  const handleFb =()=>{
    firebase.auth().signInWithPopup(fbProvider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }
  const handleBlur=(event)=>{
// console.log(event.target.name,event.target.value)
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
  console.log(event.target.name,event.target.value)
const newInfo= {...user};
newInfo[event.target.name]= event.target.value;
setUser(newInfo)

}

  }
  const handleSubmit=(event)=>{
  
// console.log(user.email,user.pass)
if(newUser && user.email && user.pass){
  firebase.auth().createUserWithEmailAndPassword(user.email, user.pass)
  .then(res=>{
    const newUserInfo ={...user}
    newUserInfo.error="";
    newUserInfo.success=true;
    setUser(newUserInfo)
    displayUser(user.name)
  })
  .catch(error=> {
   
    const newUserInfo={...user}
    newUserInfo.error=error.message;
    newUserInfo.success=false;
    setUser(newUserInfo);
 });
}
  if(!newUser && user.email && user.pass){
  firebase.auth().signInWithEmailAndPassword(user.email , user.pass)
  .then(res=>{
    const newUserInfo ={...user}
    newUserInfo.error="";
    newUserInfo.success=true;
    setUser(newUserInfo)
    console.log("sign in user info", res.user)
    
  })
  .catch(error=> {
    // Handle Errors here.
    const newUserInfo={...user}
    newUserInfo.errorn=error.message;
    newUserInfo.success=false;
    setUser(newUserInfo);
    // ...
  });
}
event.preventDefault();
  }

   const displayUser= name=>{
   const user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name,
  
}).then(function() {
 console.log("user name update successfully")
}).catch(function(error) {
  console.log(error)
});
  }
  return (
    <div >
      {
        user.isSignedIn ?  <button onClick={handleOut}> sign out</button> : <button onClick={handleClick}> sign in</button>
      }
      <br/>
      <button onClick={handleFb}> log in with facebook</button>
      {
        user.isSignedIn && <div> <p>welcome {user.name} </p>
        <p> email:{user.email} </p>
      
        </div>
}
       <h2> my own authentication </h2>
       <input type="checkbox" name="newUser" onChange={()=>setNewUser(!newUser)} id=""/>
       <label htmlFor="newUser">newUser sign in</label>
       <form onSubmit={handleSubmit}>
         {newUser &&  <input type="text" name="name"onBlur={handleBlur} placeholder="ur name"/>}
         <br/>
      <input type="email" name="email" onBlur={handleBlur} id="" placeholder="write your email here" required/>
      <br/>
        <input type="password" onBlur={handleBlur} name="pass" id="" placeholder="pass here" required/>
        <br/>
        <input type="submit" value={newUser?"sign up" : "sign in"}/>
        </form>
        <p style={{color:"red"}}> {user.error} </p>
        {user.success && <p style={{color:"green"}}> users {newUser ?"created" :"log in" }  successfully </p>}

    </div>
  );
}

export default App;
