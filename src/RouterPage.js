import React from 'react'
import { Routes, Route} from 'react-router-dom'
import App from './App'
import { Homepage } from './Homepage'
import { Login } from './Login'
import { Register } from './Register'

export const RouterPage = () => {
  return (
    <>
        <Routes>
            <Route path='/' element={<Login/>} />
              <Route path='/App' element={<App/>} />
              <Route path='/Register' element={<Register/>} />
            <Route path='/Homepage' element={<Homepage/>} />
        </Routes>
    </>
  )
}