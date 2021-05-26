import React from 'react'

const sizes = {
    regular: 'py-2 px-4 rounded',
}

const colors = {
    blue: 'text-white hover:text-gray-200 focus:text-gray-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 focus:ring focus:ring-blue-300',
    white: 'text-blue-500 hover:text-blue-600'
}

const Button = ({
    children,
    size = 'regular',
    color = 'blue',
    className = '',
    ...props
}) => {
    return (
        <button className={`outline-none ${sizes[size]} ${colors[color]} ${className}`} {...props}>
            {children}
        </button>
    )
}

export default Button
