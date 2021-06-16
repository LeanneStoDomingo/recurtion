import axios from 'axios'
import React, { useContext, useState } from 'react'
import { TokenContext, useAuth } from '../utils'

const Notion = ({ setErrorMessage }) => {
    const { token, config } = useContext(TokenContext)
    const { loading, isAuth, checkExp } = useAuth()

    const [checkbox, setCheckbox] = useState('')
    const [date, setDate] = useState('')
    const [recurInterval, setRecurInterval] = useState('')
    const [invalid, setInvalid] = useState('')

    const onClick = async () => {
        if (!loading && isAuth) {
            window.location.href = `http://localhost:5000/notion-oauth?token=${token}`
        } else {
            setErrorMessage('Token(s) aren\'t valid')
        }
    }

    const onRevoke = async () => {
        const check = await checkExp()
        if (check) {
            const { data } = await axios.get('http://localhost:5000/revoke-notion', config)

            if (!data.ok) return setErrorMessage(data.message || 'Couldn\'t reach server')

            setErrorMessage(data.message)
        } else {
            setErrorMessage('Token(s) aren\'t valid')
        }
    }

    const changeCheckbox = (e) => {
        setCheckbox(e.target.value)
    }

    const changeDate = (e) => {
        setDate(e.target.value)
    }

    const changeRecurInterval = (e) => {
        setRecurInterval(e.target.value)
    }

    const changeInvalid = (e) => {
        setInvalid(e.target.value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        const body = {
            checkbox,
            date,
            interval: recurInterval,
            invalid
        }

        const check = await checkExp()

        if (check) {
            const { data } = await axios.post('http://localhost:5000/set-configuration', body, config)
            setErrorMessage(data.message || 'Could not reach server')
        }
    }
    return (
        <div>
            <button onClick={onClick}>Notion OAuth</button>
            <button onClick={onRevoke}>Revoke Notion Authorization</button>

            <form onSubmit={onSubmit}>

                <div>
                    <label>Checkbox</label>
                    <input onChange={changeCheckbox} value={checkbox} placeholder='Done' />
                </div>

                <div>
                    <label>Date</label>
                    <input onChange={changeDate} value={date} placeholder='Due Date' />
                </div>

                <div>
                    <label>Recur Interval</label>
                    <input onChange={changeRecurInterval} value={recurInterval} placeholder='Recur Interval' />
                </div>

                <div>
                    <label>Invalid message</label>
                    <input onChange={changeInvalid} value={invalid} placeholder='Invalid format' />
                </div>

                <button type="submit">Save</button>
            </form>
        </div>
    )
}

export default Notion
