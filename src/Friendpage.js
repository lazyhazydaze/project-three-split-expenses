import { onAuthStateChanged } from 'firebase/auth'
import { child, get, update, ref, onValue} from 'firebase/database'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { database, auth, dbRef } from './firebase'
import "./Friendpage.css"
import { UserContext } from './RouterPage'

export const Friendpage = () => {

    const navigate = useNavigate()
    const [user,setUser] = useState(auth ? auth.currentUser:"")   // this fixes the refresh issue but breaks the friend request display
    
    // const user = auth.currentUser           // shits weird, refresh breaks it, going back to homepage fixes it

    // const user = useContext(UserContext)    //works but breaks on refresh

    
    

    // const user = auth.currentUser
    

    const addfriendwindow = useRef()
    // const [friendName, setFriendName] = useState("")
    const [friendID, setFriendID] = useState("")

    const openAddFriendMenu = () => {
            //more userefs
        const addfriendwindowref = addfriendwindow.current
        addfriendwindowref.classList.add("display")
    }

    const closeAddFriendMenu = () => {
        const addfriendwindowref = addfriendwindow.current
        addfriendwindowref.classList.remove("display")
    }


    
    const sendFriendRequest = (e) =>{
        e.preventDefault()
  
        get(child(dbRef, `users`))
            .then((snapshot)=>{
                console.log(snapshot)
                if(snapshot.exists()){
                    console.log(snapshot.val())
                    //need to add input validation to check if friend exists (snapshot.val() lists all users on database, can filter it to find friendID)
                    update(ref(database, `users/` + friendID),{
                        friendRequestFrom: [user.uid]
                    })
                } else {
                    console.log("No data avail")
                }
            })
            .then(()=>{
                closeAddFriendMenu()
            })

    }

    const [numberOfRequests,setNumberOfRequests] = useState(0)
    const [requestList, setRequestList] = useState([])
    const [requestListUsernames, setRequestListUsernames] = useState([])

    const getCurrentFriendRequests = () => {
        // const requestsRef = dbRef(database, "users/" + user.uid + "/" + "friendRequestFrom")
        // onValue(requestsRef, (snapshot) => {
        //     console.log(snapshot.val())
        //     setRequestList(snapshot.val())
        //     setNumberOfRequests(snapshot.val().length)
        // })
        if(user == null)return
        console.log("user",user)
        console.log("getfrienduseruid",user.uid)
        get(child(dbRef, `users/${user.uid}/friendRequestFrom`)) //why is this breaking????? i want the below code
            .then((snapshot) => {
                console.log("snap",snapshot.val())
                setRequestList(snapshot.val())
                setNumberOfRequests(snapshot.val().length)
            })
                // .then(()=>{
                //     console.log("requestlist",requestList)
                //     requestList.forEach((uid)=>{
                //         get(child(dbRef, `users/${uid}/username`))
                //             .then((username) =>{
                //                 console.log("username",username)
                //                 setRequestListUsernames([...requestListUsernames].push(username))
                //             })
                //     })
                // })
    }
    const pingpongball = false

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
            if(user){
                setUser(auth.currentUser)
                pingpongball = true
            }   
            else {
                navigate("/Login")
            }
        })
        return()=>{
            unsubscribe()
        }
    },[])


    useEffect(()=>{ // how do i get useeffect to run ONLY AFTER the useeffect on top??????????
        getCurrentFriendRequests()
    },[user])
    // if(user !== null){
    //     console.log("friendpageuser",user)
    //     getCurrentFriendRequests()
    // } i need getCurrenFriendRequests() to run once after the function on top

    useEffect(()=>{
            console.log("requestlist",requestList)
                    requestList.forEach((uid)=>{
                        get(child(dbRef, `users/${uid}/username`))
                            .then((username) =>{
                                console.log("username",username.val())
                                let newarr = [...requestListUsernames, username.val()]
                                console.log("newarr",newarr)
                                setRequestListUsernames(newarr)
                            })
                    })
    },[requestList])

    const acceptfriendwindow = useRef()
    const openAcceptRequestWindow= () =>{
        const acceptfriendwindowref = acceptfriendwindow.current
        acceptfriendwindowref.classList.add("display")
    }
    const closeAcceptRequestWindow = () => {
        const acceptfriendwindowref = acceptfriendwindow.current
        acceptfriendwindowref.classList.remove("display")
    }

  return (
    <>
            <div>
                <h2>Friend List</h2>
                <button onClick={openAddFriendMenu}>Add Friend</button>
            </div>

            <div ref={addfriendwindow} className={"addfriend"}>
                Add friend menu
                <span className="close" onClick={closeAddFriendMenu}>&times;</span> 
                <form onSubmit={(e)=>sendFriendRequest(e)}>
                    <input type={"text"} onChange={(e)=>{setFriendID(e.target.value)}} placeholder={"enter UID to add"} />
                    <input type={"submit"}/>
                </form>
            </div>

            <div>
                <h2>Current Friends</h2>
                
                    <span onClick={openAcceptRequestWindow} className='requests'>{`${numberOfRequests} new requests`}</span>
            </div>
            <div ref={acceptfriendwindow} className={"acceptfriend"}>
                <div className='acceptfriend-content'> 
                    Friend Requests
                    <span className="close" onClick={closeAcceptRequestWindow}>&times;</span> 
                    {/* map the friend requests use jsx */}
                    {console.log("List",requestListUsernames)}
                    {requestListUsernames.map((id) => {
                        return <div>
                                    <p>{`${id}`}</p>
                                </div>
                    })}
                </div>
                

            </div>
    </>
  )
}
