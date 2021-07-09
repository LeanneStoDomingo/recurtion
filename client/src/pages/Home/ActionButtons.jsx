import React from 'react'
import Button from '../../components/Button'

const ActionButtons = () => {
    return (
        <div className='flex flex-col items-center bg-white mx-auto my-8 shadow-lg rounded-2xl text-purple-900 py-4 px-8'>
            <h2 className='font-semibold text-xl'>Try it out!</h2>
            <div className='flex mt-3'>
                <Button to='/login' text='Login' />
                <Button to='/signup' text='Signup' className='ml-6' color='secondary' />
            </div>
        </div>
    )
}

export default ActionButtons
