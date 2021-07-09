import React from 'react'
import Github from '../../icons/Github'
import Lock from '../../icons/Lock'
import Clipboard from '../../icons/Clipboard'
import Coffee from '../../icons/Coffee'
import Button from '../../components/Button'

const DetailLinks = () => {
    return (
        <div className='px-5 text-white grid sm:grid-cols-2 w-full max-w-md items-center mt-4 mb-16'>
            <Button href='https://github.com/LeanneStoDomingo/recurtion' text='GitHub' icon={<Github />} color='noneLight' />
            <Button href='https://www.buymeacoffee.com/' text='Donate' icon={<Coffee />} color='noneLight' />
            <Button to='/terms-of-use' text='Terms of Use' icon={<Clipboard />} color='noneLight' />
            <Button to='/privacy-policy' text='Privacy Policy' icon={<Lock />} color='noneLight' />
        </div>
    )
}

export default DetailLinks
