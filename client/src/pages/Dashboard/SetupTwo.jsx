import React, { useContext } from 'react'
import { Button } from '../../components'
import { ChevronLeft, ChevronRight } from '../../icons'
import { TokenContext, useAuth } from '../../utils'

export const SetupTwo = ({ onBack, onNext }) => {
    const { token } = useContext(TokenContext)
    const { loading, isAuth } = useAuth()

    const onClick = async () => {
        if (!loading && isAuth) {
            window.open(`http://localhost:5000/notion-oauth?token=${token}`, '_blank', 'height=600,width=500')
        } else {
            // setErrorMessage('Token(s) aren\'t valid')
        }
    }

    return (
        <div className='bg-purple-50 rounded-2xl shadow-md p-5 m-5'>

            <div className="flex items-start">
                <div className='bg-purple-600 text-purple-50 leading-7 font-bold rounded-full w-8 h-8 text-center flex-shrink-0 align-middle text-xl mr-3'>2</div>
                <div className="flex flex-col text-center">
                    <div>Allow access to your Notion workspace</div>
                    <Button onClick={onClick} text='Allow Access' className='self-center mt-3' />
                    <div className='mt-3 mb-5 text-left text-sm'>Note: it is recommended to only allow access to the database(s) that will use this integration, not your entire workspace; otherwise, the integration will take longer to run</div>
                </div>
            </div>

            <div className='flex flex-row-reverse'>
                <Button text='Next' icon={<ChevronRight />} size='small' iconPosition='right' onClick={onNext} />
                <Button text='Back' icon={<ChevronLeft />} color='secondary' size='small' className='mr-auto' onClick={onBack} />
            </div>
        </div>
    )
}
