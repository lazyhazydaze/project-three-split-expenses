import React, { createContext, useContext, useState } from 'react'
import { Routes, Route} from 'react-router-dom'
import App from './App'
import { Homepage } from './Homepage'
import { Login } from './Login'
import { Register } from './components/Register'
import { Dashboard } from './Dashboard'
import { Friendpage } from './Friendpage'

export const UserContext = createContext()

export const RouterPage = () => {

  // const [contextuser,setContextuser] = useState("")

  return (
    <>
      {/* <UserContext.Provider value = {contextuser}> */}
        <Routes>
          <Route path='/Login' element={<Login/>} />
          <Route path='/Register' element={<Register/>} />
          
          
            <Route path='/' element={<Dashboard/>}>
              <Route path='/App' element={<App/>} />
              <Route path='/Homepage' element={<Homepage/>} />
              <Route path='/Friendpage' element={<Friendpage/>}/>
            </Route>
          
        </Routes>
      {/* </UserContext.Provider> */}
    </>
  )
}