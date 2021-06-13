import { useContext, useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'
import TokenContext from './TokenContext'
import axios from 'axios'

// IDEA: put checkExp into TokenContext instead


const checkAuth = async (config) => {
    try {
        const { data } = await axios.get('http://localhost:5000/verify-auth', config)

        if (!data.ok) return false

        return true
    } catch {
        return false
    }
}

const checkExp = async (token, setToken, config) => {
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
}

const useAuth = () => {
    const { token, setToken } = useContext(TokenContext)
    const [loading, setLoading] = useState(true)
    const [isAuth, setIsAuth] = useState(false)
    const [config] = useState({
        withCredentials: true,
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    useEffect(() => {

        (async () => {
            setLoading(true);

            if (await checkAuth(config) || await checkExp(token, setToken, config)) {
                setIsAuth(true)
            } else {
                setIsAuth(false)
            }

            setLoading(false)
        })()

        return () => {
            setLoading(false)
            setIsAuth(i => i)
        }

    }, [token, setToken, config])

    return { checkExp, checkAuth, isAuth, loading }
}

export default useAuth