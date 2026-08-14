import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'

type View = 'login' | 'register' | 'forgot'

export default function Login() {
  const { login, register, forgotPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from || '/dashboard'

  const [view, setView] = useState<View>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)
    if (ok) {
      navigate(from, { replace: true })
    } else {
      setError('Invalid email or password. Please try again.')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    const ok = await register(name, email, password)
    setLoading(false)
    if (ok) {
      navigate(from, { replace: true })
    } else {
      setError('Registration failed. Email might be already in use.')
    }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await forgotPassword(email)
    setLoading(false)
    if (ok) {
      setSuccess('Password reset link has been sent to your email.')
    } else {
      setError('Failed to send reset link. Please try again.')
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#A577D5] focus:ring-2 focus:ring-[#A577D5]/20 transition-all text-gray-800 placeholder-gray-400"

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2F2454 0%, #5b3d9e 100%)' }}>
        <img src="https://images.unsplash.com/photo-1774599730806-61591b84280e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=900" alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2.5">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 2 L34 34 H24 L18 18 L12 34 H2 L18 2Z" fill="white" />
              <path d="M11 26 H25 L23 30 H13 Z" fill="#A577D5" />
            </svg>
            <div className="text-white font-semibold">
              <div>Prestigium Academia</div>
            </div>
          </Link>
          <div>
            <h2 className="text-white text-4xl font-bold mb-4 leading-tight">Your Engineering Career Starts Here</h2>
            <p className="text-white/65 text-base leading-relaxed mb-8">Join thousands of engineers advancing their careers through industry-led training and certification.</p>
            <div className="grid grid-cols-2 gap-4">
              {[['1,239+', 'Participants'], ['25+', 'Training Programs'], ['1,000+', 'Certificates Issued'], ['15+', 'Expert Instructors']].map(([v, l]) => (
                <div key={l} className="bg-white/10 rounded-xl p-4">
                  <p className="text-white text-2xl font-bold">{v}</p>
                  <p className="text-white/60 text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/40 text-xs">© 2026 Prestigium Academia</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F2EFFD]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <path d="M18 2 L34 34 H24 L18 18 L12 34 H2 L18 2Z" fill="#2F2454" />
              <path d="M11 26 H25 L23 30 H13 Z" fill="#A577D5" />
            </svg>
            <span className="font-bold text-[#2F2454]">Prestigium Academia</span>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            {view === 'login' && (
              <>
                <h1 className="text-2xl font-bold text-[#2F2454] mb-1">Welcome back</h1>
                <p className="text-gray-500 text-sm mb-6">Sign in to your account to continue</p>
                {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-4">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className={`${inputClass} pr-12`} />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPw ? '🙈' : '👁'}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                      <input type="checkbox" className="w-4 h-4 rounded accent-[#A577D5]" />
                      Remember me
                    </label>
                    <button type="button" onClick={() => setView('forgot')} className="text-[#A577D5] hover:underline font-medium">Forgot password?</button>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-[#2F2454] text-white font-semibold py-3.5 rounded-xl hover:bg-[#A577D5] transition-all text-sm disabled:opacity-60 mt-2">
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-5">
                  Don't have an account?{' '}
                  <button onClick={() => setView('register')} className="text-[#A577D5] font-semibold hover:underline">Create account</button>
                </p>
              </>
            )}

            {view === 'register' && (
              <>
                <h1 className="text-2xl font-bold text-[#2F2454] mb-1">Create account</h1>
                <p className="text-gray-500 text-sm mb-6">Join Prestigium Academia today</p>
                {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-4">{error}</div>}
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" required className={`${inputClass} pr-12`} />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPw ? '🙈' : '👁'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Confirm Password</label>
                    <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" required className={inputClass} />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-[#2F2454] text-white font-semibold py-3.5 rounded-xl hover:bg-[#A577D5] transition-all text-sm disabled:opacity-60 mt-2">
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-5">
                  Already have an account?{' '}
                  <button onClick={() => setView('login')} className="text-[#A577D5] font-semibold hover:underline">Sign in</button>
                </p>
              </>
            )}

            {view === 'forgot' && (
              <>
                <h1 className="text-2xl font-bold text-[#2F2454] mb-1">Reset password</h1>
                <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send you a reset link</p>
                {success ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-4 flex items-start gap-2">
                    <span>✅</span>
                    <span>{success}</span>
                  </div>
                ) : (
                  <form onSubmit={handleForgot} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email Address</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className={inputClass} />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-[#2F2454] text-white font-semibold py-3.5 rounded-xl hover:bg-[#A577D5] transition-all text-sm disabled:opacity-60">
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>
                )}
                <p className="text-center text-sm text-gray-500 mt-5">
                  <button onClick={() => setView('login')} className="text-[#A577D5] font-semibold hover:underline">← Back to sign in</button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
