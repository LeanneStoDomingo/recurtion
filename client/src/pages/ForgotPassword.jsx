import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const updateEmail = (e) => {
        setEmail(e.target.value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage('//TODO')
    }

    return (
        <form onSubmit={onSubmit}>
            <Link to='/login'>Back</Link>

            <div>
                <label>Email</label>
                <input type="email" onChange={updateEmail} value={email} />
            </div>

            <button type="submit">Submit</button>

            <div>{errorMessage}</div>
        </form>
    )
}
