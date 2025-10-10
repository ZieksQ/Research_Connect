import React from 'react'
import Navbar from '../components/new/Navbar'
import { Outlet } from 'react-router-dom'

const RootRoute = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default RootRoute
