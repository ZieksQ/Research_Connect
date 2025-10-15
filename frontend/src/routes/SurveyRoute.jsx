import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/new/Navbar'

const SurveyRoute = () => {
  return (
    <section>
        <Navbar />
        <Outlet />
    </section>
  )
}

export default SurveyRoute
