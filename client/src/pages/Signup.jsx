import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../components/Input'
import Button from '../components/Button'
import Name from '../components/Name'

export const Signup = () => {
    const [email, setEmail] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [message, setMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()

        let data
        try {
            const res = await axios.post('http://localhost:5000/signup', { email, password1, password2 })
            data = res.data
        } catch (err) {
            return setMessage(err.message)
        }

        return setMessage(data.message)
    }

    return (
        <div className='bg-purple-600 min-h-screen flex flex-col items-center mobile-height'>
            <Name className='my-16' />
            <div className='bg-purple-50 rounded-2xl shadow-lg p-5 mx-7 mb-16'>
                <form onSubmit={onSubmit} className='flex flex-col'>
                    <div className='text-center'>Already have an account? <Link to='/login' className='text-purple-700 focus-visible:outline-white hover:underline'>Log In</Link></div>
                    <Input label='Email' type='email' update={setEmail} value={email} className='mt-5' />
                    <Input label='Password' type='password' update={setPassword1} value={password1} className='mt-3' />
                    <Input label='Retype Password' type='password' update={setPassword2} value={password2} className='mt-3' />
                    <Button type="submit" text='Sign Up' className='ml-auto mt-5' />
                    <div>{message}</div>
                </form>
            </div>
        </div>
    )
}
