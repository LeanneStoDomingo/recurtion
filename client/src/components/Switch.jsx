import React, { useEffect, useState } from 'react'
import { Switch as TSwitch } from '@headlessui/react'

const Switch = ({ onToggle, firstState }) => {
    const [enabled, setEnabled] = useState(false)

    useEffect(() => {
        setEnabled(firstState)
    }, [firstState])

    useEffect(() => {
        onToggle(enabled)
    }, [enabled, onToggle])

    // TODO: change styling
    return (
        <TSwitch
            checked={enabled}
            onChange={setEnabled}
            className={`
                ${enabled ? 'bg-blue-600' : 'bg-gray-200'} 
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

export default Switch
