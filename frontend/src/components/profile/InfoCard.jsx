import React from 'react'

const InfoCard = ({Icon, Title, Value, Color}) => {
  return (
    <div className='p-2 bg-secondary-background/50 rounded flex items-center gap-2'>
      <div className={`${Color} size-10 center-items rounded text-white`}>
        {Icon}
      </div>
      <div className='flex flex-col leading-tight'>   
        <p className='text-sm text-text-secondary font-normal'>{Title}</p>
        <span className='text-sm font-medium'>{Value}</span>
      </div>
    </div>
  )
}

export default InfoCard
