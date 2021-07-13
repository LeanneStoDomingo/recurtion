import React from 'react'
import { Hero, ActionButtons, FAQs, DetailLinks } from '.'

export const Home = () => {
    return (
        <div className='flex flex-col items-center text-center bg-purple-600 min-h-screen'>
            <Hero />
            <ActionButtons />
            <FAQs />
            <DetailLinks />
        </div>
    )
}