import React from 'react'
import Navbar from '../components/new/Navbar'
import Sidebar from '../components/admin/navigation/Sidebar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default AdminLayout
