import { onAuthStateChanged, updateProfile } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { auth, database, dbRef, storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { child, onValue, ref, remove, update } from "firebase/database";
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
  const [photoName, setPhotoName] = useState("");
  const [user, setUser] = useState("");
  // const user = useContext(UserContext) // shit doesnt persist across page refresh
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName);
        setEmail(user.email);
        setUser(auth.currentUser);
        onValue(
          child(dbRef, `users/${user.uid}/profilePicture`),
          (snapshot) => {
            if (snapshot.val()) {
              setPhotoURL(snapshot.val());
            } else {
              setPhotoURL(null);
            }
          }
        );
      } else {
        navigate("/Login");
      }
    });
  }, []); //run once on render

  const navigate = useNavigate();

  const popupwindow = useRef();
  const uploadimagewindow = useRef();

  const editProfile = () => {
    //popup windows to be show for editing of profile
    // can edit username and profile pic
    const popupwindowref = popupwindow.current;
    popupwindowref.style.display = "block";
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
            setPhotoURL(photoURL);
            update(ref(database, "users/" + user.uid), {
              profilePicture: user.photoURL,
            });
          })
          .then(() => {
            closeUploadImageForm();
            closeEditProfile();
            setPhotoName("");
          });
        // })
      });
    });
  };

  const removeProfilePicture = () => {
    updateProfile(user, {
      photoURL: "",
    });
    remove(ref(database, "users/" + user.uid + "/profilePicture"));
  };

  const [newUsername, setNewUsername] = useState("");

  const editusernamewindow = useRef();
  const openEditUsername = () => {
    const editusernamewindowref = editusernamewindow.current;
    editusernamewindowref.classList.add("display");
  };
  const closeEditUsername = () => {
    const editusernamewindowref = editusernamewindow.current;
    editusernamewindowref.classList.remove("display");
  };

  const editUsername = (e) => {
    e.preventDefault();
    if (newUsername.length == 0) return;

    const updates = {};
    updates[`users/${user.uid}/username`] = newUsername;
    update(ref(database), updates);

    updateProfile(auth.currentUser, {
      displayName: newUsername,
    });

    closeEditProfile();
    closeEditUsername();
  };

  return (
    <>
      <div style={{ postion: "fixed" }}>
        {/* Why does this trigger Register.js createUsername() function????????? */}

        <div>
          <img
            src={
              photoURL
                ? `${photoURL}`
                : "https://media.istockphoto.com/id/1214428300/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=vftMdLhldDx9houN4V-g3C9k0xl6YeBcoB_Rk6Trce0="
            }
          />
          <h2>Hello {`${username}`}</h2>
          <button onClick={editProfile}>show profile</button>
        </div> */}

        <div ref={popupwindow} className={"popup"}>
          <div className="popup_content">
            {/* <span className="close" onClick={closeEditProfile}>&times;</span> */}
            <div>
              <div className="pfpdiv">
                <img
                  onClick={displayUploadImageForm}
                  className="pfp"
                  src={
                    photoURL == null
                      ? "https://media.istockphoto.com/id/1214428300/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=vftMdLhldDx9houN4V-g3C9k0xl6YeBcoB_Rk6Trce0="
                      : `${photoURL}`
                  }
                />
              
              </div>
              <div className={"pfpdivbutton"}>
              <button
                  style={
                    photoURL == null ? { display: "none" } : { display: "block" }
                  }
                  onClick={removeProfilePicture}
                >
                  Remove picture
                </button>
              </div>
            </div>
           
            
            
            {/* <br /> */}
            <p className="friendid">Your friendID: {`${user.uid}`}</p>
            
            <div>
              <span>Username: {`${username}`}</span>
              <img src="https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png" className="edit" onClick={openEditUsername}/>
            </div>

            <div ref={editusernamewindow} className={"editusernamewindow"}>
                Input new username
                <span className="close" onClick={closeEditUsername}>&times;</span>
                  <form onSubmit={(e)=>{editUsername(e)}}>
                    <input type={"text"} onChange={(e)=>{setNewUsername(e.target.value)}}></input>
                    <input type={"submit"}></input>
                  </form>
            </div>
            

            <p className="email">Registered Email: {`${email}`}</p>

            <div ref={uploadimagewindow} className={"uploadImageForm"}>
              <span>choose your picture</span>
              <span className="close" onClick={closeUploadImageForm}>
                &times;
              </span>
              <form
                onSubmit={(e) => {
                  uploadImage(e);
                }}
              >
                <input
                  type={"file"}
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    setPhotoName(e.target.value);
                  }}
                  value={photoName}
                />
                <input type={"submit"} />
              </form>
            </div>

            <div ref={editusernamewindow} className={"editusernamewindow"}>
              Input new username
              <span className="close" onClick={closeEditUsername}>
                &times;
              </span>
              <form
                onSubmit={(e) => {
                  editUsername(e);
                }}
              >
                <input
                  type={"text"}
                  onChange={(e) => {
                    setNewUsername(e.target.value);
                  }}
                ></input>
                <input type={"submit"}></input>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
