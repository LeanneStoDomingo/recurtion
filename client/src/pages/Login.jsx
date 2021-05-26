import React from 'react'
import Button from '../components/Button'
import Input from '../components/Input'

const Login = () => {
    return (
        <>
            <h1 className='text-2xl text-center'>Recurtion</h1>
            <div className='bg-gray-200 p-2 m-4 flex flex-col shadow-md rounded'>
                <h2 className='text-xl text-center'>Login</h2>
                <p className='text-center'>Don't have an account? Sign Up</p>
                <Input label='Email' type='email' />
                <Input label='Password' type='password' />

                <div className='flex justify-between'>
                    {/* replace href with react router link */}
                    <a href="#" className='hover:text-gray-800'>Forgot Password?</a>
                    <Button onClick={() => console.log('click')}>Log In</Button>
                </div>
            </div>
        </>
    )
}

export default Login
