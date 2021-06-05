import axios from 'axios'
import React, { useState } from 'react'

export const Signup = () => {
    const [email, setEmail] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [message, setMessage] = useState('')

    const updateEmail = (e) => {
        setEmail(e.target.value)
    }

    const updatePassword1 = (e) => {
        setPassword1(e.target.value)
    }

    const updatePassword2 = (e) => {
        setPassword2(e.target.value)
    }

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
        <form onSubmit={onSubmit}>
            <div>{message}</div>

            <div>
                <label>Email</label>
                <input type="email" onChange={updateEmail} value={email} />
            </div>

            <div>
                <label>Password</label>
                <input type="password" onChange={updatePassword1} value={password1} />
            </div>

            <div>
                <label>Retype Password</label>
                <input type="password" onChange={updatePassword2} value={password2} />
            </div>

            <button type="submit">Signup</button>
        </form>
    )
}
