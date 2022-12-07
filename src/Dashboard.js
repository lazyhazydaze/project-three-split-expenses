import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { auth } from './firebase'
import { useNavigate } from 'react-router-dom'
import "./Dashboard.css" 

export const Dashboard = (props) => {
    // const [unsub,setUnsub] = useState("")
    const navigate = useNavigate()
    const [user,setUser] = useState("")
    useEffect(()=>{
        onAuthStateChanged(auth,(user)=>{
            if(user){
                setUser(auth.currentUser)
                // console.log("logged in")
                // console.log("dashboard",user)
            }
            else {
                // console.log("not logged in")
                navigate("/Login")
            }
        })
    },[])//run once on render

  return (
    <>
        <div style={{backgroundColor:"green", marginTop:"0px"}}>
            <h1>DashBoard</h1>
            <div className='ceiling'>
            
                <nav>
                    <Link to={"Homepage"}>Homepage</Link>
                    <Link to={"Friendpage"}>Friends</Link>
                </nav>
            </div>
        </div>
        
        
        <Outlet />
    </>
  )
}
