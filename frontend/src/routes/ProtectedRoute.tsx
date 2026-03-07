import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'
import { isAuthed } from '../lib/auth'
import { getUserData } from '../lib/api'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'pending' | 'unauthenticated'>('loading')

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthed()) {
        setStatus('unauthenticated')
        return
      }

      try {
        const data = await getUserData()
        if (data.user.status === 'pending') {
          setStatus('pending')
        } else {
          setStatus('authenticated')
        }
      } catch (err: any) {
        if (err?.statusCode === 403 || err?.code === 'PROFILE_INCOMPLETE') {
          setStatus('pending')
        } else {
          setStatus('unauthenticated')
        }
      }
    }

    checkAuth()
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  if (status === 'pending' && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />
  }

  return <>{children}</>
}
