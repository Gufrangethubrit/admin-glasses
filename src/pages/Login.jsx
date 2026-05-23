import { useState } from 'react'
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import axios from 'axios'
import '../styles/Auth.css'

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : 'https://backend-glasses-2.onrender.com')

export default function Login() {
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [showPassword, setShowPass]   = useState(false)
  const [error, setError]             = useState('')
  const [loading, setLoading]         = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(
        `${API}/api/auth/admin-login`,
        { email, password },
        { withCredentials: true }
      )
      // store token in localStorage as fallback for cross-origin cookie issues
      if (res.data.token) {
        localStorage.setItem('adminToken', res.data.token)
      }
      window.location.href = '/admin/home'
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-page'>
      <div className='login-container'>
        {/* Branding */}
        <div className='login-branding'>
         
          <p className='login-tagline'>Admin Dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className='login-form'>
          <h2 className='login-title'>Welcome Back</h2>
          <p className='login-subtitle'>Sign in to your admin account</p>

          {/* Error Message */}
          {error && <div className='error-message'>{error}</div>}

          {/* Email Field */}
          <div className='form-group'>
            <label className='form-label'>Email Address</label>
            <div className='input-wrapper'>
              <IoMailOutline className='input-icon' size={18} />
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='form-input'
                placeholder='Enter Email'
                disabled={loading}
                autoComplete='email'
              />
            </div>
          </div>

          {/* Password Field */}
          <div className='form-group'>
            <label className='form-label'>Password</label>
            <div className='input-wrapper'>
              <IoLockClosedOutline className='input-icon' size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='form-input'
                placeholder='Enter Password'
                disabled={loading}
                autoComplete='current-password'
              />
              <button
                type='button'
                onClick={() => setShowPass(!showPassword)}
                className='toggle-password'
                disabled={loading}
              >
                {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button 
            type='submit' 
            className={`login-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          

          
        </form>

        
      </div>
    </div>
  )
}