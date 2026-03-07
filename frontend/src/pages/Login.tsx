import Container from '../components/Container'
import { API_BASE_URL } from '../lib/env'

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.18 1.52 7.6 2.8l5.2-5.2C33.7 4.3 29.3 2 24 2 14.6 2 6.6 7.4 2.7 15.2l6.8 5.3C11.4 14.4 17.2 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46 24.5c0-1.6-.14-2.73-.43-3.9H24v7.4h12.5c-.25 2-1.6 5-4.6 7l7.1 5.5c4.2-3.9 6.9-9.6 6.9-16z"
      />
      <path
        fill="#FBBC05"
        d="M9.5 28.5A14.7 14.7 0 0 1 8.7 24c0-1.55.27-3.05.8-4.5l-6.8-5.3A23.9 23.9 0 0 0 0 24c0 3.9.93 7.6 2.7 10.8l6.8-6.3z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.3 0 9.8-1.76 13.1-4.8l-7.1-5.5c-1.9 1.33-4.5 2.27-6.9 2.27-6.8 0-12.6-4.9-14.6-11.5l-6.8 6.3C6.6 40.6 14.6 46 24 46z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  )
}

function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition active:scale-[0.99] hover:bg-slate-50"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white">
        <GoogleLogo />
      </span>
      <span>التسجيل باستخدام Google</span>
    </button>
  )
}

export default function LoginPage() {
  const handleLogin = () => {
    try {
      window.location.href = `${API_BASE_URL}/auth/google`
    } catch (err) {
      console.error('Failed to redirect to Google OAuth:', err)
    }
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
            <div className="text-sm font-medium text-slate-600">تسجيل الدخول</div>
          </div>
        </Container>
      </header>

      <main>
        <Container>
          <div className="grid min-h-[calc(100vh-64px)] items-center py-12">
            <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  تسجيل دخول آمن
                </div>
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                  مرحباً بك في Rushroom
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                  سجل الدخول باستخدام Google للبدء. يتم إنشاء حسابك تلقائياً وتبقى جلسة العمل آمنة باستخدام JWT.
                </p>

                <div className="mt-6 grid gap-3 text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-900" />
                    تسجيل دخول سريع وبروفايل نظيف
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-900" />
                    يعمل عبر جميع الأجهزة بحساب Google
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="text-sm font-semibold text-slate-900">المتابعة</div>
                  <div className="mt-1 text-sm text-slate-600">استخدم حساب Google للتسجيل.</div>

                  <div className="mt-5">
                    <GoogleButton onClick={handleLogin} />
                    <p className="mt-4 text-xs text-slate-500">
                      بالمتابعة، أنت توافق على شروط الاستخدام وإشعار الخصوصية.
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-center text-xs text-slate-500">© {new Date().getFullYear()} Rushroom</div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
