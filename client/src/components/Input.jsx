import React from 'react'

const Input = ({ label, type, update, value, className, ...props }) => {

    const onChange = (e) => {
        update(e.target.value)
    }

    return (
        <div {...props} className={`flex items-center ${className}`}>
            <label className='whitespace-nowrap'>{label}</label>
            <input type={type} onChange={onChange} value={value} className='ml-3 rounded-md shadow-lg py-1 px-2 w-full focus:ring focus:ring-purple-400' />
        </div>
    )
}

export default Input
