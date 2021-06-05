import axios from 'axios'
import React, { useContext } from 'react'
import TokenContext from '../utils/TokenContext'

export const Dashboard = () => {
    const { token } = useContext(TokenContext)

    const onClick = async () => {
        await axios.get('http://localhost:5000/notion-oauth', { params: { token } })
    }


    return (
        <button onClick={onClick}>Notin OAuth</button>
    )
}
