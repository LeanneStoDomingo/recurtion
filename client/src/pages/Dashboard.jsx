import React, { useContext } from 'react'
import TokenContext from '../utils/TokenContext'

export const Dashboard = () => {
    const { token, setToken } = useContext(TokenContext)

    const onClick = () => {
        window.location.href = `http://localhost:5000/notion-oauth?token=${token}`
    }

    const onLogout = () => {
        setToken('')
        // TODO: clear cookie on server
    }

    return (
        <>
            <button onClick={onClick}>Notin OAuth</button>
            <button onClick={onLogout}>Logout</button>
        </>
    )
}
