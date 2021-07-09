import React from 'react'
import { Disclosure } from '@headlessui/react'
import QA from './QA'

const FAQs = () => {
    return (
        <div className="w-full px-4 my-8">
            <div className="w-full max-w-md p-2 mx-auto bg-white rounded-2xl shadow-lg">
                <Disclosure>
                    {({ open }) => (
                        <QA
                            open={open}
                            question='How does it work?'
                            answer={<span>Recurtion uses <a href='https://developers.notion.com/' className='underline text-purple-600 hover:text-purple-800 focus-visible:outline-black'>Notion's API</a> which is currently in beta. It searches through your Notion workspace for completed tasks that are designated as recurring, computes the next due date, and unchecks the task. Completed recurring tasks are updated every 15 seconds. </span>}
                        />
                    )}
                </Disclosure>
                <Disclosure as="div" className="mt-2">
                    {({ open }) => (
                        <QA
                            open={open}
                            question='How much does it cost?'
                            answer={<span>Absolutely nothing! Because this service is free, consider donating at <a href='https://www.buymeacoffee.com/' className='underline text-purple-600 hover:text-purple-800 focus-visible:outline-black'>Buy Me a Coffee</a>.</span>}
                        />
                    )}
                </Disclosure>
                <Disclosure as="div" className="mt-2">
                    {({ open }) => (
                        <QA
                            open={open}
                            question='Are you affiliated with Notion?'
                            answer="No."
                        />
                    )}
                </Disclosure>
            </div>
        </div>
    )
}

export default FAQs
