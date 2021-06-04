import React, { useContext, useState } from 'react'
import axios from 'axios'
import TokenContext from '../utils/TokenContext'

const Login = () => {
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
            <div>{errorMessage}</div>

            <div>
                <label>Email</label>
                <input type="email" onChange={updateEmail} value={email} />
            </div>

            <div>
                <label>Password</label>
                <input type="password" onChange={updatePassword} value={password} />
            </div>

            <div>
                <button>Forgot Password?</button>
                <button type="submit">Login</button>
            </div>
        </form>

    )
}

export default Login
