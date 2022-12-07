import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

export const Login = () => {


    useEffect(()=>{
        const user = auth.currentUser
        if(user && user.displayName != null){
            console.log("auto routed")
            navigate("/Homepage")
        }
    },[])// tests

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()
        //import firebase first
        signInWithEmailAndPassword(auth,email,password)
            .then((userCredential)=>{
                console.log("Login page navigated")
                navigate("/Homepage")
            })
            .catch((error)=>{
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode)
                console.log(errorMessage)
            })
    }

  return (
    <>
        <h1>Login Page</h1>

        <form onSubmit={(e)=>handleLogin(e)}>
            <input type={"text"} placeholder={"Email"} onChange={(e)=>{setEmail(e.target.value)}}/>
            <br/>
            <input type={"text"} placeholder={"Password"} onChange={(e)=>{setPassword(e.target.value)}}/>
            <br/>
            <input type={"submit"}/>
        </form>
        <nav>
            <Link to={"/App"}>to App</Link>
            <Link to={"/Register"}>Register</Link>
        </nav>

    </>
    
  )
}