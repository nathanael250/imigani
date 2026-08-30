import { ArrowRight, Eye, EyeOff, KeyRound, LockKeyhole, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoImage from '../../assets/imigani tours.png'
import rwandaImage from '../../assets/Rwanda.png'
import { login } from '../../services/authService'

const routePatternImage =
  "url(\"data:image/svg+xml,%3Csvg width='620' height='620' viewBox='0 0 620 620' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23d3a14e' stroke-width='2.1' stroke-linecap='round' stroke-linejoin='round' opacity='.82'%3E%3Cpath d='M515 11c-61 18-97 53-103 102-8 65 43 101 28 158-15 58-81 74-93 133-13 63 47 102 29 160-15 49-70 72-104 105'/%3E%3Cpath d='M579 52c-76 5-129 45-140 105-12 66 41 105 19 165-20 54-88 65-103 121-16 58 35 95 22 147-12 47-60 76-99 98'/%3E%3Cpath d='M612 123c-72-22-141 3-166 62-31 73 35 120 2 185-26 52-94 61-110 116-16 54 31 88 23 136-7 42-43 76-79 101'/%3E%3Cpath d='M602 211c-58-39-128-35-166 10-48 58-8 119-59 171-39 40-100 41-121 89-23 53 23 91 2 140-16 36-52 57-92 70'/%3E%3Cpath d='M556 300c-41-43-104-54-149-25-57 37-41 100-102 139-49 32-110 24-138 68-31 49 10 94-26 137-29 35-76 43-118 39'/%3E%3Cpath d='M485 377c-25-45-79-69-130-56-67 17-72 82-141 101-57 16-112-8-151 26-40 35-17 90-59 121'/%3E%3Cpath d='M393 437c-11-42-53-73-100-73-66 0-87 59-154 62-59 3-103-34-148-10'/%3E%3Cpath d='M533 144c-30 17-48 43-52 75-5 45 26 75 10 117-16 43-67 55-85 97-18 43 10 80-6 120-13 34-48 56-86 70'/%3E%3Cpath d='M550 256c-42-2-76 17-91 52-18 43 8 82-21 119-28 36-82 35-110 71-29 38-6 80-39 112-27 26-67 31-104 26'/%3E%3Cpath d='M506 363c-38-15-79-5-105 23-34 36-24 81-64 109-38 26-88 12-127 38-41 27-36 72-75 94-31 18-71 11-106-5'/%3E%3Cpath d='M419 444c-27-25-69-30-103-12-44 23-49 70-96 86-44 15-86-14-130 2-44 17-51 62-93 75'/%3E%3C/g%3E%3C/svg%3E\")"
const loginInputWrapClass =
  'flex min-h-12 items-center gap-3 rounded-[5px] border border-[#d7e3d8] bg-white px-4 text-[#84908a] transition focus-within:border-[#d3a14e] focus-within:ring-4 focus-within:ring-[#d3a14e]/20 sm:min-h-[52px]'
const loginInputClass =
  'w-full min-w-0 border-0 bg-transparent text-[14px] font-bold text-[#142319] outline-none placeholder:text-[#9ba49f] sm:text-[15px]'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (authError) {
      setError(authError.message || 'Unable to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main
      className="relative isolate flex min-h-[100svh] items-start justify-center overflow-y-auto bg-cover bg-center px-3.5 pb-[max(44px,calc(env(safe-area-inset-bottom)+24px))] pt-[22px] text-white sm:px-5 sm:pb-[max(42px,env(safe-area-inset-bottom))] sm:pt-8 min-[901px]:min-h-screen min-[901px]:items-center min-[901px]:overflow-hidden min-[901px]:p-[clamp(32px,5vw,64px)]"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(4,25,10,0.86) 0%, rgba(8,42,18,0.72) 42%, rgba(8,31,14,0.5) 100%), url("${rwandaImage}")`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_55%_52%,rgba(211,161,78,0.34)_0%,rgba(198,146,61,0.2)_15%,transparent_40%),linear-gradient(180deg,rgba(4,18,8,0.18),rgba(4,18,8,0.42))]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute z-[1] bg-right-top bg-repeat-y opacity-[0.34] mix-blend-screen max-[480px]:inset-[-6%_-70%_-6%_-8%] max-[480px]:bg-[length:620px_auto] min-[481px]:max-[900px]:inset-[-8%_-32%_-8%_12%] min-[481px]:max-[900px]:bg-[length:680px_auto] min-[901px]:inset-[-8%_-2%_-8%_50%] min-[901px]:bg-[length:min(52vw,620px)_auto] min-[901px]:opacity-90"
        style={{ backgroundImage: routePatternImage }}
        aria-hidden="true"
      />

      <section
        className="relative z-[2] grid w-full max-w-[1120px] grid-cols-1 items-center gap-[30px] min-[901px]:min-h-[min(720px,calc(100vh-96px))] min-[901px]:grid-cols-[minmax(0,1fr)_minmax(420px,526px)] min-[901px]:gap-[clamp(36px,7vw,92px)]"
        aria-label="IMIGANI management portal sign in"
      >
        <div className="mx-auto flex max-w-[560px] flex-col items-center text-center [text-shadow:0_8px_26px_rgba(0,0,0,0.35)] min-[901px]:mx-0 min-[901px]:max-w-none">
          <div className="mb-[18px] inline-flex h-[76px] w-[76px] items-center justify-center text-white min-[901px]:mb-[30px] min-[901px]:h-[clamp(88px,10vw,128px)] min-[901px]:w-[clamp(88px,10vw,128px)]" aria-hidden="true">
            <KeyRound className="h-full w-full stroke-[1.35]" />
          </div>
          <h1 className="text-[clamp(36px,4.2vw,58px)] font-bold leading-[1.08]">Management Portal</h1>
          <p className="mt-[13px] max-w-[520px] text-[clamp(16px,1.65vw,22px)] font-bold leading-[1.55] text-white/90 min-[901px]:mt-[21px]">
            Manage tour packages, requests, destinations and more - all in one place
          </p>
        </div>

        <form
          className="mx-auto w-full max-w-[526px] rounded-[10px] border border-white/60 bg-white/95 px-[18px] py-[26px] text-[#132419] shadow-[0_28px_76px_rgba(0,0,0,0.32)] sm:px-[clamp(26px,5vw,72px)] sm:py-[clamp(34px,4vw,48px)]"
          onSubmit={handleSubmit}
        >
          <img className="mx-auto mb-[18px] block h-auto w-[84px] sm:mb-[27px] sm:w-[clamp(96px,9vw,118px)]" src={logoImage} alt="IMIGANI Tours" />

          <div className="mb-6 text-center sm:mb-[34px]">
            <h2 className="text-[27px] font-bold leading-[1.15] text-[#102f16] sm:text-[clamp(28px,3vw,38px)]">Welcome Back</h2>
            <span className="mx-auto mb-4 mt-[15px] block h-1 w-[76px] rounded-full bg-[#d3a14e]" aria-hidden="true" />
            <p className="text-[14px] font-bold leading-[1.45] text-[#5c6b61] sm:text-[16px]">Sign in to access your dashboard</p>
          </div>

          <div>
            <label className="mb-[9px] block text-[14px] font-bold text-[#263129] sm:text-[15px]" htmlFor="login-email">
              Email Address
            </label>
            <div className={loginInputWrapClass}>
              <User className="h-[19px] w-[19px] flex-none stroke-2" aria-hidden="true" />
              <input
                className={loginInputClass}
                id="login-email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="mt-[22px]">
            <label className="mb-[9px] block text-[14px] font-bold text-[#263129] sm:text-[15px]" htmlFor="login-password">
              Password
            </label>
            <div className={loginInputWrapClass}>
              <LockKeyhole className="h-[19px] w-[19px] flex-none stroke-2" aria-hidden="true" />
              <input
                className={loginInputClass}
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                className="inline-flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full text-[#6d7a72] transition hover:bg-[#102f16]/10 hover:text-[#0b2a12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d3a14e]"
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-[21px] flex flex-col items-start gap-3 text-[14px] font-bold text-[#5c6b61] sm:flex-row sm:items-center sm:justify-between sm:gap-[18px]">
            <label className="inline-flex cursor-pointer items-center gap-[9px] whitespace-nowrap" htmlFor="login-remember">
              <input className="h-4 w-4 cursor-pointer accent-[#c6923d]" id="login-remember" type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>
            <a className="text-[#c6923d] transition hover:-translate-y-px hover:text-[#0b2a12]" href="/login">
              Forgot Password?
            </a>
          </div>

          {error && <p className="mb-[-12px] mt-[18px] rounded-[5px] bg-[#fff1ed] px-[13px] py-[11px] text-[13px] font-bold leading-[1.4] text-[#b03622]">{error}</p>}

          <button
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-[5px] bg-[#0b2a12] text-[14px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#14401d] hover:shadow-[0_14px_30px_rgba(11,42,18,0.2)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:mt-[30px] sm:min-h-[52px] sm:text-[15px]"
            type="submit"
            disabled={isLoading}
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="h-[19px] w-[19px] stroke-[2.2]" aria-hidden="true" />
          </button>
        </form>
      </section>
    </main>
  )
}

export default Login
