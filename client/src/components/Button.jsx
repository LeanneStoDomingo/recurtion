import React from 'react'
import { useHistory } from 'react-router-dom'

const classNameColors = {
    primary: 'bg-purple-600 text-purple-50 shadow-sm hover:shadow-md hover:bg-purple-700 focus-visible:ring focus-visible:ring-purple-400 focus-visible:ring-opacity-75',
    secondary: 'bg-purple-100 text-purple-700 border border-purple-200 shadow-sm hover:shadow hover:bg-purple-200 hover:border-purple-300 focus-visible:ring focus-visible:ring-purple-400 focus-visible:ring-opacity-75',
    noneDark: 'text-purple-700 focus-visible:outline-black hover:underline',
    noneLight: 'text-purple-50 focus-visible:outline-white hover:underline',
    danger: 'bg-red-600 text-red-100 shadow-sm hover:shadow-md hover:bg-red-700 focus-visible:ring focus-visible:ring-red-400 focus-visible:ring-opacity-75'
}

const classNameIconSizes = {
    medium: 'w-10 h-10',
    small: 'w-5 h-5'
}

const classNameSizes = {
    'medium-left': 'px-4',
    'medium-right': 'px-4',
    'small-left': 'pl-2 pr-4',
    'small-right': 'pr-2 pl-4'
}

export const Button = ({
    text,
    icon,
    to,
    href,
    onClick,
    className = '',
    color = 'primary',
    size = 'medium',
    iconPosition = 'left',
    ...props
}) => {

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
            className={`flex ${classNameColors[color]} items-center justify-center align-middle font-medium rounded py-2 ${classNameSizes[`${size}-${iconPosition}`]} text-center ${className}`}
        >
            {iconPosition === 'left' ? <div className={icon ? `${classNameIconSizes[size]} mr-3` : ''}>
                {icon}
            </div> : null}
            <div>
                {text}
            </div>
            {iconPosition === 'right' ?
                <div className={icon ? `${classNameIconSizes[size]} ml-3` : ''}>
                    {icon}
                </div> : null}
        </button>
    )
}
