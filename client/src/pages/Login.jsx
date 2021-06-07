import React, { useContext, useState } from 'react'
import axios from 'axios'
import TokenContext from '../utils/TokenContext'
import { Link } from 'react-router-dom'

export const Login = () => {
    const { setToken } = useContext(TokenContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const updateEmail = (e) => {
        setEmail(e.target.value)
    }

    const updatePassword = (e) => {
        setPassword(e.target.value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        let data
        try {
            const res = await axios.post('http://localhost:5000/login', { email, password }, { withCredentials: true, credentials: 'include' })
            data = res.data
        } catch (err) {
            return setErrorMessage(err.message)
        }

        if (!data.ok) {
            return setErrorMessage(data.message)
        }

        setToken(data.accessToken)
    }

    return (
        <form onSubmit={onSubmit}>
            <div>Don't have an account? <Link to='/signup'>Sign Up</Link></div>

            <div>
                <label>Email</label>
                <input type="email" onChange={updateEmail} value={email} />
            </div>

            <div>
                <label>Password</label>
                <input type="password" onChange={updatePassword} value={password} />
            </div>

            <div>
                <Link to='/forgot-password'>Forgot Password?</Link>
                <button type="submit">Log In</button>
            </div>

            <div>{errorMessage}</div>
        </form >

    )
}
