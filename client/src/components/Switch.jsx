import React, { useEffect, useState } from 'react'
import { Switch as TSwitch } from '@headlessui/react'

export const Switch = ({ toggle, setToggle }) => {
    const [enabled, setEnabled] = useState(false)

    useEffect(() => {
        setEnabled(toggle)
    }, [toggle])

    useEffect(() => {
        setToggle(enabled)
    }, [enabled, setToggle])

    return (
        <TSwitch
            checked={enabled}
            onChange={setEnabled}
            className={`
                ${enabled ? 'bg-purple-600' : 'bg-gray-200'} 
                relative inline-flex items-center h-6 rounded-full w-11 
                transition-colors ease-in-out
            `}
        >
            <span className="sr-only">Enable integration</span>
            <span
                className={`
                    ${enabled ? 'translate-x-6' : 'translate-x-1'} 
                    inline-block w-4 h-4 bg-white rounded-full 
                    transition-transform transform ease-in-out
                `}
            />
        </TSwitch>
    )
}
