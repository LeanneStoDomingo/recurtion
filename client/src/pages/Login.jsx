import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { TokenContext } from '../utils'
import { Link, useHistory, useLocation } from 'react-router-dom'
import Button from '../components/Button'
import Input from '../components/Input'
import Name from '../components/Name'

export const Login = () => {
    const { setToken, config } = useContext(TokenContext)
    const location = useLocation()
    const history = useHistory()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [okMessage, setOkMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()

        let data
        try {
            const res = await axios.post('http://localhost:5000/login', { email, password }, config)
            data = res.data
        } catch (err) {
            return setErrorMessage(err.message)
        }

        if (!data.ok) {
            return setErrorMessage(data.message)
        }

        setToken(data.accessToken)
        history.push('/dashboard')
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const ok = params.get('ok')
        setOkMessage(() => {
            if (ok === 'true') {
                return 'Email was verified!'
            } else if (ok === 'false') {
                return 'Something went wrong!'
            } else {
                return ''
            }
        })
    }, [location.search])

    return (
        <div className='bg-purple-600 min-h-screen flex flex-col items-center mobile-height'>
            <Name className='my-16' />
            <div className='bg-purple-50 rounded-2xl shadow-lg p-5'>
                <form onSubmit={onSubmit} className='flex flex-col'>
                    <h2 className='text-center text-purple-900 mb-3'>Log In</h2>
                    <div>{location.state?.message}</div>
                    <div>{okMessage}</div>
                    <div className='text-center'>Don't have an account? <Link to='/signup' className='text-purple-700 focus-visible:outline-black hover:underline'>Sign Up</Link></div>
                    <Input label='Email' type='email' update={setEmail} value={email} className='mt-5' />
                    <Input label='Password' type='password' update={setPassword} value={password} className='mt-3' />
                    <div className='flex flex-row-reverse justify-between mt-5'>
                        <Button type="submit" text='Log In' />
                        <Button to='/forgot-password' text='Forgot Password?' color='noneDark' />
                    </div>
                    <div>{errorMessage}</div>
                </form>
            </div>
        </div>

    )
}
