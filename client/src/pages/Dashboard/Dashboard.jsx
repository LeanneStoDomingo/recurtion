import { axios } from '../../utils'
import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router'
import { TokenContext, useAuth } from '../../utils'
import { Button } from '../../components'
import { Cog, Pencil } from '../../icons'
import { SetupOne, SetupTwo, SetupThree, Settings } from '.'

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
            await axios.get('/logout', config)
        } else {
            setErrorMessage('Token(s) aren\'t valid')
        }
        setToken('')
        history.push('/login')
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
            await axios.get('/delete-account', config)
            setToken('')
            history.push('/')
        } else {
            setErrorMessage('Token(s) aren\'t valid')
        }
    }

    return (
        <>
            <div className='flex justify-between pt-6 max-w-lg mx-auto px-3'>
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
                <div className='max-w-lg mx-auto p-5'>
                    <h2 className='text-red-900'>Danger Zone</h2>
                    <Button text='Delete Account' onClick={onDelete} color='danger' className='mt-3' />
                </div>
            </div>
        </>
    )
}
