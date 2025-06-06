'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      router.push('/register');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();
      // console.log('Login response:', { status: response.status, data }); 

      if (response.ok) {
        localStorage.setItem('auth', data.token);
        router.push('/register');
      } else {
        setError(data.message || 'Invalid PIN');
      }
    } catch (err) {
      // console.error('Login error:', err); 
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

  const navigateToMembers = () => {
    router.push('/register');
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">ITD Staff Login</h1>
      <div className="navigation">
        <button onClick={navigateToMembers} className="btn btn-outline">
          Register
        </button>
      </div>
      <form onSubmit={handleSubmit} className={`auth-form ${isLoading ? 'loading' : ''}`}>
        <div className="form-group">
          <label htmlFor="pin" className="form-label required">Staff PIN</label>
          <div className="input-group">
            <input
              type={showPin ? "text" : "password"}
              id="pin"
              className="form-control"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="input-group-btn"
              onClick={togglePinVisibility}
              tabIndex="-1"
            >
              {showPin ? '🔒' : '👁️'}
            </button>
          </div>
          {error && <div className="error-text">{error}</div>}
        </div>
        <button
          type="submit"
          className="btn-submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  );
}
