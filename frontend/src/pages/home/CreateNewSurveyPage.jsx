import React from 'react'
import { useNavigate } from 'react-router-dom'

const CreateNewSurveyPage = () => {

    const navigate = useNavigate();

  return (
    <section className='w-full bg-white border border-gray-400 rounded'>
        <div className='flex justify-between items-center px-4 py-2'>
            <h3>Create your own survey <span className='cursor-pointer'>ⓘ</span></h3>
            <button className='btn' onClick={() => navigate('/form/new')}>
                Create Survey
            </button>
        </div>
    </section>
  )
}

export default CreateNewSurveyPage
