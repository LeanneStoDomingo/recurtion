import React, { createContext, useState } from 'react'

const TokenContext = createContext('')

export const TokenProvider = ({ children }) => {
    const [token, setToken] = useState('')
    const config = {
        withCredentials: true,
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    return (
        <TokenContext.Provider value={{ token, setToken, config }}>
            {children}
        </TokenContext.Provider>
    )
}

export default TokenContext
