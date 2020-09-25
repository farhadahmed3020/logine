import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig)


function App() {
const [newUser, setNewUser] = useState (false);
const [user,setUser] =useState({
  isSignedIn :false,
  email: '',
  password:'',
  photo:'',
  
  
})


  const provider = new firebase.auth.GoogleAuthProvider();
 const handleSignIn =() =>{
 firebase.auth().signInWithPopup(provider)
 .then(res =>{
   const {displayName,photoURL,email} = res.user;
    const signedInUser ={
      isSignedIn: true,
      name :displayName,
      email:email,
      photo:photoURL
    }
   setUser(signedInUser);
   console.log(displayName,photoURL,email);
 })
 .catch(error => {
   console.log(error);
 })

 }

  const handleSignOut = () =>{
    firebase.auth().signOut()
    .then(res => {
      const signOutUser ={
        isSignedIn: false,
        name:'',
        email:'',
        photo:'',
        error:'',
        success:false
       
      }
      setUser(signOutUser);
    })
      .catch(error =>{

      })
    }
    
const  handleBlur = (event) =>{
//console.log(event.target.name ,event.target.value);
let isFieldValid = true;

if(event.target.name === 'email'){
 
  isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);

}
if(event.target.name === 'password'){
  const isPasswordValid =event.target.value.length >6;
  const passwordHasNumber = /\d{1}/.test(event.target.value)
  isFieldValid= isPasswordValid && passwordHasNumber;

  }
  if(isFieldValid){
   
   const newUserInfo = {...user};
   newUserInfo[event.target.name] = event.target.value;
   setUser(newUserInfo);

  }
}

const handleSubmit = (event) =>{
  //console.log(user.password,user.email);
  if(newUser && user.name && user.password){
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(res =>{
      const newUserInfo = {...user};
      newUserInfo.error = '';
      newUserInfo.success = true ;
      setUser(newUserInfo);     
      updateUserName(user.name)
    })
    
    
    .catch(error =>{
      // Handle Errors  here.
      const  newUserInfo = {...user}
      newUserInfo.error = error.message;
      newUserInfo.success =false;
      setUser (newUserInfo);
      // ...
    });
  }
 if(!newUser && user.email && user.password)
 firebase.auth().signInWithEmailAndPassword(user.email, user.password)
 .then(res => {
  const newUserInfo = {...user};
  newUserInfo.error = '';
  newUserInfo.success = true ;
  setUser(newUserInfo); 
  console.log('sign in user info', res.user);
 })
 .catch(function(error) {
  const  newUserInfo = {...user}
      newUserInfo.error = error.message;
      newUserInfo.success =false;
      setUser (newUserInfo);
});

 event.preventDefault();
}
 const updateUserName = name =>{
   var user = firebase.auth().currentUser;

     user.updateProfile({
    displayName:name 
   
  })
  .then(res =>{
   console.log('user name updated successfully');
  })
  .catch(function(error) {
   console.log(error);
  });

 }
  
  return (
   <div className="App">

       {
         user.isSignedIn ?  <button onClick ={handleSignOut}>Sign out</button> :
         <button onClick ={handleSignIn}>Sign in</button>
       }
       <br/>
    <button> Log in using Facebook</button>

     {
       user.isSignedIn && <div>
         <p> Welcome ,{user.name}</p>
          <p> Email:{ user.email}</p>
         <img src={user.photo} alt=""></img>
          
         </div>
     }

      <h1> Our own   Authentication</h1>
      <input type ="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor ="newUser">New Users Sign Up </label>
        <form onSubmit={handleSubmit}>  
        {newUser &&<input type ="text" onBlur={handleBlur} name ="name" placeholder ="Name" />}
        <br/>
        <input type ="text" onBlur={handleBlur} name="email" placeholder ="Email" required/>
      <br/>
      <input type ="password" onBlur={handleBlur} name ="password" id ="" placeholder="Password" required/>
      <br/>
      <input type ="submit" value ={ newUser ? 'Sign up' : 'Sign in '}/>
      </form>
        <p style ={{color: 'red'}}> {user.error}</p>
        {user.success &&<p style ={{color: 'green'}}> User {newUser ? 'Created' : 'Log In'} Successfully</p>}
   </div>
);
    }
export default App;
