import { onAuthStateChanged, signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from './firebase'
import { useNavigate } from 'react-router-dom'
import { ref, set } from 'firebase/database'

export const Homepage = () => {
    useEffect(()=>{
        onAuthStateChanged(auth,(user)=>{
            if(user){
                setUsername(user.displayName)
            } else {
                navigate("/")
            }
            
        })
        
    },[])//run once on render

    const [username,setUsername] = useState("")

    const handleLogout = () =>{
        signOut(auth)
            .then(()=>{
                navigate("/")
            })
            .catch((error)=>{
                console.log("sign out fail",error)
            })
    }

    const navigate = useNavigate()

    const editProfile = () =>{
        //popup windows to be show for editing of profile
        // can edit username and profile pic
    }

    const addFriend = () =>{
        //finish profile setup first
        set(ref(auth))
    }

  return (
    <>  
        <button onClick={handleLogout}>Logout</button>
        <div>
            <h2>Hello {`${username}`}</h2>
            <button onClick={editProfile}>edit profile</button>
            
        </div>
        <div>
            <h2>Friend List</h2>
            <button onClick={addFriend}>Add Friend</button>
        </div>
    </>
  )
}
