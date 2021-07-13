import React from 'react'
import Button from '../../components/Button'
import ChevronLeft from '../../icons/ChevronLeft'
import ChevronRight from '../../icons/ChevronRight'

const SetupOne = ({ onBack, onNext }) => {

    const onClick = () => {
        window.open('https://www.notion.so/510ec0f4e4864a69a8f5158ab606ad3f?v=e97c4236f9f2485c97bd3d73d0d33d01', '_blank', 'noopener noreferrer')
    }

    return (
        <div className='bg-purple-50 rounded-2xl shadow-md p-5 m-5'>

            <div className="flex items-start">
                <div className='bg-purple-600 text-purple-50 leading-7 font-bold rounded-full w-8 h-8 text-center flex-shrink-0 align-middle text-xl mr-3'>1</div>
                <div className="flex flex-col text-center">
                    <div>Duplicate the Notion Template</div>
                    <Button text='Template' onClick={onClick} className='self-center mt-3' />
                    <div className='mt-3'>or</div>
                    <div className='mt-3 mb-5'>Create your own Notion database with these specifications</div>
                </div>
            </div>

            <div className='flex flex-row-reverse'>
                <Button text='Next' icon={<ChevronRight />} size='small' iconPosition='right' onClick={onNext} />
                <Button text='Back' icon={<ChevronLeft />} color='secondary' size='small' className='mr-auto' onClick={onBack} />
            </div>
        </div>
    )
}

export default SetupOne
