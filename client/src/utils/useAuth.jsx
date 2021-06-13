import { useCallback, useContext, useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'
import TokenContext from './TokenContext'
import axios from 'axios'

const useAuth = () => {
    const { token, setToken, config } = useContext(TokenContext)
    const [loading, setLoading] = useState(true)
    const [isAuth, setIsAuth] = useState(false)
    const [isMounted, setIsMounted] = useState(true)

    const checkAuth = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/verify-auth', config)

            if (!data.ok) return false

            setToken(t => t || data.accessToken)

            return true
        } catch {
            return false
        }
    }, [setToken, config])

    const checkExp = useCallback(async () => {
        try {
            const { exp } = jwtDecode(token)

            if (Date.now() < exp * 1000) return true

            const { data } = await axios.get('http://localhost:5000/refresh-tokens', config)

            if (!data.ok) return false

            setToken(data.accessToken)

            return true
        } catch {
            return false
        }
    }, [token, setToken, config])


    const checkBoth = useCallback(async () => {
        return (await checkAuth() || await checkExp())
    }, [checkAuth, checkExp])

    useEffect(() => {
        (async () => {
            setLoading(true)
            const check = await checkBoth()
            if (isMounted) {
                setIsAuth(check)
            }
            setLoading(false)
        })()

        return () => {
            setIsMounted(false)
            setLoading(false)
        }
    }, [isMounted, checkBoth])

    return { checkExp, checkAuth, isAuth, loading, checkBoth }
}

export default useAuth