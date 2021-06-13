import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import useAuth from './useAuth'

export const RedirectRoute = ({ component: Component, ...props }) => {
    const { isAuth, loading } = useAuth()

    return (
        <Route {...props} render={() => {
            if (loading) {
                return <div>loading...</div>
            } else if (isAuth) {
                return <Redirect to={{ pathname: '/dashboard' }} />
            } else {
                return <Component />
            }
        }} />
    )
}
