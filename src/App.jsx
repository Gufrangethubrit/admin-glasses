import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Add from './pages/Add'
import Lists from './pages/Lists'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/login' element={<Login />} />

      <Route path='/admin/*' element={
        <div className='min-h-screen bg-[#0F1115]'>
          <Nav />
          <div className='admin-layout'>
            <Sidebar />
            <main className='admin-main'>
              <Routes>
                <Route path='/' element={<Navigate to='home' replace />} />
                <Route path='home' element={<Home />} />
                <Route path='dashboard' element={<Home />} />
                <Route path='add' element={<Add />} />
                <Route path='lists' element={<Lists />} />
                <Route path='products' element={<Lists />} />
                <Route path='orders' element={<Orders />} />
                <Route path='settings' element={<Settings />} />
                <Route path='*' element={<Navigate to='home' replace />} />
              </Routes>
            </main>
          </div>
        </div>
      } />

      <Route path='*' element={<Navigate to='/admin/home' replace />} />
    </Routes>
  )
}
