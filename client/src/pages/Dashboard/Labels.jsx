import { axios } from '../../utils'
import React, { useContext, useEffect, useState } from 'react'
import { Input } from '../../components'
import { TokenContext, useAuth } from '../../utils'

export const Labels = ({ onSave, toggle, ...props }) => {
    const { config } = useContext(TokenContext)
    const { checkExp } = useAuth()

    const [checkbox, setCheckbox] = useState('')
    const [date, setDate] = useState('')
    const [recurInterval, setRecurInterval] = useState('')

    useEffect(() => {
        (async () => {
            const { data } = await axios.get('/dashboard-info', config)

            // if (!data.ok) return setErrorMessage(data.message)

            setCheckbox(data.checkbox)
            setDate(data.date)
            setRecurInterval(data.interval)
        })()
    }, [config, /* setErrorMessage */])

    const onSubmit = async (e) => {
        e.preventDefault()

        const body = {
            checkbox,
            date,
            interval: recurInterval,
            invalid: 'Invalid format',
            toggle
        }

        const check = await checkExp()

        if (check) {
            const { data } = await axios.post('/set-configuration', body, config)
            if (data) {

            }
            // setErrorMessage(data.message || 'Could not reach server')
        }

        if (typeof onSave === 'function') {
            onSave()
        }
    }

    return (
        <form {...props} onSubmit={onSubmit} id='labels-form'>
            <Input label='Checkbox' update={setCheckbox} value={checkbox} placeholder='Done' />
            <Input label='Date' update={setDate} value={date} placeholder='Due Date' className='mt-3' />
            <Input label='Recur Interval' update={setRecurInterval} value={recurInterval} placeholder='Recur Interval' className='mt-3' />
        </form>
    )
}