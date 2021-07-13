import React from 'react'
import { Link } from 'react-router-dom'

export const Name = ({ className }) => {
    return (
        <Link className={`text-center ${className}`} to='/'>
            <h1 className='text-5xl text-white'>Recurtion</h1>
            <p className='text-xl font-semibold text-purple-200'>beta</p>
        </Link>
    )
}
