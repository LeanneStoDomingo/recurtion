import axios from 'axios'
import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { Input, Button, Name } from '../components'

export const ResetPassword = () => {
    const { token } = useParams()
    const history = useHistory()

    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()

        let data
        try {
            const res = await axios.post('http://localhost:5000/password-confirmation', { token, password1, password2 })
            data = res.data
        } catch (err) {
            return setErrorMessage(err.message)
        }

        if (!data.ok) {
            return setErrorMessage(data.message)
        }

        history.push('/login', { message: data.message })
    }


    return (
        <div className='bg-purple-600 min-h-screen flex flex-col items-center mobile-height'>
            <Name className='my-16' />
            <div className='bg-purple-50 rounded-2xl shadow-lg p-5 mb-16'>
                <form onSubmit={onSubmit} className='flex flex-col'>
                    <h2 className='text-center text-purple-900'>Reset Password</h2>
                    <Input label='New Password' type='password' update={setPassword1} value={password1} className='mt-5' />
                    <Input label='Retype Password' type='password' update={setPassword2} value={password2} className='mt-3' />
                    <Button text='Reset Password' type='submit' className='ml-auto mt-5' />
                    <div>{errorMessage}</div>
                </form>
            </div>
        </div>
    )
}
