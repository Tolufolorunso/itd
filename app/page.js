'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

      if (response.ok) {
        localStorage.setItem('auth', data.token);
        router.push('/register');
      } else {
        setError(data.message || 'Invalid PIN');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="paper">
        <h1 className="title">ITD Staff Login</h1>
        <form onSubmit={handleSubmit} className={isLoading ? 'loading' : ''}>
          <div className="form-group">
            <label htmlFor="pin" className="form-label required">Staff PIN</label>
            <input
              type="password"
              id="pin"
              className="form-control"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              disabled={isLoading}
            />
            {error && <div className="error-text">{error}</div>}
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-full"
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
    </div>
  );
}
