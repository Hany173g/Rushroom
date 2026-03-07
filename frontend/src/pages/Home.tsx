import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import { clearAccessToken, getUserFromToken } from '../lib/auth'
import { useToast } from '../hooks/useToast'

export default function HomePage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const user = getUserFromToken()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    clearAccessToken()
    showToast('تم تسجيل الخروج بنجاح', 'success')
    navigate('/login', { replace: true })
  }

  const goToProfile = () => {
    const userId = user?._id || user?.id
    if (userId) {
      navigate(`/profile/${userId}`)
    } else {
      navigate('/profile')
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_0%,rgba(15,23,42,0.08),transparent_50%),radial-gradient(900px_circle_at_90%_30%,rgba(99,102,241,0.10),transparent_45%),linear-gradient(to_bottom,#ffffff,#f8fafc)]">
      <header className="border-b border-slate-200/70 bg-white/70 backdrop-blur sticky top-0 z-50">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-sm font-extrabold text-white">R</div>
              <div className="text-lg font-extrabold tracking-tight text-slate-900">Rushroom</div>
            </div>
            <div className="flex items-center gap-3">
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.displayName}</span>
                  <svg className={`w-4 h-4 text-slate-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 z-50 overflow-hidden">
                      <div className="p-4 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900">{user?.displayName}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={goToProfile}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          الملف الشخصي
                        </button>
                      </div>
                      <div className="p-2 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          تسجيل الخروج
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </header>

      <main>
        <Container>
          <div className="py-12">
            <div className="mx-auto grid w-full max-w-5xl gap-6">
              <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">لوحة التحكم</h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  أنت الآن مسجل الدخول. تم تخزين رمز الوصول محلياً وإرفاقه بطلبات API.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">البروفايل</div>
                <div className="mt-1 text-sm text-slate-600">المعلومات الأساسية المستخرجة من JWT.</div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-700">الاسم</div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">{user?.displayName ?? '—'}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-700">البريد الإلكتروني</div>
                    <div className="mt-2 break-all text-sm font-semibold text-slate-900">{user?.email ?? '—'}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                    <div className="text-xs font-semibold text-slate-700">المعرف</div>
                    <div className="mt-2 break-all text-sm font-semibold text-slate-900">{user?.id ?? '—'}</div>
                  </div>
                </div>

                {!user && (
                  <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="text-sm font-semibold text-amber-900">لم يتم العثور على بيانات البروفايل</div>
                    <div className="mt-1 text-sm text-amber-800">
                      يرجى تسجيل الخروج وتسجيل الدخول مرة أخرى لتحديث الرمز.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
