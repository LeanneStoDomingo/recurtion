import React, { useContext } from 'react'
import jwtDecode from 'jwt-decode'
import TokenContext from './TokenContext'
import axios from 'axios'

const useAuth = () => {
    const { token, setToken } = useContext(TokenContext)

    const checkExp = async () => {
        try {
            const { exp } = jwtDecode(token)

            if (Date.now() < exp * 1000) return true

            const config = {
                withCredentials: true,
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await axios.get('http://localhost:5000/refresh-tokens', config)

            if (!data.ok) return false

            setToken(data.accessToken)

            return true
        } catch {
            return false
        }
    }

    return { checkExp }
}

export default useAuth