import axios from 'axios'
import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router'

export const ResetPassword = () => {
    const { token } = useParams()
    const history = useHistory()

    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

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
        <form onSubmit={onSubmit}>
            <div>
                <label>New Password</label>
                <input type="password" onChange={updatePassword1} value={password1} />
            </div>

            <div>
                <label>Retype Password</label>
                <input type="password" onChange={updatePassword2} value={password2} />
            </div>

            <button type="submit">Reset Password</button>

            <div>{errorMessage}</div>
        </form>
    )
}
