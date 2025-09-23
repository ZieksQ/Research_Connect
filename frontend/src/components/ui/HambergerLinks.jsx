import React from 'react'

const HambergerLinks = ({icon, name, link}) => {
  return (
    <a href={link} className='flex items-center gap-2 rounded-md p-2 hover:bg-gray-200 active:bg-gray-300 '>
        {/* Add New Button */}
        <svg xmlns={icon.xmlns} viewBox={icon.viewBox} className={`size-${icon.size}`}>
            <path d={icon.d}/>
        </svg>
        <span>{name}</span>
    </a>

    
  )
}

export default HambergerLinks
