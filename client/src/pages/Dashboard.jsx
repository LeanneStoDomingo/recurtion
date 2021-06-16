import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router'
import TokenContext from '../utils/TokenContext'
import useAuth from '../utils/useAuth'
import Notion from '../components/Notion'

export const Dashboard = () => {
    const history = useHistory()
    const { setToken, config } = useContext(TokenContext)
    const { checkExp } = useAuth()

    const [errorMessage, setErrorMessage] = useState('')

    const onLogout = async () => {
        const check = await checkExp()
        if (check) {
            await axios.get('http://localhost:5000/logout', config)
        } else {
            setErrorMessage('Token(s) aren\'t valid')
        }
        setToken('')
        history.push('/')
    }

    const onDelete = async () => {
        const check = await checkExp()
        if (check) {
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
            <Notion setErrorMessage={setErrorMessage} />
            <button onClick={onLogout}>Logout</button>
            <button onClick={onDelete}>Delete Account</button>
        </>
    )
}
