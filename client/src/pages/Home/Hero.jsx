import React from 'react'
import Arrows from '../../icons/Arrows'
import Plus from '../../icons/Plus'
import Notion from '../../icons/Notion'
import Name from '../../components/Name'

const Hero = () => {
    return (
        <div className='flex flex-col items-center text-white w-full mt-16'>
            <Name />
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
