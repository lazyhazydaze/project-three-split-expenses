import React, { createContext } from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import { UserProfile } from "./components/UserProfile";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Dashboard } from "./components/Dashboard";
import { Friendpage } from "./components/Friendpage";

export const UserContext = createContext();

export const RouterPage = () => {
  // const [contextuser,setContextuser] = useState("")

  return (
    <>
      {/* <UserContext.Provider value = {contextuser}> */}
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />

        <Route path="/" element={<Dashboard />}>
          <Route path="/App" element={<App />} />
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/Friendpage" element={<Friendpage />} />
        </Route>
      </Routes>
      {/* </UserContext.Provider> */}
    </>
  );
};
