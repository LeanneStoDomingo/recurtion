import React from 'react'
import { useHistory } from 'react-router-dom'

const classNameColors = {
    primary: 'bg-purple-600 text-purple-50 shadow-sm hover:shadow-md hover:bg-purple-700 focus-visible:ring focus-visible:ring-purple-400 focus-visible:ring-opacity-75',
    secondary: 'bg-purple-100 text-purple-700 border border-purple-200 shadow-sm hover:shadow hover:bg-purple-200 hover:border-purple-300 focus-visible:ring focus-visible:ring-purple-400 focus-visible:ring-opacity-75',
    noneDark: 'text-purple-700 focus-visible:outline-white hover:underline',
    noneLight: 'text-purple-50 focus-visible:outline-white hover:underline'
}

const Button = ({ text, icon, to, href, onClick, className = '', color = 'primary', ...props }) => {
    const history = useHistory()

    const onClickLink = () => {
        history.push(to)
    }

    const onClickHref = () => {
        window.location.href = href
    }

    return (
        <button
            {...props}
            onClick={to ? onClickLink : href ? onClickHref : onClick}
            className={`flex ${classNameColors[color]} items-center justify-center font-medium rounded py-2 px-4 text-center ${className}`}
        >
            <div className={icon ? 'w-10 h-10 mr-3' : ''}>
                {icon}
            </div>
            <div>
                {text}
            </div>
        </button>
    )
}

export default Button
