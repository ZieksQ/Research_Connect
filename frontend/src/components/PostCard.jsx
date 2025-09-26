import React, { useEffect, useRef, useState } from 'react'

// Card Component for Survery Post's 
const PostCard = () => {

  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState('0px');
  const contentRef = useRef(null);

  useEffect(() => {
    if (expanded) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  })

  return (
    <div>
      {/* Title and Expand/Compress Button */}
      <header className='flex justify-between'> 
        <h3 className='text-lg font-bold'>Hello World!</h3>
        <button onClick={() => setExpanded(!expanded)}>{expanded ? "Show Less" : "More"}</button>
      </header>

      {/* Author, Tags and Description */}
      <div>
        <h6 className='text-sm text-gray-500 font-semibold'>ZieksQ - BSIT</h6>
        <span className='text-sm text-white bg-gray-400'>Research</span>
        <p
        ref={contentRef} 
        style={{ height }}
        className='transition-all duration-500 ease-in-out overflow-hidden'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime odio veritatis assumenda corrupti quia sapiente, officiis in? Quia perspiciatis neque tempore vero officiis, nulla est, ea, non dolores expedita delectus.</p>
      </div>

      {/* Time, Target and Take Survey Button */}
      <div className='grid grid-cols-4'>
        <p className='cols-span-1'>6:06PM</p>
        <p className='col-span-2'>All Students</p>
        <button className='cols-span-4'>Take Survey</button>
      </div>
    </div>
  )
}

export default PostCard
