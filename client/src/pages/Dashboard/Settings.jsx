import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Button from '../../components/Button'
import Switch from '../../components/Switch'
import { TokenContext, useAuth } from '../../utils'
import Labels from './Labels'

const Settings = ({ onClose }) => {
    const { config } = useContext(TokenContext)
    const { checkExp } = useAuth()

    const [workspaceName, setWorkspaceName] = useState('')
    const [workspaceIcon, setWorkspaceIcon] = useState('')
    const [toggle, setToggle] = useState(false)

    const onRevoke = async () => {
        const check = await checkExp()
        if (check) {
            const { data } = await axios.get('http://localhost:5000/revoke-notion', config)

            if (!data.ok) {

            }

            // setErrorMessage(data.message || 'Couldn\'t reach server')
        } else {
            // setErrorMessage('Token(s) aren\'t valid')
        }
    }

    useEffect(() => {
        (async () => {
            const { data } = await axios.get('http://localhost:5000/dashboard-info', config)
            // checkbox, date, interval, invalid, workspaceName, workspaceIcon, recurIntegration

            // if (!data.ok) return setErrorMessage(data.message)

            setWorkspaceName(data.workspaceName)
            setWorkspaceIcon(data.workspaceIcon)
            setToggle(data.recurIntegration)
        })()
    }, [config, /* setErrorMessage */])

    return (
        <div className='bg-purple-50 rounded-2xl shadow-md p-5 m-5 flex flex-col'>
            <div className='flex items-center'>
                <h3 className='text-lg mr-3'>Workspace: </h3>
                <p>{workspaceIcon} {workspaceName}</p>
            </div>
            <div className='flex items-center'>
                <h3 className='text-lg mr-3'>Turn Integration On/Off: </h3>
                <Switch setToggle={setToggle} toggle={toggle} />
            </div>
            <Button onClick={onRevoke} text='Revoke Notion Authorization' color='secondary' className='self-start' />

            <Labels onSave={onClose} toggle={toggle} />
            <div className='flex flex-row-reverse justify-between'>
                <Button text='Save' form='labels-form' type='submit' />
                <Button text='Cancel' color='secondary' onClick={onClose} />
            </div>
        </div>
    )
}

export default Settings
