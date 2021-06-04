import React, { createContext, useState } from 'react'

const TokenContext = createContext('')

export const TokenProvider = ({ children }) => {
    const [token, setToken] = useState('')

    return (
        <TokenContext.Provider value={{ token, setToken }}>
            {children}
        </TokenContext.Provider>
    )
}

export default TokenContext
