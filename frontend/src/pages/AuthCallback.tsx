import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Container from '../components/Container'
import { setAccessToken, removeAccessToken } from '../lib/auth'
import { getUserData } from '../lib/api'
import { useToast } from '../hooks/useToast'
import { getErrorMessage, AuthError, ProfileIncompleteError } from '../lib/errorHandling'

export default function AuthCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const token = useMemo(() => params.get('token'), [params])

  useEffect(() => {
    if (!token) return
    setAccessToken(token)
    
    const checkUserStatus = async () => {
      try {
        const data = await getUserData()
        if (data.user.status === 'pending') {
          navigate('/complete-profile', { replace: true })
        } else {
          navigate('/', { replace: true })
        }
      } catch (err) {
        // Handle profile incomplete - navigate to complete profile
        if (err instanceof ProfileIncompleteError) {
          navigate('/complete-profile', { replace: true })
          return
        }
        
        const message = getErrorMessage(err)
        
        if (err instanceof AuthError) {
          removeAccessToken()
          showToast(message, 'error')
          navigate('/login', { replace: true })
          return
        }
        
        showToast(message, 'error')
        navigate('/', { replace: true })
      }
    }
    
    checkUserStatus()
  }, [navigate, token, showToast])

  return (
    <div className="min-h-screen bg-[radial-gradient(900px_circle_at_20%_0%,rgba(99,102,241,0.16),transparent_45%),radial-gradient(900px_circle_at_90%_40%,rgba(15,23,42,0.14),transparent_50%),linear-gradient(to_bottom,#0b1220,#020617)] text-white">
      <Container>
        <div className="grid min-h-screen place-items-center py-10">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-sm font-extrabold">R</div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight">جاري تسجيل الدخول...</h1>
                <p className="mt-1 text-sm leading-6 text-white/70">
                  {token
                    ? 'جاري إنهاء المصادقة، سيتم تحويلك تلقائياً...'
                    : 'لم يتم العثور على رمز المصادقة في الرابط.'}
                </p>
              </div>
            </div>

            {!token && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-semibold text-white mb-2">حدث خطأ</div>
                <div className="mt-1 text-sm text-white/70">لم نتمكن من العثور على رمز المصادقة. يرجى المحاولة مرة أخرى.</div>
                <div className="mt-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition active:scale-[0.99]"
                  >
                    العودة لتسجيل الدخول
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-6 text-xs text-white/50">Rushroom authentication</div>
          </div>
        </div>
      </Container>
    </div>
  )
}
