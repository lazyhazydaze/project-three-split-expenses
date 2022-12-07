import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import React, {useEffect, useRef, useState } from "react";
import { auth, database, storage, } from "../firebase";
import { useNavigate, } from "react-router-dom";
import { ref, update } from "firebase/database";
import {
  getDownloadURL,
  ref as storageref,
  uploadBytes,
} from "firebase/storage";
import "./UserProfile.css";

export const UserProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [user, setUser] = useState("");
  // const user = useContext(UserContext) // shit doesnt persist across page refresh
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // console.log("homepage",user)
      if (user) {
        // console.log("logged in")
        setUsername(user.displayName);
        setEmail(user.email);
        setPhotoURL(user.photoURL);
        setUser(auth.currentUser);
      } else {
        // console.log("not logged in")
        // unsubAuthStateChanged()
        navigate("/Login");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []); //run once on render

  // const unsubAuthStateChanged = onAuthStateChanged(auth,(user)=>{
  //     if(user){
  //         // console.log("logged in")
  //         setUsername(user.displayName)
  //         setEmail(user.email)
  //         setPhotoURL(user.photoURL)
  //         setUser(auth.currentUser)
  //     }
  //     else {
  //         // console.log("not logged in")
  //         unsubAuthStateChanged()
  //         navigate("/Login")
  //     }
  // })

  // const setUnsub = useOutletContext()
  // useEffect(()=>{
  //     setUnsub(unsubAuthStateChanged)
  // },[unsubAuthStateChanged])

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // unsubAuthStateChanged()
        navigate("/Login");
      })
      .catch((error) => {
        console.log("sign out fail", error);
      });
  };

  const navigate = useNavigate();

  const popupwindow = useRef();
  const uploadimagewindow = useRef();

  const editProfile = () => {
    //popup windows to be show for editing of profile
    // can edit username and profile pic
    const popupwindowref = popupwindow.current;
    // popupwindowref.classList.add("testclass")
    // popupwindowref.children[0].classList.add("testclass")
    popupwindowref.style.display = "block";
    console.log(photoURL);
  };

  const closeEditProfile = () => {
    const popupwindowref = popupwindow.current;
    popupwindowref.style.display = "none";
  };

  const displayUploadImageForm = () => {
    const uploadimagewindowref = uploadimagewindow.current;
    uploadimagewindowref.classList.add("display");
  };

  const closeUploadImageForm = () => {
    const uploadimagewindowref = uploadimagewindow.current;
    uploadimagewindowref.classList.remove("display");
  };

  const [file, setFile] = useState(null);

  const uploadImage = (e) => {
    e.preventDefault();
    const profilePicRef = storageref(
      storage,
      `userdata/${username}/profilePicture`
    );
    uploadBytes(profilePicRef, file).then((snapshot) => {
      //set auth user.photoURL to storage picture url
      getDownloadURL(snapshot.ref).then((URL) => {
        updateProfile(user, {
          photoURL: URL,
        })
          .then(() => {
            update(ref(database, "users/" + user.uid), {
              profilePicture: user.photoURL,
            });
          })
          .then(() => {
            closeUploadImageForm();
            closeEditProfile();
          });
        // })
      });
    });
  };

  const removeProfilePicture = () => {
    updateProfile(user, {
      photoURL: "",
    });
  };

  const editUsername = () => {};

  // const addfriendwindow = useRef()
  // // const [friendName, setFriendName] = useState("")
  // const [friendID, setFriendID] = useState("")

  // const openAddFriendMenu = () => {
  //         //more userefs
  //     const addfriendwindowref = addfriendwindow.current
  //     addfriendwindowref.classList.add("display")
  // }

  // const closeAddFriendMenu = () => {
  //     const addfriendwindowref = addfriendwindow.current
  //     addfriendwindowref.classList.remove("display")
  // }

  // const sendFriendRequest = (e) =>{
  //     e.preventDefault()

  //     get(child(dbRef, `users`))
  //         .then((snapshot)=>{
  //             console.log(snapshot)
  //             if(snapshot.exists()){
  //                 console.log(snapshot.val())
  //                 //need to add input validation to check if friend exists (snapshot.val() lists all users on database, can filter it to find friendID)
  //                 update(ref(database, `users/` + friendID),{
  //                     friendRequestFrom: [user.uid]
  //                 })
  //             } else {
  //                 console.log("No data avail")
  //             }
  //         })
  //         .then(()=>{
  //             closeAddFriendMenu()
  //         })

  // }

  return (
    <>
      <div style={{ postion: "fixed" }}>
        {/* Why does this trigger Register.js createUsername() function????????? */}
        <button onClick={handleLogout}>Logout</button>

        <div>
          <img
            src={
              photoURL == null
                ? "https://media.istockphoto.com/id/1214428300/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=vftMdLhldDx9houN4V-g3C9k0xl6YeBcoB_Rk6Trce0="
                : `${photoURL}`
            }
          />
          <h2>Hello {`${username}`}</h2>
          <button onClick={editProfile}>edit profile</button>
        </div>

        <div ref={popupwindow} className={"popup"}>
          <div className="popup_content">
            <span className="close" onClick={closeEditProfile}>
              &times;
            </span>
            <img
              onClick={displayUploadImageForm}
              className="pfp"
              src={
                photoURL == null
                  ? "https://media.istockphoto.com/id/1214428300/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=vftMdLhldDx9houN4V-g3C9k0xl6YeBcoB_Rk6Trce0="
                  : `${photoURL}`
              }
            />
            <br />
            <button
              style={
                photoURL == null ? { display: "none" } : { display: "block" }
              }
              onClick={removeProfilePicture}
            >
              Remove picture
            </button>
            <br />
            <span>Username: {`${username}`}</span>
            <span className="edit" onClick={editUsername}>
              Edit
            </span>
            <p>Registered Email: {`${email}`}</p>

            <div ref={uploadimagewindow} className={"uploadImageForm"}>
              <span>choose your picture</span>
              <span className="close" onClick={closeUploadImageForm}>
                &times;
              </span>
              <form onSubmit={(e) => uploadImage(e)}>
                <input
                  type={"file"}
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                />
                <input type={"submit"} />
              </form>
            </div>
          </div>
        </div>

        {/* <div>
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
            </div> */}
      </div>
    </>
  );
};
