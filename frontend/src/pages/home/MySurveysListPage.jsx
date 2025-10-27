import React from 'react'
import MySurveyList from '../../components/sections/MySurveyList';

// List of Created Survey of User
const MySurveysListPage = () => {
  return (
    <section>
        <h3 className='flex items-center gap-1 text-md font-medium'>My Survey </h3>
        <div className='lg:h-48 overflow-scroll'>
          <MySurveyList />
        </div>
    </section>
  )
}

export default MySurveysListPage
