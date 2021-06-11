import React from 'react'
import { Link } from 'react-router-dom'

export const Home = () => {
    return (
        <div className='flex flex-col items-center text-center'>
            <h1>Recurtion<sup>beta</sup></h1>

            <div>
                Automatically adds recurring tasks to Notion using its brand new API!
                This project is not maintained or affiliated with Notion
            </div>

            <div className='flex'>
                <Link to='/login'>Log In</Link>
                <Link to='/signup'>Sign Up</Link>
            </div>
        </div>
    )
}
