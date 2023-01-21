import React from "react";
import "./UserProfile.css";

export const UserProfile = (props) => {

  return (
    <>
      <div className="background-container">
        <div style={{ postion: "fixed" }}>
          {/* Why does this trigger Register.js createUsername() function????????? */}

          <div className={"popup"}>
            <div className="popup_content">
              {/* <span className="close" onClick={closeEditProfile}>&times;</span> */}
              <div>
                <div className="pfpdiv">
                  <img
                    className="pfp"
                    src={props.currentUser.picture}
                    alt="Profile Pic"
                  />
                </div>
                <div className={"pfpdivbutton"}>
                  <button>Remove picture</button>
                </div>
              </div>
              <div>
                <span>Name: {props.currentUser.name}</span>
                <button>Edit</button>
              </div>

              <p className="email">Email:{props.currentUser.email} </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
