import React from 'react'
import { Arrows, Plus, Notion } from '../../icons'
import { Name } from '../../components'

export const Hero = () => {
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
