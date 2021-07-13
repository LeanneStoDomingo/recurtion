import React from 'react'
import { Disclosure } from '@headlessui/react'
import { ChevronUp, ChevronDown } from '../../icons'

export const QA = ({ open, question, answer }) => {
    return (
        <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>{question}</span>
                {open ? <ChevronDown /> : <ChevronUp />}

            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                {answer}
            </Disclosure.Panel>
        </>
    )
}
