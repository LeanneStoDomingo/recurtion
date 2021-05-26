import React from 'react'

const Input = ({
    label,
    type = 'text',
    ...props
}) => {
    return (
        <div className='flex flex-col' {...props}>
            <label>{label}</label>
            <input type={type} className='outline-none rounded py-1 px-2 focus:shadow' />
        </div>
    )
}

export default Input
