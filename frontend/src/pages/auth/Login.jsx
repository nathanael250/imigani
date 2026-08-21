import { ArrowRight, Eye, EyeOff, KeyRound, LockKeyhole, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoImage from '../../assets/imigani tours.png'
import rwandaImage from '../../assets/Rwanda.png'
import { login } from '../../services/authService'

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
    <main className="login-page" style={{ '--login-bg-image': `url("${rwandaImage}")` }}>
      <div className="login-overlay" aria-hidden="true" />

      <section className="login-shell" aria-label="IMIGANI management portal sign in">
        <div className="login-intro">
          <div className="login-key-mark" aria-hidden="true">
            <KeyRound />
          </div>
          <h1>Management Portal</h1>
          <p>Manage tour packages, bookings, destinations and more - all in one place</p>
        </div>

        <form className="login-card" onSubmit={handleSubmit}>
          <img className="login-logo" src={logoImage} alt="IMIGANI Tours" />

          <div className="login-heading">
            <h2>Welcome Back</h2>
            <span aria-hidden="true" />
            <p>Sign in to access your dashboard</p>
          </div>

          <div className="login-field">
            <label htmlFor="login-email">Email Address</label>
            <div className="login-input-wrap">
              <User aria-hidden="true" />
              <input
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

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <div className="login-input-wrap">
              <LockKeyhole aria-hidden="true" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                className="login-password-toggle"
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="login-remember" htmlFor="login-remember">
              <input id="login-remember" type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>
            <a href="/login">Forgot Password?</a>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="login-submit" type="submit" disabled={isLoading}>
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight aria-hidden="true" />
          </button>
        </form>
      </section>
    </main>
  )
}

export default Login
