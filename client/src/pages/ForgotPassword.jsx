import axios from 'axios'
import React, { useState } from 'react'
import { Input, Button, Name } from '../components'
import { ChevronLeft } from '../icons'

export const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()

        let data
        try {
            const res = await axios.post('http://localhost:5000/forgot-password', { email })
            data = res.data
        } catch (err) {
            return setMessage(err.message)
        }

        return setMessage(data.message)
    }

    return (
        <div className='bg-purple-600 min-h-screen flex flex-col items-center mobile-height'>
            <Name className='my-16' />
            <div className='bg-purple-50 rounded-2xl shadow-lg p-5 mb-16'>
                <form onSubmit={onSubmit} className='flex flex-col'>

                    <h2 className='text-center text-purple-900'>Forgot Password</h2>

                    <Input label='Email' type='email' update={setEmail} value={email} className='my-8' />

                    <div className='flex flex-row-reverse justify-between'>
                        <Button type='submit' text='Submit' />
                        <Button to='/login' text='Back' icon={<ChevronLeft />} color='secondary' size='small' />
                    </div>

                    <div>{message}</div>
                </form>
            </div>
        </div>
    )
}
