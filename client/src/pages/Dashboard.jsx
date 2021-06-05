import axios from 'axios'
import React, { useContext } from 'react'
import TokenContext from '../utils/TokenContext'

export const Dashboard = () => {
    const { token, setToken } = useContext(TokenContext)

    const onClick = () => {
        window.location.href = `http://localhost:5000/notion-oauth?token=${token}`
    }

    const onLogout = async () => {
        setToken('')
        await axios.get('http://localhost:5000/logout', { withCredentials: true, credentials: 'include' })
    }

    return (
        <>
            <button onClick={onClick}>Notin OAuth</button>
            <button onClick={onLogout}>Logout</button>
        </>
    )
}
