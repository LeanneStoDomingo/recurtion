import React from 'react'
import { Button } from '../../components'
import { ChevronLeft } from '../../icons'
import { Labels } from '.'

export const SetupThree = ({ onBack, onNext }) => {

    return (
        <div className='bg-purple-50 rounded-2xl shadow-md p-5 m-5'>

            <div className="flex items-start">
                <div className='bg-purple-600 text-purple-50 leading-7 font-bold rounded-full w-8 h-8 text-center flex-shrink-0 align-middle text-xl mr-3'>3</div>
                <div className="flex flex-col text-center">
                    <div>Make sure the property names in your Notion database(s) match the names below. If not, either change the names in Notion or the ones below</div>
                    <Labels className='my-5' onSave={onNext} />
                </div>
            </div>

            <div className='flex flex-row-reverse'>
                <Button text='Done' form='labels-form' type='submit' />
                <Button text='Back' icon={<ChevronLeft />} color='secondary' size='small' className='mr-auto' onClick={onBack} />
            </div>
        </div>
    )
}
