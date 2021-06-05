import axios from 'axios'
import React, { useContext, useState } from 'react'
import TokenContext from '../utils/TokenContext'
import useAuth from '../utils/useAuth'

export const Dashboard = () => {
    const { token, setToken } = useContext(TokenContext)
    const { checkExp } = useAuth()
    const [errorMessage, setErrorMessage] = useState('')

    const onClick = async () => {
        if (await checkExp()) {
            window.location.href = `http://localhost:5000/notion-oauth?token=${token}`
        } else {
            setErrorMessage('Token(s) aren\'t valid')
        }
    }

    const onLogout = async () => {
        setToken('')
        await axios.get('http://localhost:5000/logout', { withCredentials: true, credentials: 'include' })
    }

    return (
        <>
            {errorMessage}
            <button onClick={onClick}>Notin OAuth</button>
            <button onClick={onLogout}>Logout</button>
        </>
    )
}
