import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loader } from './ui'
import { Forbidden } from '../pages/Forbidden'

export function RequireAuth() {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) return <Loader />
    if (!user) return <Navigate to="/login" replace state={{ from: location }} />
    return <Outlet />
}

export function RequireAdmin() {
    const { user, isAdmin, loading } = useAuth()
    const location = useLocation()

    if (loading) return <Loader fullScreen />
    if (!user) return <Navigate to="/login" replace state={{ from: location }} />
    if (!isAdmin) return <Forbidden />
    return <Outlet />
}
