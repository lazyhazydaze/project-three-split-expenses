import React, { useState } from 'react'
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth, database } from '../firebase'
import './Register.css'
import { Link, useNavigate } from 'react-router-dom'
import { updateProfile } from 'firebase/auth'
import { ref, set } from 'firebase/database'

export const Register = () => {

    //logic states
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [username,setUsername] = useState("")

    //css states
    const [display1,setDisplay1] = useState("showDisplay")
    const [display2,setDisplay2] = useState("hideDisplay")
    const [error,setError] = useState("")

    const navigate = useNavigate()
    
    const handleRegister =(e)=>{
        e.preventDefault();
        

        createUserWithEmailAndPassword(auth,email,password)
            .then((userCredentials)=>{
                // userCredentials.displayName = username
                //sign in is automatic after registeration
                // console.log("entry into createuser");
                setDisplay1("hideDisplay");
                setDisplay2("showDisplay");
            })
            .catch((error)=>{
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
                setError(errorMessage)
            })
    }

    const createUsername = (e) =>{
        e.preventDefault()
        console.log("createusernameran")

        const user = auth.currentUser

     
        set(ref(database, "users/" + user.uid),{
            username: username,
            email: email,
            profilePicture : "",
            currentFriends: [], //doesnt add probably cause its an empty array
        })
        
        updateProfile(user, {
            displayName: username
        })
        .then(()=>{
            setUsername("")
            setEmail("")
            setPassword("")
            navigate("/Login")
        })
    }



  return (
    <>
        <h1>Register Page</h1>
        
            <form onSubmit={(e)=>handleRegister(e)} className={`${display1}`}>
                <input type={"text"} placeholder={"email here"} onChange={(e)=>{setEmail(e.target.value)}}/>
                <input type={"text"} placeholder={"password here"} onChange={(e)=>{setPassword(e.target.value)}}/>
                <br/>
                <input type={"submit"}/>
                <span style={error==""?{display:"none"}:{display:"block", color:"red"}}>{`${error}`}</span>
            </form>

            
            <form onSubmit={(e)=>createUsername(e)} className={`${display2}`}>
                <input type={"text"} placeholder={"username here"} onChange={(e)=>{setUsername(e.target.value)}}/>
                <br/>
                <input type={"submit"}/>
            </form>
        <nav>
            <Link to={"/"}>Back to Home</Link>
        </nav>
    </>
  )
}