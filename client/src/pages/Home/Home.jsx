import React from 'react'
import Hero from './Hero'
import ActionButtons from './ActionButtons'
import FAQs from './FAQs'
import DetailLinks from './DetailLinks'

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