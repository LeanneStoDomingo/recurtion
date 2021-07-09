import React from 'react'
import Arrows from '../../icons/Arrows'
import Plus from '../../icons/Plus'
import Notion from '../../icons/Notion'

const Hero = () => {
    return (
        <div className='flex flex-col items-center text-white w-full mt-16'>
            <h1 className='text-5xl'>Recurtion</h1>
            <p className='text-xl font-semibold text-purple-200'>beta</p>
            <div className='flex items-center my-6'>
                <Notion />
                <Plus />
                <Arrows />
            </div>
            <div className='text-lg my-5'>
                Automatically repeat recurring tasks in Notion
            </div>
        </div>
    )
}

export default Hero
