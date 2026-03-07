import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import { getUserData, completeUserProfile } from '../lib/api'
import { useToast } from '../hooks/useToast'
import { getErrorMessage, AuthError, ProfileIncompleteError } from '../lib/errorHandling'
import { removeAccessToken, getUserFromToken } from '../lib/auth'

type UserData = {
  _id: string
  name: string
  email: string
  gender?: string
  photo?: string
  status: string
}

const malePhoto = "https://res.cloudinary.com/dtt1a0arw/image/upload/v1772725188/malePhoto_voe9lt.png"
const femalePhoto = "https://res.cloudinary.com/dtt1a0arw/image/upload/v1772725200/femalePhoto_lw3gez.png"
const defaultPhoto = "https://res.cloudinary.com/dtt1a0arw/image/upload/v1772754757/download_1_bhbkyx.png"

export default function CompleteProfilePage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [user, setUser] = useState<UserData | null>(null)
  const [name, setName] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData()
        if (data.user.status !== 'pending') {
          navigate('/', { replace: true })
          return
        }
        setUser(data.user)
        setName(data.user.name || '')
        setGender(data.user.gender as 'male' | 'female' || '')
      } catch (err) {
        // ProfileIncompleteError is expected - user is on the right page
        if (err instanceof ProfileIncompleteError) {
          // Extract basic user info from JWT token since API returned 403
          const tokenUser = getUserFromToken()
          if (tokenUser) {
            setUser({
              _id: err.userId,
              name: tokenUser.displayName || '',
              email: tokenUser.email,
              status: 'pending'
            })
            setName(tokenUser.displayName || '')
          }
          // Don't show error - this is expected behavior
          setLoading(false)
          return
        }
        
        if (err instanceof AuthError) {
          removeAccessToken()
          navigate('/login', { replace: true })
          return
        }
        
        // Use backend error message via toast only
        const message = getErrorMessage(err)
        showToast(message, 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate, showToast])

  const getPhotoPreview = () => {
    if (gender === 'male') return malePhoto
    if (gender === 'female') return femalePhoto
    return user?.photo || defaultPhoto
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !gender) {
      showToast('يرجى ملء جميع الحقول', 'warning')
      return
    }

    setSubmitting(true)

    try {
      const photo = gender === 'male' ? malePhoto : femalePhoto
      await completeUserProfile({
        name: name.trim(),
        gender,
        photo
      })
      setCompleted(true)
      showToast('تم إكمال البروفايل بنجاح! جاري التحويل...', 'success')
      // Full page reload to break any state loops
      setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    } catch (err) {
      // Use backend error message
      const message = getErrorMessage(err)
      
      if (err instanceof AuthError) {
        removeAccessToken()
        navigate('/login', { replace: true })
        return
      }
      
      showToast(message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_0%,rgba(15,23,42,0.08),transparent_50%),radial-gradient(900px_circle_at_90%_30%,rgba(99,102,241,0.12),transparent_45%),linear-gradient(to_bottom,#ffffff,#f8fafc)]">
        <Container>
          <div className="grid min-h-screen place-items-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></div>
              <p className="mt-4 text-sm text-slate-600">جاري التحميل...</p>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_0%,rgba(15,23,42,0.08),transparent_50%),radial-gradient(900px_circle_at_90%_30%,rgba(99,102,241,0.12),transparent_45%),linear-gradient(to_bottom,#ffffff,#f8fafc)]">
      <header className="border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-sm font-extrabold text-white">
                R
              </div>
              <div className="text-lg font-extrabold tracking-tight text-slate-900">Rushroom</div>
            </div>
          </div>
        </Container>
      </header>

      <main>
        <Container>
          <div className="grid min-h-[calc(100vh-64px)] items-center py-12">
            <div className="mx-auto w-full max-w-lg">
              <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
                <div className="text-center">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    أكمل بروفايلك
                  </h1>
                  <p className="mt-2 text-sm text-slate-600">
                    يرجى إكمال بياناتك الشخصية لإنهاء إعداد حسابك
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  {/* Photo Preview */}
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-slate-200">
                      <img
                        src={getPhotoPreview()}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {gender ? `الصورة الافتراضية (${gender === 'male' ? 'ذكر' : 'أنثى'})` : 'اختر الجنس لمعاينة الصورة'}
                    </p>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-900">
                      الاسم المعروض
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسمك"
                      className="mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      maxLength={25}
                    />
                    <p className="mt-1 text-xs text-slate-500">{name.length}/25 حرف</p>
                  </div>

                  {/* Gender Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900">الجنس</label>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setGender('male')}
                        className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                          gender === 'male'
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        ذكر
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('female')}
                        className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                          gender === 'female'
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        أنثى
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting || !name.trim() || !gender || completed}
                    className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? 'جاري الإكمال...' : completed ? 'جاري التحويل...' : 'إكمال البروفايل'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
