import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '.'

export const ProtectedRoute = ({ component: Component, ...props }) => {
    const { isAuth, loading } = useAuth()

    return (
        <Route {...props} render={() => {
            if (loading) {
                return <div> loading...</div>
            } else if (isAuth) {
                return <Component />
            } else {
                return <Redirect to={{ pathname: '/login' }} />
            }
        }} />
    )
}
