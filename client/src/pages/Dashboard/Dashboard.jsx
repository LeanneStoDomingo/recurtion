import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router'
import { TokenContext, useAuth } from '../../utils'
import Button from '../../components/Button'
import Cog from '../../icons/Cog'
import Pencil from '../../icons/Pencil'
import SetupOne from './SetupOne'
import SetupTwo from './SetupTwo'
import SetupThree from './SetupThree'
import Settings from './Settings'

export const Dashboard = () => {
    const history = useHistory()
    const { setToken, config } = useContext(TokenContext)
    const { checkExp } = useAuth()

    const [errorMessage, setErrorMessage] = useState('')
    const [page, setPage] = useState(0)
    const [showSettings, setShowSettings] = useState(false)

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

    const onSetup = () => {
        if (page === 0 || page === 4) {
            setShowSettings(false)
            setPage(1)
        } else {
            setPage(0)
        }
    }

    const onBack = () => {
        setPage(p => p - 1)
    }

    const onNext = () => {
        setPage(p => p + 1)
    }

    const onSettings = () => {
        if (page > 0 && page < 4) {
            setPage(0)
        }
        setShowSettings(s => !s)
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
            <div className='flex justify-between pt-8 max-w-lg mx-auto'>
                <h1>Recurtion<sup className='text-base text-purple-700'>beta</sup></h1>
                <Button text='Logout' onClick={onLogout} />
            </div>

            {errorMessage}

            <div className='flex flex-col max-w-lg mx-auto px-5 my-5'>
                <h2>Recurring Tasks</h2>
                <div className='flex mt-3'>
                    <Button text='Setup' icon={<Pencil />} size='small' onClick={onSetup} />
                    <Button text='Settings' color='secondary' icon={<Cog />} size='small' onClick={onSettings} className='ml-5' />
                </div>

                {showSettings ? <Settings onClose={onSettings} /> : null}

                {page === 1 ? <SetupOne onBack={onBack} onNext={onNext} /> :
                    page === 2 ? <SetupTwo onBack={onBack} onNext={onNext} /> :
                        page === 3 ? <SetupThree onBack={onBack} onNext={onNext} /> : null
                }

            </div>

            <div className='max-w-lg mx-auto px-5 my-5'>
                <h2 className='text-gray-600'>More features coming soon...</h2>
            </div>


            <div className='bg-red-50'>
                <div className='max-w-lg mx-auto px-5'>
                    <h2 className='text-red-900 pt-5'>Danger Zone</h2>
                    <Button text='Delete Account' onClick={onDelete} color='danger' className='my-3' />
                </div>
            </div>
        </>
    )
}
