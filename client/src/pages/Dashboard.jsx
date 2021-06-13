import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router'
import TokenContext from '../utils/TokenContext'
import useAuth from '../utils/useAuth'

export const Dashboard = () => {
    const history = useHistory()
    const { token, setToken } = useContext(TokenContext)
    const { checkExp } = useAuth()

    const [errorMessage, setErrorMessage] = useState('')
    const [config] = useState({
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true,
        credentials: 'include'
    })

    const onClick = async () => {
        if (await checkExp()) {
            window.location.href = `http://localhost:5000/notion-oauth?token=${token}`
        } else {
            setErrorMessage('Token(s) aren\'t valid')
        }
    }

    const onLogout = async () => {
        if (await checkExp()) {
            await axios.get('http://localhost:5000/logout', config)
        } else {
            setErrorMessage('Token(s) aren\'t valid')
        }
        setToken('')
        history.push('/')
    }

    const onDelete = async () => {
        if (await checkExp()) {
            await axios.get('http://localhost:5000/delete-account', config)
            setToken('')
            history.push('/')
        } else {
            setErrorMessage('Token(s) aren\'t valid')
        }
    }

    return (
        <>
            {errorMessage}
            <button onClick={onClick}>Notion OAuth</button>
            <button onClick={onLogout}>Logout</button>
            <button onClick={onDelete}>Delete Account</button>
        </>
    )
}
