import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MdInfoOutline, MdAdd } from 'react-icons/md'

const CreateNewSurveyPage = () => {
    const navigate = useNavigate();

  return (
    <section className='w-full bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6'>
        <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
            <div className="flex items-center gap-2">
                <h3 className='text-lg font-semibold text-gray-900'>Create your own survey</h3>
                <div className="tooltip" data-tip="Start a new research study or poll">
                    <MdInfoOutline className='text-gray-400 cursor-help text-lg' />
                </div>
            </div>
            <button 
                className='btn bg-custom-blue border-custom-blue text-white hover:bg-blue-800 hover:border-blue-800 btn-sm sm:btn-md w-full sm:w-auto gap-2' 
                onClick={() => navigate('/form/new')}
            >
                <MdAdd className="text-lg" />
                Create Survey
            </button>
        </div>
    </section>
  )
}

export default CreateNewSurveyPage
